# 渲染控制

## useMemo ？
｜--------问与答---------｜

详细介绍一下 useMemo ？

useMemo 用法：

const cacheSomething = useMemo(create,deps)
create：第一个参数为一个函数，函数的返回值作为缓存值，如上 demo 中把 Children 对应的 element 对象，缓存起来。
deps： 第二个参数为一个数组，存放当前 useMemo 的依赖项，在函数组件下一次执行的时候，会对比 deps 依赖项里面的状态，是否有改变，如果有改变重新执行 create ，得到新的缓存值。
cacheSomething：返回值，执行 create 的返回值。如果 deps 中有依赖项改变，返回的重新执行 create 产生的值，否则取上一次缓存值。
useMemo 原理：

useMemo 会记录上一次执行 create 的返回值，并把它绑定在函数组件对应的 fiber 对象上，只要组件不销毁，缓存值就一直存在，但是 deps 中如果有一项改变，就会重新执行 create ，返回值作为新的值记录到 fiber 对象上。

useMemo 应用场景：

可以缓存 element 对象，从而达到按条件渲染组件，优化性能的作用。
如果组件中不期望每次 render 都重新计算一些值,可以利用 useMemo 把它缓存起来。
可以把函数和属性缓存起来，作为 PureComponent 的绑定方法，或者配合其他 Hooks 一起使用。

｜--------end---------｜

##  什么时候需要注意渲染节流。
- 第一种情况**数据可视化的模块组件（展示了大量的数据）**，这种情况比较小心因为一次更新，可能伴随大量的 diff ，数据量越大也就越浪费性能，所以对于数据展示模块组件，有必要采取 memo ， shouldComponentUpdate 等方案控制自身组件渲染。

- 第二种情况含有**大量表单的页面**，React 一般会采用受控组件的模式去管理表单数据层，表单数据层完全托管于 props 或是 state ，而用户操作表单往往是频繁的，需要频繁改变数据层，所以很有可能让整个页面组件高频率 render 。

- 第三种情况就是越是**靠近 app root 根组件**越值得注意，根组件渲染会波及到整个组件树重新 render ，子组件 render ，一是浪费性能，二是可能执行 useEffect ，componentWillReceiveProps 等钩子，造成意想不到的情况发生。


## key 最好选择唯一性的id

如果选择 Index 作为 key ，如果元素发生移动，那么从移动节点开始，接下来的 fiber 都不能做得到合理的复用。 index 拼接其他字段也会造成相同的效果。


