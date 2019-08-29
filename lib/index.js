const {
    create_vnode,
    create_text_vnode,
    FRAGMENT,
    PORTAL,
} = require('./create_vnode.js');

console.log(create_vnode('div', null, create_vnode('span')));

console.log(create_text_vnode('div', null, '我是文本'));

console.log(
    create_vnode(FRAGMENT, null, [create_vnode('td'), create_vnode('td')])
);

console.log(
    create_vnode(
        PORTAL,
        {
            target: '#box',
        },
        create_vnode('h1')
    )
);

function MyFunctionalComponent() {}
console.log(create_vnode(MyFunctionalComponent, null, create_vnode('div')));

class MyStatefulComponent {}
console.log(create_vnode(MyStatefulComponent, null, create_vnode('div')));
