import { h, Fragment } from './vnode';
import render from './render';

const el = h(
    'div',
    {
        style: {
            width: '100px',
            height: '100px',
            backgroundColor: 'red',
        },
        // 点击事件
        onclick: handler,
    },
    h(Fragment, null, [
        h('span', null, 'title 1......'),
        h('span', null, 'title 2......'),
    ])
);

function handler() {
    alert('click me');
}

render(el, document.getElementById('app'));
