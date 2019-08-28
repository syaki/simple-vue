class VNode {
    constructor(el, flag, tag, data, children, children_flag) {
        this.is_vnode = true;

        this.el = el;
        this.flag = flag;
        this.tag = tag;
        this.data = data;
        this.children = children;
        this.children_flag = children_flag;
    }
}

export { VNode };
