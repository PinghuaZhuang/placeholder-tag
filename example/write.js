const fs = require('fs');
const path = require('path');
const PlaceholderTag = require('../src').default;
const filePath = path.resolve(__dirname, './text.txt');

const options = {
  encoding: 'utf8',
};

const str = `@@@@@@@@@@@@@@@
<!-- @placeholder:jsqpro:start -->
jsqproContent-01
  <!-- @placeholder:test:start -->
  testContent
  <!-- @placeholder:test:end -->
jsqproContent-02
  <!-- @placeholder:test1:start -->
  test1Content
  <!-- @placeholder:test1:end -->
jsqproContent-03
  <!-- @placeholder:test3:start -->
    <!-- @placeholder:test3-1:start -->
    test3-1Content
    <!-- @placeholder:test3-1:end -->
  test3Content
  <!-- @placeholder:test3:end -->
  <!-- @placeholder:test2:start -->
  test2Content
  <!-- @placeholder:test2:end -->
jsqproContent-04
<!-- @placeholder:jsqpro:end -->
@@@@@@@@@@@@@`;

debugger;
PlaceholderTag.parse(str);
PlaceholderTag.replace('test3-1', '\n    test3-1ContentChanged\n    ');
PlaceholderTag.replace('test3', [1], '\n  test3ContentChanged\n    ');
PlaceholderTag.replace('test', [0], '\n  testContentChanged\n  ');
const content = PlaceholderTag.replace(
  'jsqpro',
  [1, 2],
  '\njsqproContentChanged\n  ',
);

debugger;
console.log('log:', content);

fs.writeFileSync(filePath, content, options);
