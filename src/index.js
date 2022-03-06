const placeholderSource =
  "\\<\\!--\\s*@placeholder:(?<section>.*):start\\s*--\\>(?<content>[\\s\\S]*?)\\<\\!--\\s*@placeholder:\\k<section>:end\\s*--\\>";

function replace(content, index = 0) {
  let i = 0;
  let {
    children,
    contentArr,
  } = this;
  let result = "";
  for (; i < contentArr.length; i++) {
    result +=
      (children[index - 1]?.match || "") +
      (i !== index ? contentArr[i] : content);
  }
  return result;
}

const prototype = {
  replace,
}

const placeholderTagParse = {
  regExp: new RegExp(placeholderSource, "g"),
  createRegExp() {
    return new RegExp(placeholderSource, "g");
  },
  cloneRegExp(regExp) {
    return new RegExp(regExp.source, regExp.flags);
  },
  // exec(content) {
  //   return this.reg.exec(content)
  // },
  replace(target, ...rest) {
    return replace.call(target, ...rest)
  },
  parse(source, parent) {
    const result = [];
    const r = this.createRegExp();

    let t;
    while ((t = r.exec(source))) {
      const _t = Object.create(prototype);
      const { groups } = t;
      const content = groups.content;
      let nexContent = content;
      const children = this.parse(groups.content, _t);
      const contentArr = [];

      for (let { match: curMatch } of children) {
        const [segmentation, _nexContent] = nexContent.split(curMatch);
        contentArr.push(segmentation);
        nexContent = _nexContent;
      }
      contentArr.push(nexContent);

      Object.assign(_t, {
        match: t[0],
        source,
        contentArr,
        content,
        before: contentArr[0],
        after: contentArr[contentArr.length - 1],
        section: groups.section,
        children,
        parent,
        execOut: t,
        lastIndex: r.lastIndex,
      });
      result.push(_t);
    }
    return result;
  },
};

const str = `<!-- @placeholder:jsqpro:start -->
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
<!-- @placeholder:jsqpro:end -->`;

console.log("xxxxxx", placeholderTagParse.parse(str)[0].replace('==================', 4), str.length);

// export default placeholderTagParse
// module.exports = placeholderTagParse
