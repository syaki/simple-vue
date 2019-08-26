const { h, Fragment, Portal } = require('./vnode');

// 一个函数式组件
function MyFunctionalComponent() {}

// 传递给 h 函数的第一个参数就是组件函数本身
const functionalComponentVNode = h(MyFunctionalComponent, null, h('div'));

// 有状态组件
class MyStatefulComponent {}
const statefulComponentVNode = h(MyStatefulComponent, null, h('div'));

console.log(statefulComponentVNode);
