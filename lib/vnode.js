import { VNodeFlags, ChildrenFlags } from './flags';

export const Fragment = Symbol();
export const Portal = Symbol();

export class VNode {
    constructor(_isVNode, flags, tag, data, children, childFlags, el) {
        this._isVNode = _isVNode;
        this.flags = flags;
        this.tag = tag;
        this.data = data;
        this.children = children;
        this.childFlags = childFlags;
        this.el = el;
    }
}

/**
 * create VNode
 * @param tag
 * @param data
 * @param children
 * @returns {VNode}
 */
export function h(tag, data = null, children = null) {
    // set flags & tag
    let flags = null;

    if (typeof tag === 'string') {
        flags =
            tag === 'svg' ? VNodeFlags.ELEMENT_SVG : VNodeFlags.ELEMENT_HTML;
    } else if (tag === Fragment) {
        flags = VNodeFlags.FRAGMENT;
    } else if (tag === Portal) {
        flags = VNodeFlags.PORTAL;
        tag = data && data.target;
    } else {
        // compatible Vue2
        if (tag !== null && typeof tag === 'object') {
            // Vue2 object component
            flags = tag.functional
                ? VNodeFlags.COMPONENT_FUNCTIONAL
                : VNodeFlags.COMPONENT_STATEFUL_NORMAL;
        } else if (typeof tag === 'function') {
            // Vue3 class component
            flags =
                tag.prototype && tag.prototype.render
                    ? VNodeFlags.COMPONENT_STATEFUL_NORMAL
                    : VNodeFlags.COMPONENT_FUNCTIONAL;
        }
    }

    // set children flags
    let childFlags = null;

    if (Array.isArray(children)) {
        const { length } = children;
        if (length === 0) {
            // no children
            childFlags = ChildrenFlags.NO_CHILDREN;
        } else if (length === 1) {
            // single VNode
            childFlags = ChildrenFlags.SINGLE_VNODE;
            children = children[0];
        } else {
            // multiple VNode with key
            childFlags = ChildrenFlags.KEYED_VNODES;
            children = normalizeVNodes(children);
        }
    } else if (children == null) {
        // no children
        childFlags = ChildrenFlags.NO_CHILDREN;
    } else if (children._isVNode) {
        // single VNode
        childFlags = ChildrenFlags.SINGLE_VNODE;
    } else {
        // text VNode
        childFlags = ChildrenFlags.SINGLE_VNODE;
        children = createTextVNode(children + '');
    }

    return new VNode(true, flags, tag, data, children, childFlags, null);
}

/**
 * create children VNode when multiple VNode with key
 * @param {Array} children
 * @returns {[]}
 */
function normalizeVNodes(children) {
    const newChildren = [];
    // map children
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.key == null) {
            child.key = `|${i}`;
        }
        newChildren.push(child);
    }
    // return children: ChildrenFlags.KEYED_VNODES
    return newChildren;
}

/**
 * create text VNode
 * @param {string} text
 * @returns {VNode}
 */
export function createTextVNode(text) {
    return new VNode(
        true,
        VNodeFlags.TEXT,
        null,
        null,
        text,
        ChildrenFlags.NO_CHILDREN
    );
}
