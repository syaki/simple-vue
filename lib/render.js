const { VNodeFlags, ChildrenFlags } = require('./flags');
const { createTextVNode } = require('./vnode');

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
 * @param vnode
 * @param container
 */
function mount(vnode, container) {
    const { flags } = vnode;
    if (flags & VNodeFlags.ELEMENT) {
        mountElement(vnode, container);
    } else if (flags & VNodeFlags.COMPONENT) {
        mountComponent(vnode, container);
    } else if (flags & VNodeFlags.TEXT) {
        mountText(vnode, container);
    } else if (flags & VNodeFlags.FRAGMENT) {
        mountFragment(vnode, container);
    } else if (flags & VNodeFlags.PORTAL) {
        mountPortal(vnode, container);
    }
}

/**
 * mount element VNode
 * @param vnode
 * @param container
 */
function mountElement(vnode, container) {
    const el = document.createElement(vnode.tag);
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
            mount(children, el);
        } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
            vnode.children.forEach(child => {
                mountElement(child, el);
            });
        }
    }

    container.appendChild(el);
}
