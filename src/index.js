/**
 * @file 根据注释标签替换指定区域内容
 * @example
 *  PlaceholderTag.parse(`<!-- @placeholder:test:start -->Hello world!<!-- @placeholder:test:end -->`)
 *  PlaceholderTag.replace('test', 'Change success')
 *  => `<!-- @placeholder:test:start -->Change success!<!-- @placeholder:test:end -->`
 */
class PlaceholderTag {
  constructor(options = {}) {
    Object.assign(this, options, {
      _options: options,
    });
  }

  /**
   * 替换内容
   * @param {Array<number>} [indexs=[0]] indexs 索引组
   * @param {Array<string>|string} contents 内容组
   * @returns {String}
   */
  replace(indexs, contents) {
    if (
      typeof indexs === "string" ||
      indexs?.some((o) => typeof o === "string")
    ) {
      contents = indexs;
      indexs = [0];
    }

    let i = 0;
    let { children, partition, before, after, section } = this;
    let result = "";
    for (; i < partition.length; i++) {
      result += children[i - 1]?.match || "";
      if (indexs.includes(i)) {
        result += Array.isArray(contents) ? contents[i] : contents;
      } else {
        result += partition[i];
      }
    }
    this.match = this.match.replace(
      PlaceholderTag.createRegExpWithSection(section, "g", true),
      `$1${result}$2`
    );
    this.source = before + this.match + after;
    return this.source;
  }

  /**
   * 根据范围替换内容
   * @param {Array<number>} range range number
   * @param {String} content 要替换的内容
   */
  replaceRange(range, content) {
    if (!Array.isArray(range)) return "";
    const [start, end] = range;
    return this.replace(
      new Array(end - start + 1).fill(1).map((_, index) => index + start),
      content
    );
  }

  /**
   * PlaceholderTag 实例快速查找
   */
  static map = {};

  /**
   * 创建 regExp
   * @returns {RegExp}
   */
  static createRegExp() {
    return new RegExp(
      "\\<\\!--\\s*@placeholder:(?<section>.*):start\\s*--\\>(?<content>[\\s\\S]*?)\\<\\!--\\s*@placeholder:\\k<section>:end\\s*--\\>",
      "g"
    );
  }

  /**
   * 拷贝 regExp
   * @param {RegExp} regExp
   * @returns {RegExp}
   */
  static cloneRegExp(regExp) {
    return new RegExp(regExp.source, regExp.flags);
  }

  /**
   * 根据 section 创建 RegExp
   * @param {String} section section name
   * @param {String} flags regExp flags
   * @param {Boolean} isNoCapture 是否不捕获
   * @returns {RegExp}
   */
  static createRegExpWithSection(section, flags, isNoCapture) {
    const regStr = `(\\<\\!--\\s*@placeholder:${section}:start\\s*--\\>)[\\s\\S]*?(\\<\\!--\\s*@placeholder:${section}:end\\s*--\\>)`;
    if (isNoCapture) {
      regStr.replace(/\(|\)/g, "");
    }
    return new RegExp(regStr, flags);
  }

  /**
   * 解析目标文本
   * @param {String} htmlString 目标文本
   * @param {PlaceholderTag=} parent
   * @returns {Array<PlaceholderTag>}
   */
  static parse(htmlString, parent) {
    const result = [];
    const r = PlaceholderTag.createRegExp();

    let t;
    while ((t = r.exec(htmlString))) {
      const _t = {};
      const { groups } = t;
      const { content, section } = groups;
      let nexContent = content;
      const children = PlaceholderTag.parse(groups.content, _t);
      const partition = [];
      const outStr = htmlString.split(
        PlaceholderTag.createRegExpWithSection(section, "g", true)
      );

      for (let { match: curMatch } of children) {
        const [segmentation, _nexContent] = nexContent.split(curMatch);
        partition.push(segmentation);
        nexContent = _nexContent;
      }
      partition.push(nexContent);

      Object.assign(_t, {
        match: t[0],
        source: htmlString,
        partition,
        content,
        before: outStr[0],
        after: outStr[outStr.length - 1],
        section,
        children,
        parent,
        // lastIndex: r.lastIndex,
      });

      const temp = new PlaceholderTag(_t);
      const target = PlaceholderTag.map[section];
      if (target) {
        if (Array.isArray(target)) {
          temp.index = target.push(temp) - 1;
        } else {
          PlaceholderTag.map[section] = [target, temp];
          temp.index = 1;
        }
      }
      PlaceholderTag.map[section] = temp;
      result.push(temp);
    }
    return parent ? temp : result;
  }

  /**
   * 根据 section 替换文本
   * @param {String} section section name
   * @param  {[indexs, contents, ...any]} rest PlaceholderTag.prototype.replace params
   * @returns {Array<string>|string} 替换后的文本
   */
  static replace(section, ...rest) {
    let target = PlaceholderTag.map[section];
    let index = rest[rest.length - 1];
    if (target == null) {
      console.error(`<<< 没有获取到对应的 placeholderTag. section:`, section);
      return "";
    }
    target = Array.isArray(target) ? target : target;
    if (Array.isArray(target)) {
      return target[index ?? target.length - 1].replace(...rest);
    }
    return target.replace(...rest);
  }

  // static covertString(str) {
  //   return str.replace(/\\x([0-9a-f]{2})/g, (_, pair) =>
  //     String.fromCharCode(parseInt(pair, 16))
  //   );
  // }
}

export default PlaceholderTag;
