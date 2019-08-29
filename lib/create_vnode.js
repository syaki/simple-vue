import { VNODE_FLAGS, CHILDREN_FLAGS } from './flags';

export const FRAGMENT = Symbol();
export const PORTAL = Symbol();

/**
 * create VNode
 * @param {*} tag
 * @param {*} data
 * @param {*} children
 * @returns {{child_flag: Number, flag: Number, data: *, is_vnode: Boolean, children: *, el: null, tag: *}}
 */
export function create_vnode(tag, data = null, children = null) {
    let flag = null;
    set_flag();

    let child_flag = null;
    set_child_flag();

    return {
        is_vnode: true,
        flag,
        tag,
        data,
        children,
        child_flag,
        el: null,
    };

    function set_flag() {
        if (typeof tag === 'string') {
            flag =
                tag === 'svg'
                    ? VNODE_FLAGS.SVG_ELEMENT
                    : VNODE_FLAGS.HTML_ELEMENT;
        } else if (tag === FRAGMENT) {
            flag = VNODE_FLAGS.FRAGMENT;
        } else if (tag === PORTAL) {
            flag = VNODE_FLAGS.PORTAL;
            tag = data && data.target;
        } else if (tag !== null && typeof tag === 'object') {
            // Vue2 object component
            flag = tag.functional
                ? VNODE_FLAGS.FUNCTIONAL_COMPONENT
                : VNODE_FLAGS.NORMAL_STATEFUL_COMPONENT;
        } else if (typeof tag === 'function') {
            // Vue3 class component
            flag =
                tag.prototype && tag.prototype.render
                    ? VNODE_FLAGS.NORMAL_STATEFUL_COMPONENT
                    : VNODE_FLAGS.FUNCTIONAL_COMPONENT;
        }
    }

    function set_child_flag() {
        if (Array.isArray(children)) {
            const length = children.length;
            switch (length) {
                case 0:
                    child_flag = CHILDREN_FLAGS.NO_CHILDREN;
                    break;
                case 1:
                    child_flag = CHILDREN_FLAGS.SINGLE_VNODE;
                    children = children[0];
                    break;
                default:
                    child_flag = CHILDREN_FLAGS.KEYED_VNODES;
                    children = normalize_vnodes(children);
            }
        } else if (children == null) {
            child_flag = CHILDREN_FLAGS.NO_CHILDREN;
        } else if (children.is_vnode) {
            child_flag = CHILDREN_FLAGS.SINGLE_VNODE;
        } else {
            child_flag = CHILDREN_FLAGS.SINGLE_VNODE;
            children = create_text_vnode(`${children}`);
        }
    }
}

/**
 * add key
 * @param {Array} children
 * @returns {Array}
 */
function normalize_vnodes(children) {
    let new_children = [];

    children.forEach((child, index) => {
        if (child.key == null) {
            child.key = `|${index}`;
        }
        new_children.push(child);
    });

    return new_children;
}

/**
 * create text VNode
 * @param {String} text
 * @returns {{is_vnode: Boolean, flag: Number, tag: null, data: null, childreb: String, child_flag: Number}}
 */
export function create_text_vnode(text) {
    return {
        is_vnode: true,
        flag: VNODE_FLAGS.TEXT,
        tag: null,
        data: null,
        children: text,
        child_flag: CHILDREN_FLAGS.NO_CHILDREN,
    };
}
