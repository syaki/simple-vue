import { h } from './vnode';
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
    'Hello world'
);

function handler() {
    alert('click me');
}

render(el, document.getElementById('app'));
