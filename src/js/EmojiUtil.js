/**
 * The EmojiUtil contains all functionality for handling emoji data and groups, but no html specific stuff.
 *
 * @author Wolfgang Stöttinger
 */

//import Data from 'EmojiData';

export default class EmojiUtil {
  constructor() {
  }

  /**
   *
   */
  static  initialize() {
    EmojiUtil.aliases = {};
    EmojiUtil.unicodes = {};
    EmojiUtil.groups = {};
    EmojiUtil.filters = {};
    EmojiUtil.keywords = {};
    EmojiUtil.mode = {};
    EmojiUtil.arrfil = [];
    var path = document.location;
    var curLang = document.documentElement.lang;
    if(curLang.length===2){
      curLang='en-US';
    }

    if (path.origin.indexOf('admin')+1) {
      var   fullPath = './../../../../../emoji/groups.';  //    for CA
    }else if(path.origin.indexOf('localhost')+1){
      var   fullPath = './groups.';                       //    for stand-alone
    } else {
      var   fullPath = './../../../emoji/groups.';        //    for MA
    }

    EmojiUtil.syncJSON(fullPath+curLang+'.json', function (msg) {
      EmojiUtil.groups = msg.groups;
      EmojiUtil.filters = msg.filters;
      EmojiUtil.mode = msg.mode;
    });
  }

  static syncJSON(url, callback) {
    $.ajax({
      type: "GET",
      async: false,
      url: url,
      contentType: "application/json",
      dataType: "json",
      success: function (msg) { callback(msg) },
      error: function (msg) { alert('error : reading JSON file!!!!'); }
    });
  }

  static checkAlias(alias) {
    return EmojiUtil.aliases.hasOwnProperty(alias);
  }

  static checkUnicode(alias) {
    return EmojiUtil.unicodes.hasOwnProperty(alias);
  }

  static checkAscii(ascii) {
    return EmojiUtil.ascii.hasOwnProperty(ascii);
  }

  /**
   * @param alias
   * @param groupData if true returns an array including groupId, Col# and Row# of the Emoji
   * @returns {*}
   */
  static dataFromAlias(alias, groupData = false) {
    const key = EmojiUtil.aliases[alias];
    const data = EmojiUtil.data[key];
    if (!groupData || data[2]) // if group is set
      return data;

    for (let g = 0; g < EmojiUtil.groups.length; g++) {
      const group = EmojiUtil.groups[g];
      const d = group.dimensions;
      const pos = $.inArray(key, group.items);
      if (pos >= 0) {
        data[2] = g; // group
        data[3] = pos % d[0]; // column
        data[4] = pos / d[0] | 0; // row
        data[5] = d; // sprite dimensions
        return data;
      }
    }
    return data;
  }

  /**
   *
   * @param alias
   * @returns {*}
   */
  static unicodeFromAlias(alias) {
    if (alias) {
      const key = EmojiUtil.aliases[alias];
      const emojiData = EmojiUtil.data[key];
      if (emojiData && emojiData[EmojiUtil.EMOJI_UNICODE])
        return emojiData[EmojiUtil.EMOJI_UNICODE][0];
    }
    return null;
  }

  static unicodeFromAscii(ascii) {
    return EmojiUtil.unicodeFromAlias(EmojiUtil.aliasFromAscii(ascii));
  }

  static aliasFromUnicode(unicode) {
    if (unicode) {
      const key = EmojiUtil.unicodes[unicode];
      const emojiData = EmojiUtil.data[key];
      if (emojiData && emojiData[EmojiUtil.EMOJI_ALIASES])
        return emojiData[EmojiUtil.EMOJI_ALIASES];
    }
    return null;
  }

  static aliasFromAscii(ascii) {
    return EmojiUtil.ascii[ascii] || null;
  }

}

EmojiUtil.EMOJI_ICON      = 'i';
EmojiUtil.EMOJI_NAME      = 'n';
EmojiUtil.EMOJI_MODIFIER  = 'm';
EmojiUtil.EMOJI_KEYWORD   = 'k';
EmojiUtil.EMOJI_LIST      = 'l';
EmojiUtil.FILTER_BUTTON   = '99999';
EmojiUtil.FILTER_BASKET   = '00000';

//-----------------------------------------------------------------------------------------

EmojiUtil.initialize();
