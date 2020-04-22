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
    setTimeout(this.loadEmojis.bind(this, tabs), 300);
  }

  loadPicker(options) {
    const ul = $('<ul>')
      .addClass('emoji-selector nav nav-tabs');
    const tabs = $('<div>')
      .addClass('tab-content');

    for (let g in Emoji.groups) {   // g - key of the Emoji.groups
      const group = Emoji.groups[g];
      const id = 'group_' + g;
      const gid = '#' + id;
      const a = $('<a>')
        .html(Emoji.groups[g].i)
        .data('toggle', 'tab')
        .attr('title',group.n)
        .attr('href', gid);
      ul.append($('<li>').append(a));
      const tab = $('<div>')
        .attr('id', id)
        .addClass('emoji-group tab-pane active')  //#31768 Add active class to all firstly
        .data('group', g);

      a.on('click', (e) => {
        $('.tab-pane').not(tab).hide().removeClass('active');
        //       if (options.pickerShrink){
//           tab.css({
//              height: options.tabPaneSmall + "px",
//            });
//        }
        const drop = $('.emoji-dropup');
        if('group_people_body'===id){
          drop.show();
        } else {
          drop.hide();
        }
        tab.addClass('active').show();
        e.preventDefault();
      });
      tabs.append(tab);
    }
//  emoji filters------------------------------------------------
    const filters = $('<div>')
      .addClass('emoji-filters');

    for (let f in Emoji.filters) {   // f - key of the Emoji.filters
      const dropup = $('<div>')
        .addClass('emoji-dropup');
      const dropbtn = $('<div>')
        .addClass('emoji-dropbtn')
        .html(Emoji.filters[f].i)
        .attr('mode','99999')
        .attr('id', f);
      dropup.append(dropbtn);
      const dropcont = $('<div>')
        .addClass('emoji-dropup-content');
      Emoji.arrfil[f]='';
      for (let em in Emoji.filters[f]['l']) {
        const a = $('<a>')
          .html(Emoji.filters[f]['l'][em].i)
          .attr('title', Emoji.filters[f]['l'][em].n)
          .attr('mode', Emoji.filters[f]['l'][em].m);
        a.on('click', (e) => {
          if(a.attr('mode').indexOf('00000')+1){
            dropbtn.html(dropbtn.attr('mode'));
            dropbtn.attr('title', '');
            dropbtn.attr('mode', '99999');
          }else{
            if(dropbtn.attr('mode')=='99999') {
              dropbtn.attr('mode', dropbtn.html());
            }
            dropbtn.html(a.html());
            dropbtn.attr('title', a.attr('title'));
//            dropbtn.attr('mode', a.attr('mode'));
            dropcont.hide();
            dropcont.css("display","");
//--------------------------------------
            //          const tabAct = $('.emoji-group tab-pane active');
            //          for( let el in tabAct.children() ){
            //            const $emode = $(el);
            //            $emode.html()
            //          }

 //           let group = Emoji.groups['people_body'];
//            let tab = tabs[i];
//            for (let sg in group[Emoji.EMOJI_LIST]) {
//              for (let emo in group[Emoji.EMOJI_LIST][sg][Emoji.EMOJI_LIST]) {
//                let emojiobj = group[Emoji.EMOJI_LIST][sg][Emoji.EMOJI_LIST][emo];

//                let emojiElem = $('<a>')
//                  .data('emoji', emo)
                  //            .html(EmojiArea.createEmoji(emo, this.o))
//                  .html(emo)
//                  .attr('title',emojiobj.n)
//                  .on('click', () => {this.insertEmoji(emo, this.o)});
//                $(tab).append(emojiElem);
//              }
//            }
//-------------------------------------
          }
          if (a.attr('mode')=== '00000') {
            Emoji.arrfil[f]='';
          } else {
            Emoji.arrfil[f]=a.attr('mode');
          }
          var template = '';
          if (Emoji.arrfil['skin']!=='') template = template + Emoji.arrfil['skin']+'_';
          if (Emoji.arrfil['hair']!=='') template = template + Emoji.arrfil['hair']+'_';
          if (Emoji.arrfil['gender']!=='') template = template + Emoji.arrfil['gender']+'_';
          template = template.length>0 ? template.slice(0,template.length-1): template;

          $('#group_people_body a').each((i,el) => {
            const $el = $(el);
//            alert(i + ': ' + $el.text());
            if(template!==''){
              $el.text(Emoji.mode[template]['l'][$el.text()]);
   //         } else {
   //         $el.text(Emoji.mode[template][$el.text()]);
            }
          });

 //         element.contents().each((i, e) => {
 //           if (e.nodeType === 1 || e.nodeType === 11) { // element or document fragment
 //             const $e = $(e);
 //             if (!$e.is('.emoji')) // skip emoji
 //             {
 //               this._processElement($e);
 //             }
 //           }

//          var taba =  tabAct.children();
//          for( let el in tabAct.children() ){

 //           const $emode = $(el);
  //          alert(el.val());
  //          $emode.html()
  //        }
 //         alert(template);
          e.preventDefault();
        });
        dropcont.append(a);
      }
      dropup.append(dropcont);
      filters.append(dropup);
    }

//-----------------------------------------------------------------
    tabs.find('.tab-pane').not(':first-child').hide().removeClass('active');
    this.$p.append(ul).append(tabs).append(filters);
    const drop = $('.emoji-dropup');
    drop.hide();
    return tabs.children();
  }

  selectItem(mode) {
    if (typeof this.cb === 'function'){
      alert(mode);
      this.cb(mode);
    }


  }

  // this is to show the emojis directly
  loadEmojis(tabs) {
    let i=0;
    for (let g in Emoji.groups) {   // g - key of the Emoji.groups
      let group = Emoji.groups[g];
      let tab = tabs[i];
      for (let sg in Emoji.groups[g][Emoji.EMOJI_LIST]) {
        for (let emo in Emoji.groups[g][Emoji.EMOJI_LIST][sg][Emoji.EMOJI_LIST]) {
          let emojiobj = Emoji.groups[g][Emoji.EMOJI_LIST][sg][Emoji.EMOJI_LIST][emo];
          let emojiElem = $('<a>')
            .data('emoji', emo)
//            .html(EmojiArea.createEmoji(emo, this.o))
            .html(emo)
            .attr('title',emojiobj.n)
            .on('click', () => {this.insertEmoji(emo, this.o)});
          $(tab).append(emojiElem);
        }
      }
      i++;
    }
  }

  // this is to show the subgroups
//  loadEmojis(tabs) {
//    let i=0;
//    for (let g in Emoji.groups) {   // g - key of the Emoji.groups
//      let group = Emoji.groups[g];
//      let tab = tabs[i];
//      for (let sg in Emoji.groups[g][Emoji.EMOJI_LIST]) {
//        let subgroup = group[Emoji.EMOJI_LIST][sg];
//        let emojiElem = $('<a>')
//          .data('emoji', sg)
//          .html(Emoji.groups[g][Emoji.EMOJI_LIST][sg].i)
//          .on('click', () => {this.insertEmoji(sg, this.o)});  // ?????
//        $(tab).append(emojiElem);
//      }
//      i++;
//    }
//  }

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
 //       pickerLeft = - emojwrapOFF.left;  For demo page ONLY! URGENT!!
    }

    var toBottom =  winH - targetH - targetTop;
    if (toBottom<pickerH) {
       if (toBottom<pickerh) {
          pickerTop = - pickerh-(emojwrapOFF.top-targetTop);
       }
       options.pickerShrink = true;
    } else {
      options.pickerShrink = false;
    }

    this.$p.css({
        top:  pickerTop.toFixed(0)+"px",
        left: pickerLeft.toFixed(0)+"px",
    });
    if (options.pickerShrink) {
        this.$p.css({
           height: options.heightSmall + "px",
        });
    } else {
        this.$p.css({
          height: options.heightBig + "px",
        });
    }
  };

  show(insertCallback, anchor, options) {
    this.cb = insertCallback;
    this.reposition(anchor, options);
    this.$p.attr('data-picker-type', options.type); // $.data() here not possible, doesn't change dom

    if (options.pickerShrink){
        $('.tab-pane').css({
              height: options.heightSmall-25 + "px",
            });
    } else {
        $('.tab-pane').css({
          height: options.heightBig-30+"px",
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
