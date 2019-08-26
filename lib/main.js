import { h } from './vnode';
import render from './render';

const el = h('div', {
    style: {
        height: '100px',
        width: '100px',
        background: 'red',
    },
});

render(el, document.getElementById('app'));
