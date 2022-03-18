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
    let { children, partition, before, after, section } = this;
    this.source = before + this.match + after;

    if (
      typeof indexs === 'string' ||
      indexs?.some((o) => typeof o === 'string')
    ) {
      contents = indexs;
      indexs = [0];
    }

    let i = 0;
    let result = '';
    for (; i < partition.length; i++) {
      result += children[i - 1]?.match || '';
      if (indexs.includes(i)) {
        result += Array.isArray(contents) ? contents[i] : contents;
      } else {
        result += partition[i];
      }
    }
    this.match = this.match.replace(
      PlaceholderTag.createRegExpWithSection(section, 'g', true),
      `$1${result}$2`,
    );
    this.content = result;

    return (this.replacement = before + this.match + after);
  }

  /**
   * 根据范围替换内容
   * @param {Array<number>} range range number
   * @param {String} content 要替换的内容
   */
  replaceRange(range, content) {
    if (!Array.isArray(range)) return '';
    const [start, end] = range;
    const rangeArr = [];
    let i = start;
    for (; i <= end; i++) {
      rangeArr.push(i);
    }
    return this.replace(rangeArr, content);
  }

  /**
   * 根据section查找最近的子元素
   * @param {String} section 子元素的section值
   * @returns {PlaceholderTag} 目标对象
   */
  find(section) {
    const { children } = this;
    let i = 0,
      { length } = children,
      target;
    if (children == null) return;
    for (; i < length; i++) {
      target = this.children[i];
      if (target.section === section) return target;
      return target.find(section);
    }
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
      '\\<\\!--\\s*@placeholder:(?<section>.*):start\\s*--\\>(?<content>[\\s\\S]*?)\\<\\!--\\s*@placeholder:\\k<section>:end\\s*--\\>',
      'g',
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
      regStr.replace(/\(|\)/g, '');
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
        PlaceholderTag.createRegExpWithSection(section, 'g', true),
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
        console.warn(
          `${section} already defined. Please look it up by index. index: ${temp.index}`,
          temp,
          target,
        );
      } else {
        PlaceholderTag.map[section] = temp;
      }
      result.push(temp);
    }
    return parent ? result : result[0];
  }

  /**
   * 根据 section 替换文本
   * @param {String} section section name
   * @param  {[indexs, contents, ...any]} rest PlaceholderTag.prototype.replace params
   * @returns {Array<string>|string} 替换后的文本
   */
  static replace(section, ...rest) {
    let target = PlaceholderTag.map[section];
    // let index = rest[rest.length - 1];
    if (target == null) {
      console.error(`<<< No find placeholderTag object. section:`, section);
      return '';
    }
    if (Array.isArray(PlaceholderTag.map[section])) {
      // return target[index ?? target.length - 1].replace(...rest);
      target.forEach((o) => o.replace(...rest));
      return target[0].replacement;
    }
    return target.replace(...rest);
  }

  /**
   * 清除 map 保存的数据
   */
  static clean() {
    this.map = {};
  }

  // static covertString(str) {
  //   return str.replace(/\\x([0-9a-f]{2})/g, (_, pair) =>
  //     String.fromCharCode(parseInt(pair, 16))
  //   );
  // }
}

export default PlaceholderTag;
