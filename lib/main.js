import { h, Fragment, Portal } from './vnode';
import render from './render';

function MyFunctionalComponent() {
    // 返回要渲染的内容描述，即 VNode
    return h(
        'div',
        {
            style: {
                background: 'green',
            },
        },
        [
            h('span', null, '我是组件的标题1......'),
            h('span', null, '我是组件的标题2......'),
        ]
    );
}

const compVnode = h(MyFunctionalComponent);
render(compVnode, document.getElementById('app'));
