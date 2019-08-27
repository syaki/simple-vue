import { h } from './vnode';
import render from './render';

const el = h(
    'div',
    {
        style: {
            height: '100px',
            width: '100px',
            background: 'red',
        },
    },
    h('div', {
        style: {
            height: '50px',
            width: '50px',
            background: 'green',
        },
    })
);

render(el, document.getElementById('app'));
