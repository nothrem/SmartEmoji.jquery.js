/**
 * This EmojiArea is rewritten from ground up an based on the code from Brian Reavis <brian@diy.org>
 *
 * @author Wolfgang Stöttinger
 */
import $ from 'jquery';
import EmojiPicker from 'EmojiPicker';
import Emoji from 'EmojiUtil'

export default class EmojiArea {

  constructor(emojiArea, options) {
    this.o = $.extend({}, EmojiArea.DEFAULTS, options);
    this.$ea = $(emojiArea);
    this.$ti = this.$ea.find(options.inputSelector);
    this.$b = this.$ea.find(options.buttonSelector)
      .on('click', this.togglePicker.bind(this));

    this.$e = this.$ti;
    this.$ti.on(options.inputEvent, this.processTextContent.bind(this));

    this.processTextContent();

    const v = this.$ti.val();
    this.$ti[0].setSelectionRange(v.length, v.length);
    this.textSel = { start: v.length, end: v.length };

    this.$e
      .focusout(this.saveSelection.bind(this))
      .focus(this.restoreSelection.bind(this));
    // $(document.body).on('mousedown', this.saveSelection.bind(this));
  }

  //
  // Clipboard handling
  //

  // noinspection JSMethodCanBeStatic
  clipboardCopy(e) {
    // only allow plain text copy:
    const cbd = e.originalEvent.clipboardData || window.clipboardData;
    const content = window.getSelection().toString();
    window.clipboardData ? cbd.setData('text', content) : cbd.setData('text/plain', content);
    e.preventDefault();
  }

  clipboardPaste(e) {
    // only allow to paste plain text
    const cbd = e.originalEvent.clipboardData || window.clipboardData;
    const content = window.clipboardData ? cbd.getData('text') : cbd.getData('text/plain');

    if (!document.execCommand('insertText', false, content)) {
      this.saveSelection();
      const range = this.htmlSel;
      const insert = document.createTextNode(content);
      range.deleteContents();
      range.insertNode(insert);
      range.setStartAfter(insert);
      range.setEndAfter(insert);
      setTimeout(this.onInput.bind(this), 0);
    }
    e.preventDefault();
  }

  //
  // Selection handling
  //
  saveSelection() {
    const e = this.$e[0];
    // for unicode mode, the textarea itself:
    if (this.$e === this.$ti && e.selectionStart && e.selectionEnd) {
      this.textSel = { start: e.selectionStart, end: e.selectionEnd };
    } else {
      const sel = window.getSelection();
      if (sel.focusNode && (sel.focusNode === e || sel.focusNode.parentNode === e)) {
        this.htmlSel = sel.getRangeAt(0);
      }
    }
  }

  restoreSelection(event, hSel = this.htmlSel, tSel = this.textSel) {
    if (hSel) {
      const s = window.getSelection();
      s.removeAllRanges();
      s.addRange(hSel);
    } else if (tSel) {
      if (!event || event.type !== 'focus') {
        this.$ti[0].focus();
      }
      this.$ti[0].setSelectionRange(tSel.start, tSel.end);
    }
  }

  replaceSelection(content, hSel = this.htmlSel, tSel = this.textSel) {
    this.restoreSelection(null, hSel, tSel);
    if (hSel) {
      if (!document.execCommand('insertHTML', false, content)) {
        // let insert = $.parseHTML(content)[0];
        // insert = document.importNode(insert, true); // this is necessary for IE
        hSel.deleteContents();
        const insert = hSel.createContextualFragment(content);
        hSel.insertNode(insert);
        hSel.collapse(false);
        // hSel.setStartAfter(insert.lastChild);
        // hSel.setEndAfter(insert.lastChild);
        return insert;
      }
      return true;
    }
    else if (tSel) {
      if (!document.execCommand('insertText', false, content)) {
        let val = this.$e.val();
        this.$e.val(val.slice(0, tSel.start) + content + val.slice(tSel.end));
        tSel.start = tSel.end = tSel.start + content.length;
        this.$ti[0].setSelectionRange(tSel.start, tSel.end);
      }
      return true;
    }
    return false;
  }

  onInput(event) {
    if (!event || (event.originalEvent && event.originalEvent.inputType !== 'historyUndo')) {
      this.processContent();
      this.updateInput();
    }
  }

  onKey(e) {
    if (e.originalEvent.keyCode === 13) { // catch enter and just insert <br>
      this.saveSelection();
      this.replaceSelection('<br>');

      if (this.$e[0].lastChild.nodeName !== 'BR') {
        this.$e.append('<br>'); // this is necessary to render correctly.
      }

      e.stopPropagation();
      return false;
    }
  }

  updateInput() {
    this.$ti.val(this.$e[0].innerText || this.$e[0].textContent);
    this.$ti.trigger(this.o.inputEvent);
  }

  processTextContent(event) {
    if (!event || (event.originalEvent && event.originalEvent.inputType !== 'historyUndo')) {
      let val = this.$ti.val();
      let parsed = this.replaceAscii(val);
      parsed = this.replaceAliases(parsed);
      if (parsed !== val) {
        const sel = parsed.length - (val.length - this.$ti[0].selectionEnd);
        this.$ti.val(parsed);
        this.$ti[0].setSelectionRange(sel, sel);
        this.textSel = { start: sel, end: sel };
        this.$ti
          .focus()
          .trigger(this.o.inputEvent);
      }
    }
  }

  processContent() {
    this.saveSelection();
    this._processElement(this.$e);
    if (this.$e[0].lastChild.nodeName !== 'BR') {
      this.$e.append('<br>'); // this is necessary to render correctly.
    }
  }

  _processElement(element = this.$e) {
    // this is a bit more complex because
    //  a) only text nodes should be replaced
    //  b) the cursor position should be kept after an alias is replaced

    element.contents().each((i, e) => {
      if (e.nodeType === 1 || e.nodeType === 11) { // element or document fragment
        const $e = $(e);
        if (!$e.is('.emoji')) // skip emoji
        {
          this._processElement($e);
        }
      }
      else if (e.nodeType === 3) { // text node
        // replace unicodes
        let parsed = e.nodeValue;

        if (this.o.type !== 'unicode') { //convert existing unicodes
          parsed = this.replaceUnicodes(parsed);
        }

        parsed = this.replaceAscii(parsed);
        parsed = this.replaceAliases(parsed);

        if (parsed !== e.nodeValue) {
          const isSelected = (this.htmlSel && this.htmlSel.endContainer === e);
          const range = isSelected ? this.htmlSel : document.createRange();
          const caret = this.htmlSel ? e.nodeValue.length - this.htmlSel.endOffset : 0;
          const next = e.nextSibling;
          range.selectNode(e);
          this.replaceSelection(parsed, range, null);
          if (isSelected) {
            if (next.previousSibling) {
              const inserted = next.previousSibling;
              range.setStart(inserted, inserted.length - caret);
              range.setEnd(inserted, inserted.length - caret);
              //this.htmlSel.setStartAfter(content[content.length - 1]);
              //this.htmlSel.collapse(false);
            }
            else {
              range.setStartBefore(this.$e[0].lastChild);
              range.setEndBefore(this.$e[0].lastChild);
            }
          }
        }
      }
    });
  }

  replaceUnicodes(text) {
    return text.replace(this.o.unicodeRegex, (match, unicode) => {
      return Emoji.checkUnicode(unicode)
        ? EmojiArea.createEmoji(null, this.o, unicode)
        : unicode;
    });
  }

  replaceAscii(text) {
    return text.replace(this.o.asciiRegex, (match, ascii) => {
      if (Emoji.checkAscii(ascii)) {
        const alias = Emoji.aliasFromAscii(ascii);
        if (alias) {
          return EmojiArea.createEmoji(alias, this.o);
        }
      }
      return ascii + ' ';
    });
  }

  replaceAliases(text) {
    return text.replace(this.o.aliasRegex, (match, alias) => {
      return Emoji.checkAlias(alias)
        ? EmojiArea.createEmoji(alias, this.o)
        : ':' + alias + ':';
    });
  }

  togglePicker() {
    const delegate = (this.picker || EmojiPicker);
    if (!delegate.isVisible()) {
      this.picker = delegate.show(this.insert.bind(this), this.$b, this.o);
    } else {
      delegate.hide();
    }
    return false;
  }

  insert(alias) {
    const content = EmojiArea.createEmoji(alias, this.o);
    if (!this.replaceSelection(content)) {
      this.$e.append(content)
        .focus()
        .trigger(this.o.inputEvent);
    }
  }

  static createEmoji(alias, options = EmojiArea.DEFAULTS, unicode) {
    if (!alias && !unicode) {
      return;
    }
    alias = alias || Emoji.aliasFromUnicode(unicode);
    unicode = unicode || Emoji.unicodeFromAlias(alias);
    return unicode
      ? unicode
      : alias;
  }

  static generateEmojiTag(unicode, alias) {
    throw new Error('CSS emoji are not supported.');
    return '<i class="emoji emoji-' + alias + '" contenteditable="false">' + unicode + '</i>';
  }

  static generateEmojiImg(unicode, alias, options = EmojiArea.DEFAULTS) {
    throw new Error('Image emoji are not supported.');
  }
}

EmojiArea.DEFAULTS = {
  aliasRegex: /:([a-z0-9_]+?):/g, //deprecated, colon aliased not supported in unicode mode
  asciiRegex: /([\/<:;=8>(][()D3opPy*>\/\\|-]+) /g,
  unicodeRegex: /([\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}])/ug,
  inputSelector: 'input:text, textarea',
  buttonSelector: '>.emoji-button',
  inputEvent: /Trident/.test(navigator.userAgent) ? 'textinput' : 'input',
  keyEvent: 'keypress',
  anchorAlignment: 'left', // can be left|right
  anchorOffsetX: -5,
  anchorOffsetY: 5,
  type: 'unicode', // deprecated, unicode is the only supported mode
  iconSize: 25, // deprecated, not supported in unicode mode
  assetPath: '', // deprecated, not supported in unicode mode
  textClipboard: true,
  globalPicker: true,
};

EmojiArea.AUTOINIT = true;
EmojiArea.INJECT_STYLES = false; // only makes sense when EmojiArea.type != 'unicode'
