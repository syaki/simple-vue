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
 * patch VNode
 * @param {VNode} prevVNode
 * @param {VNode} nextVNode
 * @param {HTMLElement} container
 */
function patch(prevVNode, nextVNode, container) {
    const prevFlags = prevVNode.flags;
    const nextFlags = nextVNode.flags;

    if (prevFlags !== nextFlags) {
        replaceVNode(prevVNode, nextVNode, container);
    } else if (nextFlags & VNodeFlags.ELEMENT) {
        patchElement(prevVNode, nextVNode, container);
    } else if (nextFlags & VNodeFlags.COMPONENT) {
        patchComponent(prevVNode, nextVNode, container);
    } else if (nextFlags & VNodeFlags.TEXT) {
        patchText(prevVNode, nextVNode);
    } else if (nextFlags & VNodeFlags.FRAGMENT) {
        patchFragment(prevVNode, nextVNode, container);
    } else if (nextFlags & VNodeFlags.PORTAL) {
        patchPortal(prevVNode, nextVNode);
    }
}

function patchPortal(prevVNode, nextVNode) {
    patchChildren(
        prevVNode.childFlags,
        nextVNode.childFlags,
        prevVNode.children,
        nextVNode.children,
        prevVNode.tag
    );

    nextVNode.el = prevVNode.el;

    if (nextVNode.tag !== prevVNode.tag) {
        const container =
            typeof nextVNode.tag === 'string'
                ? document.querySelector(nextVNode.tag)
                : nextVNode.tag;

        switch (nextVNode.childFlags) {
            case ChildrenFlags.SINGLE_VNODE:
                container.appendChild(nextVNode.children.el);
                break;
            case ChildrenFlags.NO_CHILDREN:
                break;
            default:
                nextVNode.children.forEach(child => {
                    container.appendChild(child.el);
                });
                break;
        }
    }
}

function patchFragment(prevVNode, nextVNode, container) {
    patchChildren(
        prevVNode.childFlags,
        nextVNode.childFlags,
        prevVNode.children,
        nextVNode.children,
        container
    );

    switch (nextVNode.childFlags) {
        case ChildrenFlags.SINGLE_VNODE:
            nextVNode.el = nextVNode.children.el;
            break;
        case ChildrenFlags.NO_CHILDREN:
            nextVNode.el = prevVNode.el;
            break;
        default:
            nextVNode.el = nextVNode.children[0].el;
            break;
    }
}

function patchText(prevVNode, nextVNode) {
    const el = (nextVNode.el = prevVNode.el);

    if (nextVNode.children !== prevVNode.children) {
        el.nodeValue = nextVNode.children;
    }
}

/**
 * patch element VNode
 * @param {VNode} prevVNode
 * @param {VNode} nextVNode
 * @param {HTMLElement} container
 */
function patchElement(prevVNode, nextVNode, container) {
    if (prevVNode.tag !== nextVNode.tag) {
        replaceVNode(prevVNode, nextVNode, container);
        return;
    }

    const el = (nextVNode.el = prevVNode.el);
    const prevData = prevVNode.data;
    const nextData = nextVNode.data;

    if (nextData) {
        for (let key in nextData) {
            const prevValue = prevData[key];
            const nextValue = nextData[key];

            patchData(el, key, prevValue, nextValue);
        }
    }
    if (prevData) {
        for (let key in prevData) {
            const prevValue = prevData[key];
            if (prevValue && !nextData.hasOwnProperty(key))
                patchData(el, key, prevValue, null);
        }
    }

    patchChildren(
        prevVNode.childFlags,
        nextVNode.childFlags,
        prevVNode.children,
        nextVNode.children,
        el
    );
}

/**
 * patch children VNode
 * @param {*} prevChildFlags
 * @param {*} nextChildFlags
 * @param {*} prevChildren
 * @param {*} nextChildren
 * @param {*} container
 */
function patchChildren(
    prevChildFlags,
    nextChildFlags,
    prevChildren,
    nextChildren,
    container
) {
    switch (prevChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
            switch (nextChildFlags) {
                case ChildrenFlags.SINGLE_VNODE:
                    patch(prevChildren, nextChildren, container);
                    break;
                case ChildrenFlags.NO_CHILDREN:
                    container.removeChild(prevChildren.el);
                    break;
                default:
                    container.removeChild(prevChildren.el);
                    nextChildren.forEach(nextChild => {
                        mount(nextChild, container);
                    });
                    break;
            }
            break;
        case ChildrenFlags.NO_CHILDREN:
            switch (nextChildFlags) {
                case ChildrenFlags.SINGLE_VNODE:
                    mount(nextChildren, container);
                    break;
                case ChildrenFlags.NO_CHILDREN:
                    break;
                default:
                    nextChildren.forEach(nextChild => {
                        mount(nextChild, container);
                    });
                    break;
            }
            break;
        default:
            switch (nextChildFlags) {
                case ChildrenFlags.SINGLE_VNODE:
                    prevChildren.forEach(prevChild => {
                        container.removeChild(prevChild.el);
                    });
                    mount(nextChildren, container);
                    break;
                case ChildrenFlags.NO_CHILDREN:
                    prevChildren.forEach(prevChild => {
                        container.removeChild(prevChild.el);
                    });
                    break;
                default:
                    prevChildren.forEach(prevChild => {
                        container.removeChild(prevChild.el);
                    });
                    nextChildren.forEach(nextChild => {
                        mount(nextChild, container);
                    });
                    break;
            }
            break;
    }
}

/**
 * patch data
 * @param {HTMLElement} el
 * @param {string} key
 * @param {*} prevValue
 * @param {*} nextValue
 */
export function patchData(el, key, prevValue, nextValue) {
    switch (key) {
        case 'style':
            for (let k in nextValue) {
                el.style[k] = nextValue[k];
            }

            for (let k in prevValue) {
                if (!nextValue.hasOwnProperty(k)) el.style[k] = '';
            }
            break;
        case 'class':
            el.className = nextValue;
            break;
        default:
            if (key[0] === 'o' && key[1] === 'n') {
                if (prevValue) {
                    el.removeEventListener(key.slice(2), prevValue);
                }
                if (nextValue) {
                    el.addEventListener(key.slice(2), nextValue);
                }
            } else if (domPropsRE.test(key)) {
                el[key] = nextValue;
            } else {
                el.setAttribute(key, nextValue);
            }
            break;
    }
}

/**
 * remove old VNode & mount new VNode
 * @param {VNode} prevVNode
 * @param {VNode} nextVNode
 * @param {HTMLElement} container
 */
function replaceVNode(prevVNode, nextVNode, container) {
    container.removeChild(prevVNode.el);

    mount(nextVNode, container);
    // TODO: have defect
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

function mountComponent(vnode, container, isSVG) {
    if (vnode.flags & VNodeFlags.COMPONENT_STATEFUL) {
        mountStatefulComponent(vnode, container, isSVG);
    } else {
        mountFunctionalComponent(vnode, container, isSVG);
    }
}

/**
 * mount functional component
 * @param {VNode} vnode
 * @param {HTMLElement} container
 * @param {boolean} isSVG
 */
function mountFunctionalComponent(vnode, container, isSVG) {
    const $vnode = vnode.tag();
    mount($vnode, container, isSVG);
    vnode.el = $vnode.el;
}

/**
 * mount stateful component
 * @param {VNode} vnode
 * @param {HTMLElement} container
 * @param {boolean} isSVG
 */
function mountStatefulComponent(vnode, container, isSVG) {
    const instance = new vnode.tag();

    instance.$vnode = instance.render();

    mount(instance.$vnode, container, isSVG);

    instance.$el = vnode.el = instance.$vnode.el;
}

/**
 * mount portal VNode
 * @param {VNode} vnode
 * @param {HTMLElement} container
 */
function mountPortal(vnode, container) {
    const { tag, children, childFlags } = vnode;

    const target = typeof tag === 'string' ? document.querySelector(tag) : tag;

    if (childFlags & ChildrenFlags.SINGLE_VNODE) {
        mount(children, target);
    } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
        children.forEach(child => {
            mount(child, target);
        });
    }

    const placeholder = createTextVNode('');
    mountText(placeholder, container, null);
    vnode.el = placeholder.el;
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
