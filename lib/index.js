import {
    create_vnode,
    create_text_vnode,
    FRAGMENT,
    PORTAL,
} from './create_vnode';

console.log(create_vnode('div', null, h('span')));

console.log(create_text_vnode('div', null, '我是文本'));

console.log(create_vnode(FRAGMENT, null, [h('td'), h('td')]));

console.log(
    create_vnode(
        PORTAL,
        {
            target: '#box',
        },
        h('h1')
    )
);

function MyFunctionalComponent() {}
console.log(create_vnode(MyFunctionalComponent, null, h('div')));

class MyStatefulComponent {}
console.log(create_vnode(MyStatefulComponent, null, h('div')));
