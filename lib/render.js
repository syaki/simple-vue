const { VNodeFlags, ChildrenFlags } = require('./flags');
const { createTextVNode } = require('./vnode');

const domPropsRE = /\[A-Z]|^(?:value|checked|selected|muted)$/;

/**
 * render vnode in container
 * @param {VNode} vnode
 * @param {HTMLElement} container
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
 * @param {HTMLElement} container
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
 * mount fragment VNode
 * @param {VNode} vnode
 * @param {HTMLElement} container
 * @param {boolean} isSVG
 */
function mountFragment(vnode, container, isSVG) {
    const { children, childFlags } = vnode;
    switch (childFlags) {
        case ChildrenFlags.SINGLE_VNODE:
            mount(children, container, isSVG);
            vnode.el = children.el;
            break;
        case ChildrenFlags.NO_CHILDREN:
            const placeholder = createTextVNode('');
            mountText(placeholder, container);
            vnode.el = placeholder.el;
            break;
        default:
            children.forEach(child => {
                mount(child, container, isSVG);
            });
            vnode.el = children[0].el;
    }
}

/**
 * mount text VNode
 * @param {VNode} vnode
 * @param {HTMLElement} container
 */
function mountText(vnode, container) {
    const el = document.createTextNode(vnode.children);
    vnode.el = el;
    container.appendChild(el);
}

/**
 * mount element VNode
 * @param {VNode} vnode
 * @param {HTMLElement} container
 * @param {boolean} isSVG
 */
function mountElement(vnode, container, isSVG) {
    isSVG = isSVG || vnode.flags & VNodeFlags.ELEMENT_SVG;
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
                case 'class':
                    if (isSVG) {
                        el.setAttribute('class', data[key]);
                    } else {
                        el.className = data[key];
                    }
                    break;
                default:
                    if (key[0] === 'o' && key[1] === 'n') {
                        el.addEventListener(key.slice(2), data[key]);
                    } else if (domPropsRE.test(key)) {
                        // DOM Prop
                        el[key] = data[key];
                    } else {
                        // Attribute
                        el.setAttribute(key, data[key]);
                    }
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
