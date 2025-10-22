# 🌐 浏览器内置翻译 API 完全指南

> 探索 Chrome 最新的 Translator API，实现离线、高效、隐私友好的本地翻译功能


> 💡 本文基于 Chrome 131 Canary 版本编写，API 可能会随版本更新而变化。

---

[点击查看示例](./translator-demo.html)

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2025/10/19d54d5b30f4308a01980e1e0c57d344.gif)



## 一、前言：为什么需要浏览器内置翻译？

### 1. 传统翻译方案的痛点 

在 Web 开发中，我们通常使用以下翻译方案：
- **云端翻译服务**（Google Translate API、百度翻译等）
  - ❌ 需要网络连接
  - ❌ 存在隐私泄露风险
  - ❌ API 调用有成本
  - ❌ 网络延迟影响体验

- **静态国际化文件**（i18n）
  - ❌ 需要手动维护多语言文件
  - ❌ 无法动态翻译用户生成内容
  - ❌ 新增语言成本高

### 2. Translator API 的优势 

Chrome 推出的 **Translator API** 是浏览器内置的本地翻译解决方案，带来了革命性的改变：

| 特性 | Translator API | 云端翻译 | 静态 i18n |
|------|---------------|----------|-----------|
| **离线支持** | ✅ 完全离线 | ❌ 需要网络 | ✅ 离线可用 |
| **隐私保护** | ✅ 数据不出浏览器 | ❌ 数据传输到服务器 | ✅ 无数据传输 |
| **动态翻译** | ✅ 实时翻译任意文本 | ✅ 实时翻译 | ❌ 仅预定义文本 |
| **响应速度** | ⚡ 极快（本地计算） | 🐌 受网络影响 | ⚡ 极快 |
| **成本** | 💰 免费 | 💸 API 调用收费 | 💰 免费 |
| **维护成本** | 🔧 低 | 🔧 低 | 🔨 高（多语言文件） |

### 3. 浏览器支持情况 

目前 Translator API 正处于**实验性阶段**，支持情况如下：

- ✅ **Chrome 131+**（Canary/Dev 渠道）
- 🚧 **Edge、Opera** 等 Chromium 系浏览器即将支持
- ⏳ **Firefox、Safari** 尚未支持

> **💡 提示**：虽然目前是实验性功能，但 Chrome 团队正在积极推进标准化，预计未来将成为 Web 标准的一部分。

---

## 二、Translator API 官方文档解读


###  1. API 基本介绍


[Translator API](https://developer.chrome.com/docs/ai/translator-api?hl=zh-cn) 是基于浏览器内置的**神经网络翻译模型**，能够在本地完成高质量的文本翻译。它是 Chrome AI 计划的一部分，与 Prompt API、Summarizer API 等共同构成浏览器端 AI 能力。

###  2. 核心方法详解

#### 2.1 **检测 API 可用性**

```javascript
// 检查浏览器是否支持 Translator API
if (!('Translator' in self)) {
  console.error('当前浏览器不支持 Translator API');
}

// 检查特定语言对的可用性
const availability = await self.Translator.availability({
  sourceLanguage: 'en',
  targetLanguage: 'zh'
});

console.log(availability);
// 可能的返回值:
// - "unavailable"  : 用户的设备或所请求的会话选项不受支持。设备可能电量不足或磁盘空间不足
// - "downloadable" : 需要进行额外的下载才能创建会话。可能需要用户激活才能调用 create()
// - "downloading"  : 下载正在进行中，必须先完成下载，然后才能使用会话
// - "available"    : 您可以立即创建会话
```

**返回值说明**：

参考[官方文档 - Model Download](https://developer.chrome.com/docs/ai/get-started?hl=zh-cn#model_download)

- `"unavailable"` - 用户的设备或所请求的会话选项不受支持。设备可能电量不足或磁盘空间不足
- `"downloadable"` - 需要进行额外的下载才能创建会话，这可能包括专家模型、语言模型或微调。可能需要用户激活才能调用 `create()`
- `"downloading"` - 下载正在进行中，必须先完成下载，然后才能使用会话
- `"available"` - 您可以立即创建会话

#### 2.2 **创建翻译器实例**

```javascript
const translator = await self.Translator.create({
  sourceLanguage: 'en',  // 源语言（ISO 639-1 代码）
  targetLanguage: 'zh'   // 目标语言（ISO 639-1 代码）
});
```

**参数说明**：
- `sourceLanguage`: 源语言代码（如 `'en'`, `'zh'`, `'ja'`）
- `targetLanguage`: 目标语言代码

#### 2.3 **执行翻译**

```javascript
const result = await translator.translate('Hello, world!');
console.log(result); // "你好，世界！"
```

### 3. 语言支持列表
使用 [BCP 47](https://www.rfc-editor.org/info/bcp47) 语言短代码作为字符串。例如，'es' 表示西班牙语，'fr' 表示法语。

目前支持的主流语言（不完全列表）：

| 语言 | ISO 代码 | 语言 | ISO 代码 |
|------|---------|------|---------|
| 中文（简体） | `zh` 或 `zh-CN` | 英语 | `en` |
| 日语 | `ja` | 韩语 | `ko` |
| 法语 | `fr` | 德语 | `de` |
| 西班牙语 | `es` | 俄语 | `ru` |
| 意大利语 | `it` | 葡萄牙语 | `pt` |
| 阿拉伯语 | `ar` | 印地语 | `hi` |

> **注意**：具体支持的语言对可能因 Chrome 版本而异，建议使用前通过 `availability()` 检测。

### 4. 与传统翻译方案对比

#### **场景一：翻译用户输入内容**

**传统方案（云端 API）**：
```javascript
// 需要调用外部 API
const response = await fetch('https://api.translate.com/v1/translate', {
  method: 'POST',
  body: JSON.stringify({ text, from: 'en', to: 'zh' })
});
const result = await response.json();
```

❌ 问题：
- 需要网络请求（延迟 200-500ms）
- 用户数据传输到第三方服务器
- API 调用有配额限制和成本

**本地AI方案**：
```javascript
const translator = await self.Translator.create({
  sourceLanguage: 'en',
  targetLanguage: 'zh'
});
const result = await translator.translate(text);
```

✅ 优势：
- 本地计算（延迟 < 50ms）
- 数据完全保留在本地
- 无调用限制和成本

#### **场景二：整页国际化**

**传统方案（i18n 文件）**：
```javascript
// en.json
{ "welcome": "Welcome", "description": "A translation demo" }

// zh.json
{ "welcome": "欢迎", "description": "翻译演示" }

// 使用
document.getElementById('title').textContent = i18n.t('welcome');
```

❌ 问题：
- 需要手动维护多个语言文件
- 新增语言需要重新翻译所有文本
- 无法翻译动态生成的内容

**本地AI方案（动态翻译）**：
```javascript
// 直接翻译页面上的所有文本
async function translatePage(targetLang) {
  const translator = await self.Translator.create({
    sourceLanguage: 'zh',
    targetLanguage: targetLang
  });
  
  const elements = document.querySelectorAll('[data-i18n]');
  for (const el of elements) {
    el.textContent = await translator.translate(el.textContent);
  }
}
```

✅ 优势：
- 无需维护多语言文件
- 自动翻译所有文本
- 支持动态内容翻译

---

## 三、实战：Demo 实现步骤详解

基于我开发的 Demo（`translator-demo.html`），我将详细介绍如何从零构建一个完整的翻译应用。

### 环境准备

#### **浏览器版本要求**

1. **下载 Chrome Canary 或 Dev 版本**
   - [Chrome Canary](https://www.google.com/chrome/canary/)
   - 版本需 ≥ 131

2. **启用实验性功能**

打开以下两个 Chrome flags：

```
chrome://flags/#translation-api
chrome://flags/#optimization-guide-on-device-model
```

设置为 `Enabled`，然后重启浏览器。

3. **首次使用注意事项**
   - 首次调用会自动下载语言模型（约 50-200MB）
   - 下载时间取决于网络速度（通常 2-5 分钟）
   - 模型下载后会缓存，后续使用无需重新下载

#### **功能检测代码**

在应用启动时，首先检测 API 是否可用：

```javascript
async function checkAPIAvailability() {
  try {
    // 1. 检查浏览器是否支持 Translator API
    if (!('Translator' in self)) {
      apiStatus.className = "status-banner error";
      apiStatus.innerHTML = `
        <span>❌</span>
        <span>您的浏览器不支持 Translator API。请使用 Chrome 131+ 并启用相关实验性功能。</span>
      `;
      translateBtn.disabled = true;
      return;
    }

    // 2. 检查特定语言对是否可用 - 使用 availability() 方法
    const translatorCapabilities = await self.Translator.availability({
      sourceLanguage: 'zh',
      targetLanguage: 'en',
    });
    
    if (translatorCapabilities === "unavailable") {
      apiStatus.className = "status-banner error";
      apiStatus.innerHTML = `
        <span>❌</span>
        <span>Translator API 不可用</span>
      `;
      translateBtn.disabled = true;
    } else {
      apiStatus.className = "status-banner success";
      apiStatus.innerHTML = `
        <span>✅</span>
        <span>Translator API 可用！可以开始使用翻译功能。</span>
      `;
      translateBtn.disabled = false;

      if (translatorCapabilities === "downloadable" || translatorCapabilities === "downloading") {
        apiStatus.innerHTML += `<div style="margin-top: 8px; font-size: 0.9em;">📦 正在下载翻译模型...</div>`;
      }
    }
  } catch (error) {
    apiStatus.className = "status-banner error";
    apiStatus.innerHTML = `
      <span>❌</span>
      <span>Translator API 不可用: ${error.message}</span>
    `;
    translateBtn.disabled = true;
  }
}
```

### 核心功能实现

#### **功能一：文本翻译**

这是最基础的功能，用户输入文本后点击按钮进行翻译。

##### **步骤 1：HTML 结构**

```html
<div class="translate-panel">
  <!-- 源语言选择 -->
  <select id="sourceLang">
    <option value="zh">🇨🇳 中文</option>
    <option value="en">🇺🇸 英语</option>
    <option value="ja">🇯🇵 日语</option>
  </select>

  <!-- 输入框 -->
  <textarea id="inputText" placeholder="请输入要翻译的文本..."></textarea>

  <!-- 目标语言选择 -->
  <select id="targetLang">
    <option value="en">🇺🇸 英语</option>
    <option value="zh">🇨🇳 中文</option>
    <option value="ja">🇯🇵 日语</option>
  </select>

  <!-- 输出框 -->
  <textarea id="outputText" disabled placeholder="翻译结果..."></textarea>

  <!-- 翻译按钮 -->
  <button id="translateBtn" onclick="translateText()">🚀 开始翻译</button>
</div>
```

##### **步骤 2：JavaScript 实现**

```javascript
async function translateText() {
  const text = document.getElementById('inputText').value.trim();
  const source = document.getElementById('sourceLang').value;
  const target = document.getElementById('targetLang').value;
  const outputText = document.getElementById('outputText');
  const translateBtn = document.getElementById('translateBtn');

  // 输入验证
  if (!text) {
    alert('请输入要翻译的文本');
    return;
  }

  if (source === target) {
    alert('源语言和目标语言相同，无需翻译');
    return;
  }

  try {
    // 禁用按钮，防止重复点击
    translateBtn.disabled = true;
    translateBtn.textContent = '⏳ 翻译中...';
    outputText.value = '';

    // 创建翻译器
    const translator = await self.Translator.create({
      sourceLanguage: source,
      targetLanguage: target
    });

    // 执行翻译
    const result = await translator.translate(text);

    // 显示结果
    outputText.value = result;

    // 可选：销毁翻译器释放资源
    // translator.destroy();

  } catch (error) {
    console.error('翻译失败:', error);
    alert(`翻译失败: ${error.message}`);
    outputText.value = '';
  } finally {
    // 恢复按钮状态
    translateBtn.disabled = false;
    translateBtn.textContent = '🚀 开始翻译';
  }
}
```

##### **关键要点**：

1. **异步处理**：所有 API 调用都是异步的，必须使用 `async/await`
2. **错误处理**：使用 `try-catch` 捕获翻译失败的情况
3. **用户体验**：
   - 翻译时禁用按钮，防止重复点击
   - 显示"翻译中"状态
   - 使用 `finally` 确保按钮状态恢复

#### **功能二：交换语言**

允许用户一键交换源语言和目标语言，并同时交换输入输出文本。

```javascript
function swapLanguages() {
  const sourceLang = document.getElementById('sourceLang');
  const targetLang = document.getElementById('targetLang');
  const inputText = document.getElementById('inputText');
  const outputText = document.getElementById('outputText');

  // 交换语言选择
  const tempLang = sourceLang.value;
  sourceLang.value = targetLang.value;
  targetLang.value = tempLang;

  // 交换文本内容
  const tempText = inputText.value;
  inputText.value = outputText.value;
  outputText.value = '';  // 清空输出，等待新的翻译
}
```

#### **功能三：清空文本**

```javascript
function clearText() {
  document.getElementById('inputText').value = '';
  document.getElementById('outputText').value = '';
}
```

### 高级功能实现

#### **功能一：整页翻译（自动国际化）**

这是 Demo 的核心亮点之一 - 使用 Translator API 实现整个页面的自动翻译。

##### **实现思路**：

1. 为需要翻译的元素添加 `data-i18n` 属性
2. 存储原始中文文本
3. 点击语言切换按钮时，调用 API 翻译所有文本
4. 动态更新页面内容

##### **HTML 标记**：

```html
<h1 data-i18n="true">🌐 Chrome 内置 AI 翻译器</h1>
<p data-i18n="true">使用浏览器内置的 Translator API 进行实时翻译</p>
<button data-i18n="true">🚀 开始翻译</button>
<textarea placeholder="请输入文本..." data-i18n="true"></textarea>
```

**重要说明**：
- 使用 `data-i18n="true"` 标记需要翻译的元素
- 对于 `input` 和 `textarea`，会翻译 `placeholder` 属性
- 对于普通元素，会翻译其文本内容
- 包含子元素（如链接）的元素，只翻译文本节点，保留子元素结构

##### **JavaScript 实现**：

```javascript
// 当前页面语言
let currentLang = "zh";

// 存储元素的原始文本（用于恢复）
const originalTexts = new Map();

// 翻译器缓存（避免重复创建）
const pageTranslators = {};

/**
 * 切换页面语言
 * @param {string} targetLang - 目标语言代码
 */
async function switchLanguage(targetLang) {
  // 更新按钮状态 - 添加加载动画
  const targetBtn = document.querySelector(`.lang-btn[data-lang="${targetLang}"]`);
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.remove("active", "translating");
  });
  
  targetBtn.classList.add("active", "translating");

  try {
    // 翻译页面内容
    await translatePage(currentLang, targetLang);
    // 更新当前语言
    currentLang = targetLang;
  } catch (error) {
    console.error('切换语言失败:', error);
    alert(`切换语言失败: ${error.message}`);
  } finally {
    // 移除加载动画
    targetBtn.classList.remove("translating");
  }
}

/**
 * 翻译页面中所有标记为 data-i18n="true" 的元素
 * @param {string} sourceLang - 源语言
 * @param {string} targetLang - 目标语言
 */
async function translatePage(sourceLang, targetLang) {
  // 如果源语言和目标语言相同，无需翻译
  if (sourceLang === targetLang) {
    return;
  }

  try {
    console.log(`🌐 开始翻译页面: ${sourceLang} → ${targetLang}`);

    // 获取或创建翻译器
    const translatorKey = `${sourceLang}-${targetLang}`;
    if (!pageTranslators[translatorKey]) {
      console.log(`🔧 创建翻译器: ${sourceLang} → ${targetLang}`);
      pageTranslators[translatorKey] = await self.Translator.create({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang
      });
    }

    const translator = pageTranslators[translatorKey];

    // 收集所有需要翻译的元素
    const elements = document.querySelectorAll('[data-i18n="true"]');
    
    if (elements.length === 0) {
      console.log('⚠️ 没有找到需要翻译的元素 (data-i18n="true")');
      return;
    }

    console.log(`📝 找到 ${elements.length} 个需要翻译的元素`);

    // 遍历每个元素进行翻译
    for (const el of elements) {
      // 跳过特定元素（如翻译功能区的输入框）
      if (el.id === 'inputText' || el.id === 'outputText') {
        continue;
      }

      // 添加翻译中样式
      el.classList.add('translating-text');

      try {
        // 保存原始文本（首次翻译时）
        if (!originalTexts.has(el)) {
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            originalTexts.set(el, {
              placeholder: el.placeholder,
              value: el.value
            });
          } else {
            // 提取纯文本内容（排除子元素）
            const textContent = getTextContent(el);
            originalTexts.set(el, {
              textContent: textContent
            });
          }
        }

        // 获取当前文本内容
        let textToTranslate = '';
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          textToTranslate = el.placeholder;
        } else {
          textToTranslate = getTextContent(el);
        }

        // 执行翻译
        if (textToTranslate) {
          const translated = await translator.translate(textToTranslate);
          
          // 更新元素内容
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = translated;
          } else {
            // 只替换文本节点，保留子元素
            replaceTextContent(el, translated);
          }
        }

      } catch (error) {
        console.error(`翻译元素失败:`, el, error);
      } finally {
        // 移除翻译中样式
        el.classList.remove('translating-text');
      }
    }

    console.log(`✅ 页面翻译完成！`);

  } catch (error) {
    console.error('❌ 页面翻译失败:', error);
    // 移除所有 loading 类
    document.querySelectorAll('.translating-text').forEach(el => {
      el.classList.remove('translating-text');
    });
    throw error;
  }
}

/**
 * 提取元素的纯文本内容（只包含直接文本节点，不包含子元素）
 */
function getTextContent(el) {
  let text = '';
  for (const node of el.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent;
    }
  }
  return text.trim();
}

/**
 * 替换元素的文本节点内容，保留子元素
 */
function replaceTextContent(el, newText) {
  // 如果元素没有子元素，直接替换 textContent
  if (el.children.length === 0) {
    el.textContent = newText;
    return;
  }

  // 如果有子元素（如链接），只替换文本节点
  for (const node of el.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent = newText;
      break; // 只替换第一个文本节点
    }
  }
}
```

## 四、总结

### 📌 核心要点回顾

1. **Translator API 的优势**
   - ✅ 完全离线，保护用户隐私
   - ✅ 本地计算，响应速度快
   - ✅ 免费使用，无调用限制
   - ✅ 动态翻译，无需维护多语言文件

2. **实现整页翻译的关键步骤**
   - 使用 `data-i18n="true"` 标记可翻译元素
   - 缓存翻译器实例，避免重复创建
   - 保存原始文本，支持语言切换
   - 正确处理不同类型元素（input、textarea、普通元素）
   - 保留 HTML 结构，只翻译文本节点

3. **API 核心方法**
   ```javascript
   // 检查可用性
   const availability = await self.Translator.availability({ sourceLanguage, targetLanguage });
   
   // 创建翻译器
   const translator = await self.Translator.create({ sourceLanguage, targetLanguage });
   
   // 执行翻译
   const result = await translator.translate(text);
   ```

4. **当前限制**
   - 仅 Chrome 131+ 支持（实验性功能）
   - 需要手动启用两个 Chrome flags
   - 首次使用需要下载语言模型
   - 不支持批量翻译 API

### 🚀 应用场景

- ✅ **个人博客/文档站**：实现多语言切换
- ✅ **内部工具**：快速添加国际化支持
- ✅ **Chrome 扩展**：为扩展添加翻译功能
- ✅ **离线应用**：PWA 应用的离线翻译
- ❌ **生产环境**：目前仍是实验性功能，不建议用于正式产品

### 🔮 未来展望

Chrome 团队正在积极推进浏览器内置 AI 能力的标准化，未来可能会：
- 支持更多语言对
- 提供批量翻译 API
- 改进翻译质量和速度
- 扩展到更多浏览器

---

## 🙏 致谢

感谢 Chrome 团队为 Web 开发者带来了如此强大的本地 AI 能力！



