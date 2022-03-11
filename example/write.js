const fs = require('fs');
const path = require('path');
const PlaceholderTag = require('../src').default;
const filePath = path.resolve(__dirname, './text.txt');
const mock = require('./mock').default;

const options = {
  encoding: 'utf8',
};

debugger;
PlaceholderTag.parse(mock);
PlaceholderTag.replace('test3-1', '\n    test3-1ContentChanged\n    ');
PlaceholderTag.replace('test3', [1], '\n  test3ContentChanged\n    ');
PlaceholderTag.replace('test', [0], '\n  testContentChanged\n  ');
PlaceholderTag.parse(
  `<!-- @placeholder:test:start -->testContent<!-- @placeholder:test:end -->`,
).replace('testChanged');
const content = PlaceholderTag.replace(
  'jsqpro',
  [1, 2],
  '\njsqproContentChanged\n  ',
);

debugger;
console.log('log:', content);

fs.writeFileSync(filePath, content, options);
