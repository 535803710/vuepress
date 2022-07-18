# 类型

## 原始类型

- number
- string
- boolean
- null
- undefined
- symbol
- bigint
- void

其中，除了 `null` 与 `undefined` 以外，余下的类型基本上可以完全对应到 JavaScript 中的数据类型概念，因此这里我们只对 `null` 与 `undefined` 展开介绍。

`null` 和 `undefined` **在 TS 里都是有实际意义的类型** 和 JS 中不一样。

```typescript
const tmp1: null = null;
const tmp2: undefined = undefined;
// 以下两个仅在关闭 strictNullChecks 时成立
const tmp3: string = null;
const tmp4: string = undefined;
```

void 类型
用于描述没有 `return` 的函数返回值。

```ts
function func1() {}
function func2() {
  return;
}
function func3() {
  return undefined;
}
```

`func1` 和 `func2` 的返回值类型都会被隐式推导为 `void` ，只有显式返回了 `undefined` 值的 `func3` 其返回值类型才被推导为了 `undefined。`

## 数组的类型标注

在 TypeScript 中有两种方式来声明一个数组类型：

```ts
const arr1: string[] = [];

const arr2: Array<string> = [];
```

有时候我们可以使用 **元组（Tuple）**来代替数组更加妥当。

```ts
const arr4: [string, string, string] = ["1", "2", "3"];
console.log(arr4[599]);
```

这时就会报错。

在实际中我们又是会将元组中的元素打上标记，可以代替组装对象

```ts
const arr7: [name: string, age: number, male?: boolean] = ["xiaowo", 599, true];
```

在解构的时候也会有警告

```ts
const arr5: [string, number, boolean] = ["xiaowo", 599, true];

// 长度为 "3" 的元组类型 "[string, number, boolean]" 在索引 "3" 处没有元素。
const [name, age, male, other] = arr5;
```

**但使用元组确实能帮助我们进一步提升数组结构的严谨性，包括基于位置的类型标注、避免出现越界访问等等。**

## 对象的类型标注

在 ts 中我们用 `interface` 来描述对象类型。

```ts
interface IDescription {
  name: string;
  age: number;
  male: boolean;
}

const obj1: IDescription = {
  name: "linbudu",
  age: 599,
  male: true,
};
```

这里的描述指的是：

- 每一个属性的值必须一一对应到接口的属性类型

- 不能有多的属性，也不能有少的属性，包括直接在对象内部声明，或是 `obj1.other = 'xxx'` 这样属性访问赋值的形式

### 对象属性修饰

1. 可选 - 用 ?
2. 只读 - 用 readonly

### type 和 interface

虽然可以用 `type`（Type Alias，类型别名）来代替接口结构描述对象，

但是更推荐的方式是， `interface` 用来描述对象、类的结构，

而 `type` 类型别名用来将一个函数签名、一组联合类型、一个工具类型等等抽离成一个完整独立的类型。

### object、Object 以及 { }

Object , Number , String , Symbol , Boolean 是装箱类型

{} 对象字面量类型，作为类型前面是一个合法的，**但是内部属性无法定义的空对象，无法对这个变量进行任何赋值操作**

⚠️ 在任何时候都不要，不要，不要使用 Object 以及类似的装箱类型。

⚠️ 当你不确定某个变量的具体类型，但能确定它不是原始类型，可以使用 object。但我更推荐进一步区分，也就是使用 Record<string, unknown> 或 Record<string, any> 表示对象，unknown[] 或 any[] 表示数组，(...args: any[]) => any 表示函数这样。

⚠️ 我们同样要避免使用{}。{}意味着任何非 null / undefined 的值，从这个层面上看，使用它和使用 any 一样恶劣。
