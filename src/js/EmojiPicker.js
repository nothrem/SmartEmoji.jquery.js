/**
 * Emoji Picker (Dropdown) can work as global singleton (one dropdown for all inputs on the page)
 * or with separate instances (and settings) for each input.
 *
 * @author Wolfgang Stöttinger
 */
import $ from 'jquery';
import EmojiArea from 'EmojiArea';
import Emoji from 'EmojiUtil';

export default class EmojiPicker {

  constructor(options = EmojiArea.DEFAULTS) {
    this.o = options;
    const $body = $(document.body);
    $body.on('keydown', (e) => { if (e.keyCode === KEY_ESC || e.keyCode === KEY_TAB) this.hide(); });
    $body.on('click', () => { this.hide(); });
    $(window).on('resize', () => { if (this.$p.is(':visible')) { this.hide(); }});

    var $emojidiv =  $(options.input).parents('form').find('.emoji-wrapper').attr('id');        /* #31768 */
    var ifPickerExist = $(options.input).parents('form').find('.emoji-picker').attr('class'); 
    if (!ifPickerExist) {
        this.$p = $('<div>')
        .addClass('emoji-picker')
        .attr('data-picker-type', options.type) // $.data() here not possible, doesn't change dom
        .on('mouseup click', (e) => e.stopPropagation() && false)
        .hide()
        .appendTo('#'+$emojidiv);                                          
    }
   
    const tabs = this.loadPicker(options);
    setTimeout(this.loadEmojis.bind(this, tabs), 100);
  }

  loadPicker(options) {
    const ul = $('<ul>')
      .addClass('emoji-selector nav nav-tabs');
    const tabs = $('<div>')
      .addClass('tab-content');

    for (let g = 0; g < Emoji.groups.length; g++) {
      const group = Emoji.groups[g];
      const id = 'group_' + group.name;
      const gid = '#' + id;

      const a = $('<a>')
        .html(EmojiArea.createEmoji(group.name, this.o))
        .data('toggle', 'tab')
        .attr('href', gid);

      ul.append($('<li>').append(a));

      const tab = $('<div>')
        .attr('id', id)
        .addClass('emoji-group tab-pane active')  //#31768 Add active class to all firstly
        .data('group', group.name);
        
      a.on('click', (e) => {
        $('.tab-pane').not(tab).hide().removeClass('active');
 //       if (options.pickerShrink){
//           tab.css({  
//              height: options.tabPaneSmall + "px",      
//            });      
//        }  
        tab.addClass('active').show(); 
        e.preventDefault();
      });
      tabs.append(tab);
    }
    
    tabs.find('.tab-pane').not(':first-child').hide().removeClass('active');

    this.$p.append(ul).append(tabs);
    return tabs.children();
  }

  loadEmojis(tabs) {
    for (let g = 0; g < Emoji.groups.length; g++) {
      const group = Emoji.groups[g];
      const tab = tabs[g];
      for (let e = 0; e < group.items.length; e++) {
        const emojiId = group.items[e];
        if (Emoji.data.hasOwnProperty(emojiId)) {
          const word = Emoji.data[emojiId][Emoji.EMOJI_ALIASES] || '';
          const emojiElem = $('<a>')
            .data('emoji', word)
            .html(EmojiArea.createEmoji(word, this.o))
            .on('click', () => {this.insertEmoji(word, this.o)});
          $(tab).append(emojiElem);
        }
      }
    }
  }

  insertEmoji(emoji, options) {
    if (typeof this.cb === 'function')
      this.cb(emoji, options);
    if (options.hideOnSelect){
        this.hide();
    }
  
  }

  reposition(anchor, options) {
    if (!anchor || anchor.length === 0)
      return;
      
    
    const $anchor = $(anchor);
    const pickerH = options.heightBig;
    const pickerh = options.heightSmall;  
    const pickerW = options.pickerWidth; 
    var $emojwrap =  $anchor.parent(); 
    var emojwrapOFF = $emojwrap.offset();  
      
    const winW = $(window).width();
    const winH = $(window).height(); 
      
    const $target = $(options.input);
    var targetOFF = $target.offset();
    var targetW = $target.width();
    var targetH = $target.outerHeight(false);
    var targetLeft = targetOFF.left;
    var targetTop  = targetOFF.top; 
    var pickerLeft = - pickerW;
      
    if (options.anchorButton) {
        targetTop = $anchor.offset().top;
        targetH = $anchor.outerHeight(false);
        pickerLeft = ($emojwrap.width()-pickerW)/2;
    } 
      
    var pickerTop =  targetTop + targetH - emojwrapOFF.top;

    if (emojwrapOFF.left<pickerW){
        pickerLeft = - emojwrapOFF.left;
    }  
      
    var toBottom =  winH - targetH - targetTop;
    if (toBottom<pickerH) {
       if (toBottom<pickerh) {
          pickerTop = - pickerh-(emojwrapOFF.top-targetTop);  
       } 
       options.pickerShrink = true;  
    } 
      
    this.$p.css({
        top:  pickerTop.toFixed(0)+"px",
        left: pickerLeft.toFixed(0)+"px",
    });
    if (options.pickerShrink) {
        this.$p.css({
           height: options.heightSmall + "px",      
        });     
    } 
  };

  show(insertCallback, anchor, options) {
    this.cb = insertCallback;
    this.reposition(anchor, options);
    this.$p.attr('data-picker-type', options.type); // $.data() here not possible, doesn't change dom
    
    if (options.pickerShrink){
        $('.tab-pane').css({  
              height: options.tabPaneSmall + "px",      
            });      
    }   
      
    this.$p.show();
    return this;
  }

  hide() {
    this.$p.hide();
  }

  isVisible() {
    return this.$p.is(':visible');
  }
}

EmojiPicker.globalPicker = null;

EmojiPicker.show = function (insertCallback, anchor, options = EmojiArea.DEFAULTS) {
  let picker = EmojiPicker.globalPicker;
  if (!options.globalPicker)
    picker = new EmojiPicker(options);
  if (!picker)
    picker = EmojiPicker.globalPicker = new EmojiPicker(options);
  picker.show(insertCallback, anchor, options);
  return picker;
};

EmojiPicker.isVisible = function () {
  return EmojiPicker.globalPicker && EmojiPicker.globalPicker.isVisible();
};

EmojiPicker.hide = function () {
  !EmojiPicker.globalPicker || EmojiPicker.globalPicker.hide();
};

const KEY_ESC = 27;
const KEY_TAB = 9;