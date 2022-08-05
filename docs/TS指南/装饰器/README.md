# 装饰器原理及使用

目前我们还无法在原生 JS 中使用装饰器，但是 `TypeScript` 中的装饰器已经得到支持。

装饰器语法在其他很多语言中都有存在（Python、Java 等），但目前在 `JavaScript` 中并没有得到支持。

- 一是因为，装饰器其实还不能被称为 `JavaScript` 的一部分

- 二是它对应用场景有着一定要求，比如只能使用在 `Class` 上。js 在设计之初并没有考虑面向对象。

但是如果我们在使用 `TS` 进行开发的话，装饰器就是我们必不可少的技能之一了。

## 装饰器本质

**装饰器的本质其实就是一个函数**

⚠️ **只能在类以及类成员上使用**

### 语法 @

```ts
function fn() {
  return () => {};
}

@fn()
class Foo {}
```

简单的说，程序会先执行 `fn()`，然后执行 `()=>{}` ，走到这里就是装饰器的实际逻辑，可以通过匿名函数的参数改变类。

## 装饰器分类

TypeScript 中的装饰器可以分为

- 类装饰器
- 方法装饰器
- 属性装饰器
- 访问符装饰器
- 参数装饰器

最常见的主要是类装饰器、方法装饰器以及属性装饰器。

## 类装饰器

类装饰器直接作用在类上，真正执行时的函数入参是类本身。因此可以通过装饰器来覆盖类原来的属性方法。

```ts
function AddMethod() {
  return (target: any) => {
    target.prototype.newMethod = () => {
      console.log("xiaowo Method");
    };
  };
}
function AddProp(value: string) {
  return (target: any) => {
    target.prototype.name = value;
  };
}

@AddMethod()
@AddProp("xiaowo")
class Foo {}
```

在执行函数中我们的入参 `target` 表示的就是类本身（不是类的原型），我们通过 `target.prototype` 给 `Foo` 类添加了方法和属性。

而类的原型会随着继承传递到子类，但是静态方法和属性不会。

```ts
const foo: any = new Foo();

foo.newMethod(); // xiaowo Method

console.log(foo.name); // xiaowo
```

这样我们就实现了通过装饰器强行给类在原型上添加了一个属性和一个方法。

我们除了增加属性方法 也可以返回一个新的类，比如说子类

```ts
const OverBar = (target: any) => {
  return class extends target {
    write() {}
    overedWrite() {
      console.log("This is overedWrite Bar!");
    }
  };
};

@OverBar
class Bar {
  write() {
    console.log("This is Bar!");
  }
}

// 被覆盖了，现在是一个空方法
new Bar().write(); // 什么也没有

(<any>new Bar()).overedWrite(); // This is overedWrite Bar!
```

## 方法装饰器

方法装饰器的执行函数入参有三个：

- 类的原型
- 方法名
- 方法的属性描述符

通过方法的属性描述符可以控制方法的内部实现。通过 `apply()` 实现元方法的调用。

```ts
class Foo {
  @spy()
  async fetch() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("RES");
      }, 3000);
    });
  }
}

function spy(): MethodDecorator {
  const start = new Date();
  return (
    _target,
    methodIdentifier,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    const originalMethod = descriptor.value!;
    descriptor.value = async function (...args: unknown[]) {
      const res = await originalMethod.apply(this, args); // 执行原本的逻辑
      const end = new Date();
      console.log(
        `${String(methodIdentifier)} Time: `,
        end.getTime() - start.getTime()
      );
      return res;
    };
  };
}

(async () => {
  console.log(await new Foo().fetch());
})();
```

`descriptor` 是方法的描述符，`descriptor.value` 代表是函数本身。重写原来的方法加入我们的逻辑可以实现一个间谍函数用来计算时间。

## 属性装饰器

它的执行函数入参：

- 类的原型
- 属性名称，返回值会被忽

可以通过直接在类的原型上赋值来修改属性。

```ts
function ModifyNickName(): PropertyDecorator {
  return (target: any, propertyIdentifier) => {
    target[propertyIdentifier] = "xiaowo !";
    target["name"] = "小蜗!";
  };
}

class Foo {
  @ModifyNickName()
  nickName!: string;
  constructor() {}
}

console.log(new Foo().nickName);
console.log(new Foo().name);
```

成功修改 `nickName` 并且添加了新的属性 `name`


## 访问符装饰器
访问符装饰器并不常见，可能访问符对于有些人来说也很陌生，但它其实就是 `get value(){}` 与 `set value(v)=>{}` 这两个方法。

其中 `getter` 在你访问这个属性 `value` 时触发，而 `setter` 在你对 `value` 进行赋值时触发。访问符装饰器本质上仍然是方法装饰器，它们使用的类型定义也相同。

```ts
class Foo {
  get value() {
    return 'xiaowo';
  }

  @HijackSetter('XIAOWO') // 劫持setter
  set value(input: string) {
    this.value = input;
  }
}

function HijackSetter(val: string): MethodDecorator {
  return (target, methodIdentifier, descriptor: any) => {
    descriptor.set = function (newValue: string) {
      console.log(`HijackSetter: ${newValue}`);
    };
    descriptor.get = function () {
      return val;
    };
  };
}

const foo = new Foo();
foo.value = 'XIAO_WO'; // HijackSetter: XIAO_WO
console.log(foo.value); // XIAOWO

```

通过装饰器劫持了 `setter` 和 `getter` 改变了 `get` 的返回值，注意，装饰器不能篡改 `setter` 这里只有一个 `log` ，原本的 `setter` 逻辑还是会执行，我们无法在 `setter` 中调用原本的 `setter` ，不然会造成死循环。

## 参数装饰器

包含两种，构造函数的参数装饰器 和 方法的参数装饰器

执行函数入参有：**类的原型**、**参数名**与**参数在函数参数中的索引值**（即第几个参数）

```ts
class Foo {
  handler(@CheckParam() input: string) {
    console.log(input);
  }
}

function CheckParam(): ParameterDecorator {
  return (target, paramIdentifier, index) => {
    console.log(target, paramIdentifier, index);
  };
}

// {} handler 0
new Foo().handler('xiaowo');
```


## 总结

以上五种就是TS中的装饰器类型，在实际项目中我们用的最的就是类装饰器，方法装饰器和属性装饰器。

而不同装饰器的执行实际和顺序也是不同的。后面我们也可以讨论一下。
