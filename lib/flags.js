/**
 * VNode flags
 * @type {{ELEMENT_SVG: number, COMPONENT_STATEFUL_KEEP_ALIVE: number, COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE: number, FRAGMENT: number, COMPONENT_STATEFUL_NORMAL: number, TEXT: number, ELEMENT_HTML: number, COMPONENT_FUNCTIONAL: number, PORTAL: number}}
 */
const VNodeFlags = {
    // element tag
    ELEMENT_HTML: 1,
    ELEMENT_SVG: 1 << 1,

    // component
    COMPONENT_STATEFUL_NORMAL: 1 << 2,
    COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE: 1 << 3,
    COMPONENT_STATEFUL_KEEP_ALIVE: 1 << 4,
    COMPONENT_FUNCTIONAL: 1 << 5,

    // text
    TEXT: 1 << 6,

    // fragment
    FRAGMENT: 1 << 7,

    // portal
    PORTAL: 1 << 8,
};

// element: html || svg
VNodeFlags.ELEMENT = VNodeFlags.ELEMENT_HTML | VNodeFlags.ELEMENT_SVG;

// stateful component
VNodeFlags.COMPONENT_STATEFUL =
    VNodeFlags.COMPONENT_STATEFUL_NORMAL |
    VNodeFlags.COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE |
    VNodeFlags.COMPONENT_STATEFUL_KEPT_ALIVE;

// component: stateful || functional
VNodeFlags.COMPONENT =
    VNodeFlags.COMPONENT_STATEFUL | VNodeFlags.COMPONENT_FUNCTIONAL;

/**
 * children flags
 * @type {{NO_CHILDREN: number, NONE_KEYED_VNODES: number, KEYED_VNODES: number, UNKNOWN_CHILDREN: number, SINGLE_VNODE: number}}
 */
const ChildrenFlags = {
    // unknown children type
    UNKNOWN_CHILDREN: 0,

    // no children
    NO_CHILDREN: 1,

    // children: single VNode
    SINGLE_VNODE: 1 << 1,

    // children: multiple VNodes with key
    KEYED_VNODES: 1 << 2,

    // children: multiple VNodes without key
    NONE_KEYED_VNODES: 1 << 3,
};

// children (multiple VNodes): keyed || none keyed
ChildrenFlags.MULTIPLE_VNODES =
    ChildrenFlags.KEYED_VNODES | ChildrenFlags.NONE_KEYED_VNODES;

module.exports = { VNodeFlags, ChildrenFlags };
