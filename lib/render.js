const { VNodeFlags, ChildrenFlags } = require('./flags');
const { createTextVNode } = require('./vnode');

/**
 * render vnode in container
 * @param {VNode} vnode
 * @param container
 */
export default function render(vnode, container) {
    const prevVNode = container.vnode;

    if (prevVNode == null) {
        if (vnode) {
            // no old VNode
            mount(vnode, container);
            container.vnode = vnode;
        }
    } else {
        if (vnode) {
            patch(prevVNode, vnode, container);
            container.vnode = vnode;
        } else {
            // no new vnode
            container.removeChild(prevVNode.el);
            container.vnode = null;
        }
    }
}

/**
 * mount VNode
 * @param {VNode} vnode
 * @param container
 * @param {boolean} isSVG
 */
function mount(vnode, container, isSVG) {
    const { flags } = vnode;
    if (flags & VNodeFlags.ELEMENT) {
        mountElement(vnode, container, isSVG);
    } else if (flags & VNodeFlags.COMPONENT) {
        mountComponent(vnode, container, isSVG);
    } else if (flags & VNodeFlags.TEXT) {
        mountText(vnode, container);
    } else if (flags & VNodeFlags.FRAGMENT) {
        mountFragment(vnode, container, isSVG);
    } else if (flags & VNodeFlags.PORTAL) {
        mountPortal(vnode, container, isSVG);
    }
}

/**
 * mount element VNode
 * @param {VNode} vnode
 * @param container
 * @param {boolean} isSVG
 */
function mountElement(vnode, container, isSVG) {
    isSVG = isSVG || vnode.flags & VNodeFlags.ELEMENT_SVG
    const el = isSVG
        ? document.createElementNS('http://www.w3.org/2000/svg', vnode.tag)
        : document.createElement(vnode.tag);

    vnode.el = el;

    const data = vnode.data;
    if (data) {
        for (let key in data) {
            switch (key) {
                case 'style':
                    for (let k in data.style) {
                        el.style[k] = data.style[k];
                    }
                    break;
                default:
                    break;
            }
        }
    }

    const childFlags = vnode.childFlags;
    const children = vnode.children;
    if (childFlags !== ChildrenFlags.NO_CHILDREN) {
        if (childFlags & ChildrenFlags.SINGLE_VNODE) {
            mount(children, el, isSVG);
        } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
            vnode.children.forEach(child => {
                mountElement(child, el, isSVG);
            });
        }
    }

    container.appendChild(el);
}
