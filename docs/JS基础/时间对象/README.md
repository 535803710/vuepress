# 日期和时间

日期是 `JavaScript` 的内建对象，该对象存储日期和时间，并提供了日期/时间的管理方法。

我们可以使用它来存储创建/修改时间，测量时间，或者仅用来打印当前时间。

## 目录

  - [创建](#创建)
  - [访问](#访问)
  - [设置时间](#设置时间)
  - [自定校准（Autocorrection）](#自定校准autocorrection)
  - [Date.now()](#datenow)
  - [基准测试（Benchmarking）](#基准测试benchmarking)
  - [对字符串调用 Date.parse](#对字符串调用-dateparse)

## 创建

我们可以使用 `new Date()` 来创建一个新的 `Date` 对象。

1. 不带参数——创建一个当前日期和时间的 `Date` 对象
   ```js
   let now = new Date();
   alert(now); // 显示当前的日期/时间
   ```
2. 参数为 0 ，其时间等于 1970 年 1 月 1 日 UTC+0 之后经过的毫秒数（1/1000 秒）。

   ```js
   // 0 表示 01.01.1970 UTC+0
   let Jan01_1970 = new Date(0);
   alert(Jan01_1970);

    // 现在增加 24 小时，得到 02.01.1970 UTC+0
    let Jan02*1970 = new Date(24 * 3600 * 1000);
    alert( Jan02_1970 );
   ```

3. 参数为字符串，自定解析，和 `Date.parse()` 所使用的算法相同。

```js
let date = new Date("2017-01-26");
alert(date);

// 未指定具体时间，所以假定时间为格林尼治标准时间（GMT）的午夜零点
// 并根据运行代码时的用户的时区进行调整
// 因此，结果可能是
// Thu Jan 26 2017 11:00:00 GMT+1100 (Australian Eastern Daylight Time)
// 或
// Wed Jan 25 2017 16:00:00 GMT-0800 (Pacific Standard Time)
```

4. `new Date(year, month, date, hours, minutes, seconds, ms)`
   使用当前时区中的给定组件创建日期。只有前两个参数是必须的。

- `year` 应该是四位数。为了兼容性，也接受 2 位数，并将其视为 19xx，例如 98 与 1998 相同，但强烈建议始终使用 4 位数。
- month 计数从 0（一月）开始，到 11（十二月）结束。
- date 是当月的具体某一天，如果缺失，则为默认值 1。
- 如果 `hours/minutes/seconds/ms` 缺失，则均为默认值 0。
- 时间度量最大精确到 1 毫秒（1/1000 秒）：

```js
let date = new Date(2011, 0, 1, 2, 3, 4, 567);
alert(date); // 1.01.2011, 02:03:04.567
```

## 访问

从 `Date` 对象中访问年、月等信息有多种方式：

[getFullYear]("https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getFullYear")获取年份（4 位数）

[getMonth()]("https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getMonth")
获取月份，从 0 到 11。

[getDate()]("https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getDate")
获取当月的具体日期，从 1 到 31，这个方法名称可能看起来有些令人疑惑。

[getHours()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getHours)，[getMinutes()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getMinutes)，[getSeconds()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getSeconds)，[getMilliseconds()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getMilliseconds)
获取相应的时间组件。

[getDay()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getDay)
获取一周中的第几天，从 0（星期日）到 6（星期六）。

[getTime()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime)
返回日期的时间戳 —— 从 1970-1-1 00:00:00 UTC+0 开始到现在所经过的毫秒数。

[getTimezoneOffset()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset)
返回 UTC 与本地时区之间的时差，以分钟为单位：

```JavaScript
// 如果你在时区 UTC-1，输出 60
// 如果你在时区 UTC+3，输出 -180
alert( new Date().getTimezoneOffset() );
```

## 设置时间

下列方法可以设置日期/时间组件：

- [setFullYear(year, [month], [date])](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/setFullYear)
- [setMonth(month, [date])](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/setMonth)
- [setDate(date)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/setDate)
- [setHours(hour, [min], [sec], [ms])](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/setHours)
- [setMinutes(min, [sec], [ms])](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/setMinutes)
- [setSeconds(sec, [ms])](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/setSeconds)
- [setMilliseconds(ms)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/setMilliseconds)
- [setTime(milliseconds)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/setTime)（使用自 1970-01-01 00:00:00 UTC+0 以来的毫秒数来设置整个日期）

我们可以看到，有些方法可以一次性设置多个组件，比如 `setHours` 。但是未提及的组件不会被修改。

```js
let today = new Date();

today.setHours(0);
alert(today); // 日期依然是今天，但是小时数被改为了 0

today.setHours(0, 0, 0, 0);
alert(today); // 日期依然是今天，时间为 00:00:00。
```

## 自定校准（Autocorrection）

自动校准 是 `Date` 对象的一个非常方便的特性。我们可以设置超范围的数值，它会自动校准。

比如：

```js
let date = new Date(2013, 0, 32); // 32 Jan 2013 ?!?
alert(date); // ……是 1st Feb 2013!
```

超出范围的日期组件将会被自动分配。

假设我们要在日期 “28 Feb 2016” 上加 2 天。结果可能是 “2 Mar” 或 “1 Mar”，因为存在闰年。但是我们不需要考虑这些，只需要直接加 2 天，剩下的 `Date` 对象会帮我们处理：

```js
let date = new Date(2016, 1, 28);
date.setDate(date.getDate() + 2);

alert(date); // 1 Mar 2016
```

这个特性经常被用来获取给定时间段后的日期。例如，我们想获取“现在 70 秒后”的日期：

```js
let date = new Date();
date.setSeconds(date.getSeconds() + 70);

alert(date); // 显示正确的日期信息
```

我们还可以设置 0 或者负数

```js
let date = new Date(2016, 0, 2); // 2016 年 1 月 2 日

date.setDate(1); // 设置为当月的第一天
alert(date);

date.setDate(0); // 天数最小可以设置为 1，所以这里设置的是上一月的最后一天
alert(date); // 31 Dec 2015
```

日期转化为数字，日期差值
当 `Date` 对象被转化为数字时，得到的是对应的时间戳，与使用 `date.getTime()` 的结果相同：

```JavaScript
let date = new Date();
alert(+date); // 以毫秒为单位的数值，与使用 date.getTime() 的结果相同
```

而其中重要的是日期相减，相减时间以好秒为单位的时差可以用作时间测量

```js
let start = new Date(); // 开始测量时间

// do the job
for (let i = 0; i < 100000; i++) {
  let doSomething = i * i * i;
}

let end = new Date(); // 结束测量时间

alert(`The loop took ${end - start} ms`);
```

如果我们仅仅想要测量时间间隔，我们不需要 `Date` 对象。

## Date.now()

有一个特殊的方法 `Date.now()`，它会返回当前的时间戳。

它相当于 `new Date().getTime()`，但它不会创建中间的 `Date` 对象。因此它更快，而且不会对垃圾回收造成额外的压力。

这种方法很多时候因为方便，又或是因性能方面的考虑而被采用，例如使用 JavaScript 编写游戏或其他的特殊应用场景。

```js
let start = Date.now(); // 从 1 Jan 1970 至今的时间戳

// do the job
for (let i = 0; i < 100000; i++) {
  let doSomething = i * i * i;
}

let end = Date.now(); // 完成

alert(`The loop took ${end - start} ms`); // 相减的是时间戳，而不是日期
```

因此，这样做更好。

## 基准测试（Benchmarking）

在对一个很耗 CPU 性能的函数进行可靠的基准测试（Benchmarking）时，我们需要谨慎一点。

例如，我们想判断以下两个计算日期差值的函数：哪个更快？

这种性能测量通常称为“基准测试（benchmark）”。

```js
// 我们有 date1 和 date2，哪个函数会更快地返回两者的时间差？
function diffSubtract(date1, date2) {
  return date2 - date1;
}

// or
function diffGetTime(date1, date2) {
  return date2.getTime() - date1.getTime();
}
```

这两个函数做的事情完全相同，但是其中一个函数使用显式的 `date.getTime()` 来获取毫秒形式的日期，另一个则依赖于“日期 — 数字”的转换。它们的结果是一样的。

那么，哪个更快呢？

因为这两个函数都太简单，所以我们至少执行 100000 次

```js
function diffSubtract(date1, date2) {
  return date2 - date1;
}

function diffGetTime(date1, date2) {
  return date2.getTime() - date1.getTime();
}

function bench(f) {
  let date1 = new Date(0);
  let date2 = new Date();

  let start = Date.now();
  for (let i = 0; i < 100000; i++) f(date1, date2);
  return Date.now() - start;
}

alert("Time of diffSubtract: " + bench(diffSubtract) + "ms");
alert("Time of diffGetTime: " + bench(diffGetTime) + "ms");
```

看起来使用 `getTime()` 这种方式快得多，这是因为它没有进行类型转换，对引擎优化来说更加简单。

但是这个例子并不是很到的度量的例子，虽然我们的结论是正确的

## 对字符串调用 Date.parse

Date.parse(str) 方法可以从一个字符串中读取日期。

字符串的格式应该为：`YYYY-MM-DDTHH:mm:ss.sssZ`，其中：

- YYYY-MM-DD —— 日期：年-月-日。
- 字符 "T" 是一个分隔符。
- HH:mm:ss.sss —— 时间：小时，分钟，秒，毫秒。
- 可选字符 'Z' 为 +-hh:mm 格式的时区。单个字符 Z 代表 UTC+0 时区。

简短形式也是可以的，比如 `YYYY-MM-DD` 或 `YYYY-MM`，甚至可以是 `YYYY`。

`Date.parse(str)` 调用会解析给定格式的字符串，并返回时间戳（自 1970-01-01 00:00:00 起所经过的毫秒数）。如果给定字符串的格式不正确，则返回 NaN。

举例

```js
let ms = Date.parse("2012-01-26T13:51:50.417-07:00");

alert(ms); // 1327611110417  (时间戳)

// 可以通过时间戳来立即创建一个 new Date 对象：
let date = new Date(Date.parse("2012-01-26T13:51:50.417-07:00"));
alert(date);
```

# 总结

- 在 `JavaScript` 中，日期和时间使用 `Date` 对象来表示。我们不能单独创建日期或时间，`Date` 对象总是同时创建两者。
- 月份从 0 开始计数（对，一月是 0）。
- 一周中的某一天 `getDay()` 同样从 0 开始计算（0 代表星期日）。
- 当设置了超出范围的组件时，`Date` 会进行自动校准。这一点对于日/月/小时的加减很有用。
- 日期可以相减，得到的是以毫秒表示的两者的差值。因为当 `Date` 被转换为数字时，`Date` 对象会被转换为时间戳。
- 使用 `Date.now()` 可以更快地获取当前时间的时间戳。

和其他系统不同，`JavaScript` 中时间戳以毫秒为单位，而不是秒。

有时我们需要更加精准的时间度量。`JavaScript` 自身并没有测量微秒的方法（百万分之一秒），但大多数运行环境会提供。

例如：浏览器有 `performance.now()` 方法来给出从页面加载开始的以毫秒为单位的微秒数（精确到毫秒的小数点后三位）：

```js
alert(`Loading started ${performance.now()}ms ago`);
// 类似于 "Loading started 34731.26000000001ms ago"
// .26 表示的是微秒（260 微秒）
// 小数点后超过 3 位的数字是精度错误，只有前三位数字是正确的
```
