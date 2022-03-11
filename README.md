# Placeholder-Tag

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/PinghuaZhuang/placeholder-tag/blob/master/LICENSE) [![npm](https://img.shields.io/npm/v/placeholder-tag)](https://www.npmjs.com/package/placeholder-tag) [![Commit](https://img.shields.io/github/last-commit/pinghuazhuang/placeholder-tag.svg)](https://github.com/PinghuaZhuang/placeholder-tag/commits/master)

🧩 html占位符标签. 指定位置替换文本, 支持树状关系. 

## Example

[live demo](https://github.com/PinghuaZhuang/PinghuaZhuang)

## Quick Start

```bash
npm install placeholder-tag --save
```

```js
const mock = `<!-- @placeholder:test:start -->testContent<!-- @placeholder:test:end -->`
```

```js
PlaceholderTag.parse(mock).replace('\ntestContentChanged\n  ')
// => `<!-- @placeholder:test:start -->testChanged<!-- @placeholder:test:end -->`
```

## Methods

```js
class PlaceholderTag {
  /**
   * 替换内容
   * @param {Array<number>} [indexs=[0]] indexs 索引组
   * @param {Array<string>|string} contents 内容组
   * @returns {String}
   */
  replace(indexs, contents) {}

  /**
   * 根据范围替换内容
   * @param {Array<number>} range range number
   * @param {String} content 要替换的内容
   */
  replaceRange(range, content) {}

  /**
   * 根据section查找最近的子元素
   * @param {String} section 子元素的section值
   * @returns {PlaceholderTag} 目标对象
   */
  find(section) {}

  /**
   * PlaceholderTag 实例快速查找
   */
  static map = {};

  /**
   * 创建 regExp
   * @returns {RegExp}
   */
  static createRegExp() {}

  /**
   * 拷贝 regExp
   * @param {RegExp} regExp
   * @returns {RegExp}
   */
  static cloneRegExp(regExp) {}

  /**
   * 根据 section 创建 RegExp
   * @param {String} section section name
   * @param {String} flags regExp flags
   * @param {Boolean} isNoCapture 是否不捕获
   * @returns {RegExp}
   */
  static createRegExpWithSection(section, flags, isNoCapture) {}

  /**
   * 清除 map 保存的数据
   */
  static clean() {}
}
```

