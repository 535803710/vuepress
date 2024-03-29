# 类型工具

如果按照使用方式来划分，类型工具可以分成三类：

- 操作符
- 关键字
- 专用语法。

如果按照使用目的划分：

- 类型创建
- 类型安全保护

## 类型别名

类型别名很简单

通过 `type` 关键字生成类型别名

```ts
type A = string;
```

## 工具类型

工具类型就在类型别名上多了范型

```ts
type F<T> = T | string | number;
```

## 联合类型和交叉类型

- 联合类型 `|` 只要满足一个即可

```ts
type A = (1 | 2 | 3) | (1 | 2); //1|2
```

- 交叉类型 `&` A & B 两者共同的部分

## 索引类型

索引类型指的不是某一个特定的类型工具，它其实包含三个部分：**索引签名类型**、**索引类型查询**与**索引类型访问**。

### 索引签名类型

```ts
interface obj {
  propA: string;
  propB: number | string;
  [key: string]: string;
}
```

除了 propA 和 propB 其他的属性都是 string 类型

### 索引类型查询

keyof 操作符，它可以将对象中的所有键转换为对应字面量类型，然后再组合成联合类型。

```ts
interface obj {
  name: string;
  age: 27;
}
type objKeys = keyof obj; // name|age
```

keyof 的产物必定是一个联合类型。

### 索引类型访问

在 js 中，我们可以通过 `obj[expression]` 来访问值，在 ts 中我们也可以使用类似方式 只不过将 `expression` 变成类型

```ts
interface Foo {
  propA: number;
  propB: boolean;
}

type PropAType = Foo["propA"]; // number
type PropBType = Foo["propB"]; // boolean
```

索引类型查询、索引类型访问通常会和映射类型一起搭配使用，前两者负责访问键，而映射类型在其基础上访问键值类型

## 映射类型

```ts
type clone<T> = {
  [K in keyof T]: T[K];
};
```

| 类型工具 | 创建新类型的方式                          | 常见搭配           |
| -------- | ----------------------------------------- | ------------------ |
| 类型别名 | 将一组类型/类型结构封装，作为一个新的类型 | 联合类型、映射类型 |

| 工具类型 | 在类型别名的基础上，基于泛型去动态创建新类型 | 基本所有类型工具 |
| 联合类型 | 创建一组类型集合，满足其中一个类型即满足这个联合类型（||） | 类型别名、工具类型
| 交叉类型 | 创建一组类型集合，满足其中所有类型才满足映射联合类型（&&）| 类型别名、工具类型
| 索引签名类型 声明一个拥有任意属性，键值类型一致的接口结构 映射类型
索引类型查询 从一个接口结构，创建一个由其键名字符串字面量组成的联合类型 映射类型
索引类型访问 从一个接口结构，使用键名字符串字面量访问到对应的键值类型 类型别名、映射类型
映射类型 从一个联合类型依次映射到其内部的每一个类型 工具类型
