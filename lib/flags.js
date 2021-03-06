const VNODE_FLAGS = {
    HTML_ELEMENT: 1,
    SVG_ELEMENT: 1 << 1,

    NORMAL_STATEFUL_COMPONENT: 1 << 2,
    SHOULD_KEEP_ALIVE_STATEFUL_COMPONENT: 1 << 3,
    KEPT_ALIVE_STATEFUL_COMPONENT: 1 << 4,
    FUNCTIONAL_COMPONENT: 1 << 5,

    TEXT: 1 << 6,

    FRAGMENT: 1 << 7,

    PORTAL: 1 << 8,
};

VNODE_FLAGS.ELEMENT = VNODE_FLAGS.HTML_ELEMENT || VNODE_FLAGS.SVG_ELEMENT;

VNODE_FLAGS.STATEFUL_COMPONENT =
    VNODE_FLAGS.NORMAL_STATEFUL_COMPONENT ||
    VNODE_FLAGS.SHOULD_KEEP_ALIVE_STATEFUL_COMPONENT ||
    VNODE_FLAGS.KEPT_ALIVE_STATEFUL_COMPONENT;

VNODE_FLAGS.COMPONENT =
    VNODE_FLAGS.STATEFUL_COMPONENT || VNODE_FLAGS.FUNCTIONAL_COMPONENT;

const CHILDREN_FLAGS = {
    UNKNOWN_CHILDREN: 0,
    NO_CHILDREN: 1,
    SINGLE_VNODE: 1 << 1,

    KEYED_VNODES: 1 << 2,
    NONE_KEYED_VNODES: 1 << 3,
};

CHILDREN_FLAGS.MULTIPLE_VNODES =
    CHILDREN_FLAGS.KEYED_VNODES || CHILDREN_FLAGS.NONE_KEYED_VNODES;

module.exports = { VNODE_FLAGS, CHILDREN_FLAGS };
