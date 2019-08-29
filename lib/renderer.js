const { VNODE_FLAGS, CHILDREN_FLAGS } = require('./flags');
const { create_text_vnode } = require('./create_vnode');

/**
 * render VNode to DOM
 * @param {{child_flag: Number, flag: Number, data: *, is_vnode: Boolean, children: *, el: null, tag: *}} vnode
 * @param {HTMLElement} container
 */
function render(vnode, container) {
    const prev_vnode = container.vnode;

    if (prev_vnode == null) {
        if (vnode) {
            mount(vnode, container);
            container.vnode = vnode;
        }
    } else {
        if (vnode) {
            patch(prev_vnode, vnode, container);
            container.vnode = vnode;
        } else {
            container.removeChild(prev_vnode.el);
            container.vnode = null;
        }
    }
}

/**
 * mount VNode
 * @param {{child_flag: Number, flag: Number, data: *, is_vnode: Boolean, children: *, el: null, tag: *}} vnode
 * @param {HTMLElement} container
 * @param {Boolean} is_svg
 */
function mount(vnode, container, is_svg) {
    const flag = vnode.flag;

    if (flag & VNODE_FLAGS.ELEMENT) {
        mount_element(vnode, container, is_svg);
    }
    // TODO
}

/**
 * mount normal element
 * @param {{child_flag: Number, flag: Number, data: *, is_vnode: Boolean, children: *, el: null, tag: *}} vnode
 * @param {HTMLElement} container
 * @param {Boolean} is_svg
 */
function mount_element(vnode, container, is_svg) {
    is_svg = is_svg || vnode.flag & VNODE_FLAGS.SVG_ELEMENT;

    const el = is_svg
        ? document.createElementNS('http://www.w3.org/2000/svg', vnode.tag)
        : document.createElement(vnode.tag);

    vnode.el = el;

    const data = vnode.data;

    if (data) {
        for (let key in data) {
            patch_data(el, key, null, data[key]);
        }
    }

    const child_flag = vnode.child_flag;
    const children = vnode.childrcreate_vnodeen;

    if (child_flag !== CHILDREN_FLAGS.NO_CHILDREN) {
        if (child_flag & CHILDREN_FLAGS.SINGLE_VNODE) {
            mount(children, el, is_svg);
        } else if (child_flag & CHILDREN_FLAGS.MULTIPLE_VNODES) {
            children.forEach(child => {
                mount(child, el, is_svg);
            });
        }
    }

    container.appendChild(el);
}

/**
 * patch VNode data
 * @param {HTMLElement} el
 * @param {String} key
 * @param {null} prev_value
 * @param {String} next_value
 */
function patch_data(el, key, prev_value, next_value) {
    const dom_props_re = /\W|^(?:value|checked|selected|muted)$/;

    switch (key) {
        case 'style':
            for (let k in next_value) {
                el.style[k] = next_value[k];
            }
            for (let k in prev_value) {
                if (!next_value.hasOwnProperty(k)) {
                    el.style[k] = '';
                }
            }
            break;
        case 'class':
            el.className = next_value;
            break;
        default:
            if (key[0] === 'o' && key[1] === 'n') {
                if (prev_value) {
                    el.removeEventListener(key.slice(2), prev_value);
                }
                if (next_value) {
                    el.addEventListener(key.slice(2), next_value);
                }
            } else if (dom_props_re.test(key)) {
                el[key] = next_value;
            } else {
                el.setAttribute(key, next_value);
            }
            break;
    }
}

module.exports = { render };
