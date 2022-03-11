const { default: PlaceholderTag } = require('../src');
const { default: mock } = require('../example/mock');
const { expect } = require('chai');
const placeholder = PlaceholderTag.parse(mock);

describe('Placeholder method', function () {
  it('pase', function () {
    expect(placeholder.content).to.be.equal(
      `\njsqproContent-01\n  <!-- @placeholder:test:start -->\n  testContent\n  <!-- @placeholder:test:end -->\njsqproContent-02\n  <!-- @placeholder:test1:start -->\n  test1Content\n  <!-- @placeholder:test1:end -->\njsqproContent-03\n  <!-- @placeholder:test3:start -->\n    <!-- @placeholder:test3-1:start -->\n    test3-1Content\n    <!-- @placeholder:test3-1:end -->\n  test3Content\n  <!-- @placeholder:test3:end -->\n  <!-- @placeholder:test2:start -->\n  test2Content\n  <!-- @placeholder:test2:end -->\njsqproContent-04\n`,
    );
    expect(placeholder.children.length).to.be.equal(4);
  });

  it('replace', function () {
    PlaceholderTag.replace('test3-1', '\n    test3-1ContentChanged\n    ');
    PlaceholderTag.replace('test3', [1], '\n  test3ContentChanged\n    ');
    PlaceholderTag.replace('test', [0], '\n  testContentChanged\n  ');
    expect(
      PlaceholderTag.replace('jsqpro', [1, 2], '\njsqproContentChanged\n  '),
    ).to.be.equal(
      `@@@@@@@@@@@@@@@\n<!-- @placeholder:jsqpro:start -->\njsqproContent-01\n  <!-- @placeholder:test:start -->\n  testContentChanged\n  <!-- @placeholder:test:end -->\njsqproContentChanged\n  <!-- @placeholder:test1:start -->\n  test1Content\n  <!-- @placeholder:test1:end -->\njsqproContentChanged\n  <!-- @placeholder:test3:start -->\n    <!-- @placeholder:test3-1:start -->\n    test3-1ContentChanged\n    <!-- @placeholder:test3-1:end -->\n  test3ContentChanged\n    <!-- @placeholder:test3:end -->\n  <!-- @placeholder:test2:start -->\n  test2Content\n  <!-- @placeholder:test2:end -->\njsqproContent-04\n<!-- @placeholder:jsqpro:end -->\n@@@@@@@@@@@@@`,
    );
  });
});

describe('Placeholder instance method', function () {
  it('replaceRange', function () {
    expect(
      placeholder.replaceRange([0, 2], '\njsqproContentChanged\n  '),
    ).to.be.equal(
      `@@@@@@@@@@@@@@@\n<!-- @placeholder:jsqpro:start -->\njsqproContentChanged\n  <!-- @placeholder:test:start -->\n  testContentChanged\n  <!-- @placeholder:test:end -->\njsqproContentChanged\n  <!-- @placeholder:test1:start -->\n  test1Content\n  <!-- @placeholder:test1:end -->\njsqproContentChanged\n  <!-- @placeholder:test3:start -->\n    <!-- @placeholder:test3-1:start -->\n    test3-1ContentChanged\n    <!-- @placeholder:test3-1:end -->\n  test3ContentChanged\n    <!-- @placeholder:test3:end -->\n  <!-- @placeholder:test2:start -->\n  test2Content\n  <!-- @placeholder:test2:end -->\njsqproContent-04\n<!-- @placeholder:jsqpro:end -->\n@@@@@@@@@@@@@`,
    );
  });

  it('find', function () {
    expect(placeholder.find('test') instanceof PlaceholderTag).to.be.equal(
      true,
    );
  });

  it('instance replace', function () {
    expect(
      PlaceholderTag.parse(
        `<!-- @placeholder:test-5:start -->test-5Content<!-- @placeholder:test-5:end -->`,
      ).replace('test-5Changed'),
    ).to.be.equal(
      `<!-- @placeholder:test-5:start -->test-5Changed<!-- @placeholder:test-5:end -->`,
    );
  });
});
