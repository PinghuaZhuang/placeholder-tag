var typescript = require('rollup-plugin-typescript2');
var babel = require('rollup-plugin-babel');
var replace = require('rollup-plugin-replace');

var pkg = require('../package.json');
var name = 'PlaceholderTag';
var version = pkg.version;

var banner = `/*!
 * ${pkg.name} ${version} (${pkg.repository.url})
 * API ${pkg.repository.url}/blob/master/doc/api.md
 * Copyright 2022-${new Date().getFullYear()} ${pkg.name}. All Rights Reserved
 * Licensed under MIT (${pkg.repository.url}/blob/master/LICENSE)
 */
`;

var type = pkg.srctype === 'ts' ? 'ts' : 'js';

function getCompiler(opt) {
  if (type === 'js') {
    return babel({
      babelrc: true,
      exclude: 'node_modules/**',
    });
  }

  opt = opt || {
    tsconfigOverride: { compilerOptions: { module: 'ES2015' } },
  };

  return typescript(opt);
}

exports.type = type;
exports.name = name;
exports.banner = banner;
exports.getCompiler = getCompiler;
exports.plugins = [
  replace({
    // include: 'src/index.js', // 指定可以使用变量的文件路径
    exclude: 'node_modules/**',
    ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    VERSION: pkg.version,
  }),
];
