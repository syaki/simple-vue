import { h, Fragment, Portal } from './vnode';
import render from './render';

// 旧的 VNode
const prevVNode = h('div', null, h('p', null, '只有一个子节点'));

// 新的 VNode
const nextVNode = h('div', null, [
    h('p', null, '子节点 1'),
    h('p', null, '子节点 2'),
]);

render(prevVNode, document.getElementById('app'));

// 2秒后更新
setTimeout(() => {
    render(nextVNode, document.getElementById('app'));
}, 2000);
