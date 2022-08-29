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

## 字面量类型

```ts
interface Res {
  code: 10000 | 10001 | 50000;
  status: "success" | "failure";
  data: any;
}
```

上面的 `status` 就是**字符串字面量类型**，除此还有**数字字面量类型**，**布尔字面量类型**和**对象字面量类型**

```ts
const str: "linbudu" = "linbudu";
const num: 599 = 599;
const bool: true = true;
```

当对象类型中的属性全部是字面量类型的时候就是对象字面量类型。

⚠️ 需要注意的是，无论是原始类型还是对象类型的字面量类型，它们的本质都是类型而不是值。它们在编译时同样会被擦除，同时也是被存储在内存中的类型空间而非值空间。

## 枚举

枚举在其他的语言中非常常见，在 JavaScript 中我们可以这样来模拟枚举。

```js
export default {
  Home_Page_Url: "url1",
  Setting_Page_Url: "url2",
  Share_Page_Url: "url3",
};

// 或是这样：
export const PageUrl = {
  Home_Page_Url: "url1",
  Setting_Page_Url: "url2",
  Share_Page_Url: "url3",
};
```

将上面的代码替换成枚举就变成

```ts
enum PageUrl {
  Home_Page_Url = "url1",
  Setting_Page_Url = "url2",
  Share_Page_Url = "url3",
}

const home = PageUrl.Home_Page_Url;
```

枚举和对象的重要差异在于，对象是单向映射的，我们只能从键映射到键值。而枚举是双向映射的，即你可以从枚举成员映射到枚举值，也可以从枚举值映射到枚举成员：

⚠️ 只有数字枚举成员才能够进行这样的双向枚举，字符串枚举成员仍然只会进行单次映射

```ts
enum Items {
  Foo,
  Bar,
  Baz,
}

const fooValue = Items.Foo; // 0
const fooKey = Items[0]; // "Foo"
```

## 函数重载

```ts
function func(foo: number, bar: true): string;
function func(foo: number, bar?: false): number;
function func(foo: number, bar?: boolean): string | number {
  if (bar) {
    return String(foo);
  } else {
    return foo * 599;
  }
}

const res1 = func(599); // number
const res2 = func(599, true); // string
const res3 = func(599, false); // number
```

实际上，TypeScript 中的重载更像是伪重载，**它只有一个具体实现，其重载体现在方法调用的签名上而非具体实现上**。而在如 C++ 等语言中，重载体现在多个名称一致但入参不同的函数实现上，这才是更广义上的函数重载。

## class 修饰符

访问性修饰符

- public：此类成员在类、类的实例、子类中都能被访问。
- private：此类成员仅能在类的内部被访问。
- protected：此类成员仅能在类与子类中被访问，你可以将类和类的实例当成两种概念，即一旦实例化完毕（出厂零件），那就和类（工厂）没关系了，即不允许再访问受保护的成员。

操作修饰符

- readonly：只读

### 静态成员

- 用 static 来标示
- 不能用 this 来访问
- 不被继承

**静态成员直接被挂载在函数体上，而实例成员挂载在原型上**

静态成员不会被实例继承，它始终只属于当前定义的这个类（以及其子类）。

而原型对象上的实例成员则会沿着原型链进行传递，也就是能够被继承。

## 内置类型 any,unkonwn 和 never

any - 不进行类型校验

unknown - 未知类型，后续会利用断言来增加类型

never - 空类型

## 类型断言：警告编译器不准报错

关键词 as, 也可以使用 `<>` 语法

### 双重断言

如果类型差异过大的话可以先断言成 unknown 再断言成想要的类型。

```ts
const str: string = "linbudu";

(str as unknown as { handler: () => {} }).handler();
```

### 非空断言

简写 `!` ，相当于可选链式操作符 `?.`

类型断言还有一种用法是作为代码提示的辅助工具，比如对于以下这个稍微复杂的接口：

```ts
interface IStruct {
  foo: string;
  bar: {
    barPropA: string;
    barPropB: number;
    barMethod: () => void;
    baz: {
      handler: () => Promise<void>;
    };
  };
}
```

假设你想要基于这个结构随便实现一个对象，你可能会使用类型标注：

```ts
const obj: IStruct = {};
```

这个时候等待你的是一堆类型报错，你必须规规矩矩地实现整个接口结构才可以。但如果使用类型断言，我们可以在保留类型提示的前提下，不那么完整地实现这个结构：

```ts
// 这个例子是不会报错的
const obj = <IStruct>{
  bar: {
    baz: {},
  },
};
```

而且还保存了提示。




