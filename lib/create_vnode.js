import { VNODE_FLAGS, CHILDREN_FLAGS } from './flags';
import { VNode } from './vnode';

const FRAGMENT = Symbol();
const PORTAL = Symbol();

function create_vnode(tag, data, children) {
    let { flag, tag } = set_flag(flag, tag, data);
}

function set_flag(flag, tag, data) {
    if (typeof tag === 'string') {
        flag =
            tag === 'svg' ? VNODE_FLAGS.SVG_ELEMENT : VNODE_FLAGS.HTML_ELEMENT;
    } else if (tag === FRAGMENT) {
        flag = VNODE_FLAGS.FRAGMENT;
    } else if (tag === PORTAL) {
        flag = VNODE_FLAGS.PORTAL;
        tag = data && data.target;
    } else {
        if (tag !== null && typeof tag === 'object') {
            flag = tag.functional
                ? VNODE_FLAGS.FUNCTIONAL_COMPONENT
                : VNODE_FLAGS.NORMAL_STATEFUL_COMPONENT;
        }
    }

    return { flag, tag };
}

export { FRAGMENT, PORTAL };
