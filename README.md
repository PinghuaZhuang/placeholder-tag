# Placeholder-Tag

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/PinghuaZhuang/placeholder-tag/blob/master/LICENSE) [![npm](https://img.shields.io/npm/v/placeholder-tag)](https://www.npmjs.com/package/placeholder-tag) [![Commit](https://img.shields.io/github/last-commit/pinghuazhuang/placeholder-tag.svg)](https://github.com/PinghuaZhuang/placeholder-tag/commits/master) [![Size](https://img.shields.io/github/languages/code-size/pinghuazhuang/placeholder-tag.svg)](https://github.com/PinghuaZhuang/placeholder-tag) 

🧩 html占位符标签. 指定位置替换文本, 支持树状关系. 

## Example

live demo

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

