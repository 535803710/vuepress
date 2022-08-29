# 反射元数据

## 反射

反射 Reflect 在 ES6 中的应用是为了配合 Proxy 保留一份方法原始的实现逻辑
。
是对目标的反射 包含了目标的所有内部方法，Reflect 能够调用这些内部方法。

**为什么 `Relect` 比直接操作更好？**

```js
let user = {
  _name: "xiaowo",
  get name() {
    return this._name;
  },
};

const userProxy = new Proxy(user, {
  get(t, p, r) {
    return t[p]; // *
  },
});

const admin = {
  __proto__: userProxy,
  _name: "jack",
};

console.log(admin.name); //xiaowo ???
```

问题出在 \* 这一行

当读取 admin.name 的时候 会触发代理的 get 而这时的 get 捕获器中的 target 是 user ，因为 prop 是一个 getter 的话将在原始对象 this=target 的上下文中执行，所以需要 reflect 去拿到当前的对象。

改写后

```js
let user = {
  _name: "xiaowo",
  get name() {
    return this._name;
  },
};

const userProxy = new Proxy(user, {
  get(t, p, r) {
    return Reflect.get(t, p, r); // * r = admin
  },
});

const admin = {
  __proto__: userProxy,
  _name: "jack",
};

console.log(admin.name); //jack
```

但是 ES6 的 Reflect 和 TS 的反射元数据并不相同但是有相同核销理念：
**在程序运行时去检查以及修改程序行为**

## 反射元数据

因为和装饰器联系的非常紧密，所以还没有通过提案。所以如果想使用反射元数据还需要安装`reflect-metadata`，并且在入口文件引入 `import "reflect-metadata"`。

### 先了解一下概念

元数据：用于描述数据的数据，比如方法的参数信息，返回信息就可以成为元数据

那么元数据又存储在哪里？提案中专门说明了这一点，为类或类属性添加了元数据后，构造函数（或是构造函数的原型，根据静态成员还是实例成员决定）会具有 [[Metadata]] 属性，该属性内部包含一个 Map 结构，键为属性键，值为元数据键值对。也就是说，静态成员的元数据信息存储于构造函数，而实例成员的元数据信息存储于构造函数的原型上。

### 元数据的使用

- 注册
  `Reflect.defineMetadata(Key,Value,Target ,xxx)`

  - 元数据 Key
  - 元数据 Value
  - 目标类 Target
  - 可选 自定义属性

- 提取
  `Reflect.getMetadataKeys(Target,xxx)`

  - 目标类 Target
  - 可选 自定义属性

  `Reflect.getMetadata(Key,Target,xxx)`

  - 元数据 Key
  - 目标类 Target
  - 可选 自定义属性

下面例子反应了上面的使用

```ts
import "reflect-metadata";

class Foo {
  handler() {}
}

Reflect.defineMetadata("class:key", "class metadata", Foo);
Reflect.defineMetadata("method:key", "handler metadata", Foo, "handler");
Reflect.defineMetadata(
  "proto:method:key",
  "proto handler metadata",
  Foo.prototype,
  "handler"
);

// [ 'class:key' ]
console.log(Reflect.getMetadataKeys(Foo));
// ['method:key']
console.log(Reflect.getMetadataKeys(Foo, "handler"));
// ['proto:method:key'];
console.log(Reflect.getMetadataKeys(Foo.prototype, "handler"));

// class metadata
console.log(Reflect.getMetadata("class:key", Foo));
// handler metadata
console.log(Reflect.getMetadata("method:key", Foo, "handler"));
// proto handler metadata
console.log(Reflect.getMetadata("proto:method:key", Foo.prototype, "handler"));
```

我们可以结合装饰器实现"委托"的能力，用装饰器去注册一个元数据，然后实例化的会后就可以拿到原型上的元数据了。

**反射元数据中内置了基于装饰器的调用方式**
可以做到如下操作：

```ts
@Reflect.metadata("class:key", "METADATA_IN_CLASS")
class Foo {
  @Reflect.metadata("prop:key", "METADATA_IN_PROPERTY")
  public prop: string = "linbudu";

  @Reflect.metadata("method:key", "METADATA_IN_METHOD")
  public handler(): void {}
}
```

`@Reflect.metadata` 装饰器会基于应用的位置进行实际的逻辑调用，如在类上装饰时以类作为 target 进行注册，而在静态成员与实例成员中分别使用构造函数、构造函数原型。

```ts
const foo = new Foo();

// METADATA_IN_CLASS
console.log(Reflect.getMetadata("class:key", Foo));
// undefined
console.log(Reflect.getMetadata("class:key", Foo.prototype));

// METADATA_IN_METHOD
console.log(Reflect.getMetadata("method:key", Foo.prototype, "handler"));
// METADATA_IN_METHOD
console.log(Reflect.getMetadata("method:key", foo, "handler"));

// METADATA_IN_PROPERTY
console.log(Reflect.getMetadata("prop:key", Foo.prototype, "prop"));
// METADATA_IN_PROPERTY
console.log(Reflect.getMetadata("prop:key", foo, "prop"));
```

但是上面这些元数据都需要我们自己定义好，如何直接使用已有的信息作为元数据呢？

### 使用内置的元数据

因为上面我们提到了反射允许程序检视自身，反射元数据的田中内置了三个基于类型的元数据

- design:type 类成员的类型
- design:paramtypes 参数类型
- design:returntype 返回值

```ts
import "reflect-metadata";

function DefineType(type: Object) {
  return Reflect.metadata("design:type", type);
}
function DefineParamTypes(...types: Object[]) {
  return Reflect.metadata("design:paramtypes", types);
}
function DefineReturnType(type: Object) {
  return Reflect.metadata("design:returntype", type);
}

@DefineParamTypes(String, Number)
class Foo {
  @DefineType(String)
  get name() {
    return "xiaowo";
  }

  @DefineType(Function)
  @DefineParamTypes(Number, Number)
  @DefineReturnType(Number)
  add(source: number, input: number): number {
    return source + input;
  }
}

const foo = new Foo();
// [ [Function: Number], [Function: Number] ]
const paramTypes = Reflect.getMetadata("design:paramtypes", foo, "add");
// [Function: Number]
const returnTypes = Reflect.getMetadata("design:returntype", foo, "add");
// [Function: String]
const type = Reflect.getMetadata("design:type", foo, "name");
```

可以看我们传入的都是装箱类型对象，String,Number，不光如此我们也能使用自己的类型标注

```ts
class Bar {
  @DefineType(Foo)
  prop!: Foo;
}

const bar = new Bar();
// [class Foo]
const type2 = Reflect.getMetadata("design:type", bar, "prop");
```

有了装饰器，反射元数据我们就能实现“委托”能力。

比如实现基于装饰器的属性校验，实现必填属性，属性类型的校验：

```ts
class User {
  @Required()
  name!: string;

  @ValueType(TypeValidation.Number)
  age!: number;
}

const user = new User();
// @ts-expect-error
user.age = "18";
```

先写一下 `Required`

```ts
const requiredMetadataKey = Symbol("requiredKeys");

function Required(): PropertyDecorator {
  return (target, prop) => {
    const existRequiredKeys: string[] =
      Reflect.getMetadata(requiredMetadataKey, target) ?? [];

    Reflect.defineMetadata(
      requiredMetadataKey,
      [...existRequiredKeys, prop],
      target
    );
  };
}
```

然后是检验属性类型 使用**装饰器工厂 + 入参**

```ts
enum TypeValidation {
  String = "string",
  Number = "number",
  Boolean = "boolean",
}

const validationMetadataKey = Symbol("expectedType");

function ValueType(type: TypeValidation): PropertyDecorator {
  return (target, prop) => {
    Reflect.defineMetadata(validationMetadataKey, type, target, prop);
  };
}
```

接下来需要实现一个检验函数，这个函数如果成功返回空数组，失败的话返回错误信息

1. 必填验证函数

```ts
function validator(entity: any) {
  const clsName = entity.constructor.name;
  const messages: string[] = [];
  // 先检查所有必填属性
  const requiredKeys: string[] = Reflect.getMetadata(
    requiredMetadataKey,
    entity
  );

  // 基于反射拿到所有存在的属性
  const existKeys = Reflect.ownKeys(entity);

  for (const key of requiredKeys) {
    if (!existKeys.includes(key)) {
      messages.push(`${clsName}.${key} should be required.`);
      // throw new Error(`${key} is required!`);
    }
  }

  return messages;
}
```

2. 属性类型校验函数

```ts
function validator(entity: any) {
  // ...
  // 接着基于定义在属性上的元数据校验属性类型
  for (const key of existKeys) {
    const expectedType: string = Reflect.getMetadata(
      validationMetadataKey,
      entity,
      key
    );

    if (!expectedType) continue;

    // 枚举也是对象，因此 Object.values 同样可以生效（只不过也会包括键名）
    // @ts-expect-error
    if (Object.values(TypeValidation).includes(expectedType)) {
      const actualType = typeof entity[key];
      if (actualType !== expectedType) {
        messages.push(
          `expect ${entity.constructor.name}.${String(
            key
          )} to be ${expectedType}, but got ${actualType}.`
        );
        // throw new Error(`${String(key)} is not ${expectedType}!`);
      }
    }
  }
  return messages;
}
```

最终的输出：
```
[  'User.name should be required.',  'expect User.age to be number, but got string.']
```

### 总结思路
注册元数据，消费元数据



