const fs = require('fs');
const path = require('path');
const PlaceholderTag = require('../src').default;
const filePath = path.resolve(__dirname, './text.txt');

const options = {
  encoding: 'utf8',
};

const str = `@@@@@@@@@@@@@@@<!-- @placeholder:jsqpro:start -->
111
  <!-- @placeholder:test:start -->
  222
  <!-- @placeholder:test:end -->
  0000
  <!-- @placeholder:test2:start -->
  333
  <!-- @placeholder:test2:end -->
  555
  <!-- @placeholder:test3:start -->
  444
  <!-- @placeholder:test3:end -->
  <!-- @placeholder:test2:start -->
  3332
  <!-- @placeholder:test2:end -->
999
<!-- @placeholder:jsqpro:end -->@@@@@@@@@@@@@`;

debugger;
const placeholderTag = PlaceholderTag.parse(str);
const content = PlaceholderTag.replace('jsqpro', [1, 2], '\n=======\n');

debugger;
console.log('log:', content);

fs.writeFileSync(
  filePath,
  PlaceholderTag.replace('jsqpro', [1, 2], '\n=======\n'),
  options,
);