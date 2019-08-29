const { create_vnode } = require('./create_vnode.js');
const { render } = require('./renderer');

function handler() {
    alert('click me');
}

const elementVnode = create_vnode('div', {
    style: {
        width: '100px',
        height: '100px',
        backgroundColor: 'red',
    },
    onclick: handler,
});

render(elementVnode, document.getElementById('app'));

// console.log(create_vnode('div', null, create_vnode('span')));

// console.log(create_text_vnode('div', null, '我是文本'));

// console.log(
//     create_vnode(FRAGMENT, null, [create_vnode('td'), create_vnode('td')])
// );

// console.log(
//     create_vnode(
//         PORTAL,
//         {
//             target: '#box',
//         },
//         create_vnode('h1')
//     )
// );

// function MyFunctionalComponent() {}
// console.log(create_vnode(MyFunctionalComponent, null, create_vnode('div')));

// class Component {
//     render() {
//         throw '组件缺少 render 函数';
//     }
// }

// class MyStatefulComponent extends Component {}
// console.log(create_vnode(MyStatefulComponent, null, create_vnode('div')));
