# 函数的协变与逆变

## 从 equal 中说起

```ts
export type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? true
  : false;
```

经验老道的程序员都见过这样一段神奇的代码。

这段代码定义了一个名为 `Equals` 的类型别名。它使用了 `TypeScript` 的类型推断和类型扩展来检查两个类型 `X` 和 `Y` 是否完全相同。

最早出现在这位大佬的讨论中 [这里]('https://github.com/microsoft/TypeScript/issues/27024#issuecomment-421529650')

具体解释可以[参考这里](https://stackoverflow.com/questions/68961864/how-does-the-equals-work-in-typescript)

这一段关于函数的比较让我想起了关于函数的协变和逆变

## 函数的签名类型

对于函数类型比较，事实上我们要比较的是 参数类型 与 返回值类型。

让我们进入一个场景

```ts
class Animal {}

class Dog extends Animal {
  bark() {}
}

class Husky extends Dog {
  cool();
}
```

我们明确了两点

- Dog 是 Animal 的子类，Animal 是 Dog 的父类
- Husky 是 Dog 的子类，Dog 是 Husky 的父类

当我们有一个函数 接收的是 Dog 类型 ，返回的是 Dog 类型时可以写成这样

```ts
type DogFactory = (args: Dog) => Dog;
```

下面我简化为 Dog->Dog

因为对于函数的比较我们比较 参数类型 和 返回值类型

所以 我们会有以下几种情况

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/08/ae354d80b7e9f35565095d307d575676.png)
<!-- ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0fd4537748fe4bf98bd8c1d092e92c08~tplv-k3u1fbpfcp-watermark.image?) -->

在比较函数的参数的时候。**如果一个值能够被赋值给某个类型的变量，那么可以认为这个值的类型为此变量类型的子类型。**

比如 ：

```ts
function makeDogBark(dog: Dog) {
  dog.bark();
}

makeDogBark(new Husky()); // 没问题
makeDogBark(new Animal()); // 不行
```

这个函数就只能接受 Dog 类型或者 Dog 类型的子类型，而不接受 Dog 类型的父类型

严格的说，因为派生类会保留基类的方法和属性，因此其与基类类型兼容。

> 里氏替换原则：子类可以扩展父类的功能，但不能改变父类原有的功能，子类型（subtype）必须能够替换掉他们的基类型（base type）。

回到这个函数，他会实例化一个狗，然后叫两下。实际上这个函数同时约束了参数的类型和返回值的类型。首先必须是一个狗，而且返回的也是一个狗。 Dog->Dog

对于这两条约束依次进行检查：

对于` Animal/Dog/Corgi -> Animal` 类型，无论穿什么都不满足条件 ，因为返回的是 Animal 类型 不一定是 Dog 类型

对于 `Husky -> Husky 与 Husky -> Dog`，其返回值满足了条件，但是参数类型又不满足了。这两个类型需要接受 `Husky` 类型。但我们可没说一定会传入哈士奇，如果我们传个德牧，程序可能就崩溃了。

对于` Dog -> Corgi、Animal -> Corgi、Animal -> Dog`，首先它们的参数类型正确的满足了约束，能接受一只狗狗。其次，它们的返回值类型也一定会是一条狗。 狗满足了动物的类型。

而实际上，如果我们去掉了包含 Dog 类型的例子，会发现只剩下 Animal -> Corgi 了，也即是说，(Animal → Corgi) ≼ (Dog → Dog) 成立（A ≼ B 意为 A 为 B 的子类型）。

所以结论：

- 参数类型允许为 Dog 的父类型，不允许为 Dog 的子类型。
- 返回值类型允许为 Dog 的子类型，不允许为 Dog 的父类型。

## 协变与逆变

(Animal → Husky) ≼ (Dog → Dog) 成立（A ≼ B 意为 A 为 B 的子类型）。

考虑 Husky ≼ Dog ≼ Animal

当有函数类型 Dog -> Dog，仅有 (Animal → Corgi) ≼ (Dog → Dog) 成立（即能被视作此函数的子类型，）。这里的参数类型与返回值类型实际上可以各自独立出来看：

1. Husky ≼ Dog 假设我们对其进行返回值类型的函数签名类型包装，则有 (T → Corgi) ≼ (T → Dog)，也即是说，在我需要狗狗的地方，哈士奇都是可用的。即不考虑参数类型的情况，在包装为函数签名的返回值类型后，其子类型层级关系保持一致。
2. 考虑 Dog ≼ Animal （狗是 Anilmal 的子类型），如果换成参数类型的函数签名类型包装，则有 (Animal -> T) ≼ (Dog -> T)，也即是说，在我需要条件满足是动物时，狗狗都是可用的。即不考虑返回值类型的情况，在包装为函数签名的参数类型后，其子类型层级关系发生了逆转。

实际上，这就是 **TypeScript 中的协变（ covariance ） 与逆变（ contravariance ）** 在函数签名类型中的表现形式。这两个单词最初来自于几何学领域中：**随着某一个量的变化，随之变化一致的即称为协变，而变化相反的即称为逆变。**

简单的说：**我需要参数是基类的类型，你传子类是可以的，我需要返回是基类的类型，你返回子类是可以的**

用 TypeScript 的思路进行转换，即如果有 A ≼ B ，协变意味着` Wrapper<A> ≼ Wrapper<B>`，而逆变意味着 `Wrapper<B> ≼ Wrapper<A>`.

```ts
type AsFuncArgType<T> = (arg: T) => void;
type AsFuncReturnType<T> = (arg: unknown) => T;

再使用这两个包装类型演示我们上面的例子：

// 1 成立：(T -> Corgi) ≼ (T -> Dog)
type CheckReturnType = AsFuncReturnType<Corgi> extends AsFuncReturnType<Dog>
  ? 1
  : 2;

// 2 不成立：(Dog -> T) ≼ (Animal -> T)
type CheckArgType = AsFuncArgType<Dog> extends AsFuncArgType<Animal> ? 1 : 2;
```

进行一个总结：

**函数类型的参数类型使用子类型逆变的方式确定是否成立，而返回值类型使用子类型协变的方式确定。**

## StrictFunctionTypes 配置

[strictFunctionTypes](https://link.juejin.cn/?target=https%3A%2F%2Fwww.typescriptlang.org%2Ftsconfig%23strictFunctionTypes)：在比较两个函数类型是否兼容时，将对函数参数进行更严格的检查（When enabled, this flag causes functions parameters to be checked more correctly），而实际上，这里的更严格指的即是 对函数参数类型启用逆变检查。

如果启用了这个配置才是逆变检查，那么原来是什么样的？

- 原来是双变的

在实际场景中的逆变检查又是什么样的？ 
- 需要开启[method-signature-style](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Ftypescript-eslint%2Ftypescript-eslint%2Fblob%2Fmain%2Fpackages%2Feslint-plugin%2Fdocs%2Frules%2Fmethod-signature-style.md)它的意图是约束在接口中声明方法时，需要使用 property 而非 method 形式.


总结：
现在学习了 TypeScript 函数类型的兼容性比较，这应该带给了你一些新的启发：原来不只是原始类型、联合类型、对象类型等可以比较，函数类型之间同样是能够比较的。而对我们开头提出的，如何对两个函数类型进行兼容性比较这一问题，我想你也有了答案：

比较它们的参数类型是否是反向的父子类型关系，返回值是否是正向的父子类型关系。也就是判断**参数类型是否遵循类型逆变，返回值类型是否遵循类型协变**，

我们可以通过 TypeScript ESLint 的规则以及 strictFunctionTypes 配置，来为 interface 内的函数声明启用严格的检查模式。如果你的项目内已经配置了 TypeScript ESLint，不妨添加上 method-signature-style 这条规则来让你的代码质量更上一层楼。

