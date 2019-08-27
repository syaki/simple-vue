import { h } from './vnode';
import render from './render';

const el = h('input', {
    class: 'cls-a',
    type: 'checkbox',
    checked: true,
    custom: '1',
});

render(el, document.getElementById('app'));
