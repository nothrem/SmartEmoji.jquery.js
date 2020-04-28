/**
 * Emoji Picker (Dropdown) can work as global singleton (one dropdown for all inputs on the page)
 * or with separate instances (and settings) for each input.
 *
 * @author Wolfgang Stöttinger
 */
import $ from 'jquery';
import EmojiArea from 'EmojiArea';
import Emoji from 'EmojiUtil';
import EmojiUtil from "EmojiUtil";

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
    var howmany = 1;
    for (let f in Emoji.filters) {   // f - key of the Emoji.filters
      if ('skin' === f || 'gender' === f) {
        howmany = 2;
      } else {
        howmany = 1;
      }
      for(let i = 0; i < howmany; i++){
        var tmpid = f+i.toString();
        const dropup = $('<div>')
          .addClass('emoji-dropup')
          .attr('id',tmpid);
        if (i==1) {
          dropup.css("pointer-events", "none");
        }else{
          dropup.css("pointer-events", "auto");
        }
        const dropbtn = $('<div>')
          .addClass('emoji-dropbtn')
          .html(Emoji.filters[f].i)
          .data('mode', Emoji.FILTER_BUTTON)
          .attr('id', 'd'+tmpid);
        dropup.append(dropbtn);
        const dropcont = $('<div>')
          .addClass('emoji-dropup-content');
        Emoji.arrfil[tmpid] = '';
        for (let em in Emoji.filters[f][Emoji.EMOJI_LIST]) {
          const a = $('<a>')
            .html(Emoji.filters[f][Emoji.EMOJI_LIST][em].i)
            .attr('title', Emoji.filters[f][Emoji.EMOJI_LIST][em].n)
            .data('mode', Emoji.filters[f][Emoji.EMOJI_LIST][em].m);
            a.on('click', (e) => {
            if (a.data('mode').indexOf(Emoji.FILTER_BASKET) + 1) {
              if (dropbtn.data('mode') !== Emoji.FILTER_BUTTON) dropbtn.html(dropbtn.data('mode'));
              dropbtn.attr('title', '');
              dropbtn.data('mode', Emoji.FILTER_BUTTON);
            } else {
              if (dropbtn.data('mode') === Emoji.FILTER_BUTTON) {
                dropbtn.data('mode', dropbtn.html());
              }
              dropbtn.html(a.html());
              dropbtn.attr('title', a.attr('title'));
            }
            if (a.data('mode') === Emoji.FILTER_BASKET) {
              Emoji.arrfil[dropup.attr('id')] = '';
            } else {
              Emoji.arrfil[dropup.attr('id')] = a.data('mode');
            }
              dropup.mouseover(function(){dropcont.show();});   //#31769 To show drop-up content
              dropup.mouseout(function(){dropcont.hide();});   //#31769 To hide drop-up content
              dropup.click(function(){dropcont.hide();});      //#31769 To hide drop-up content

              switch (dropup.attr('id')) {
                case 'skin0':
                  if(Emoji.arrfil[dropup.attr('id')]!==''){
                    $('#skin1').css("pointer-events", "auto");
                    $('#hair0').css("pointer-events", "auto");
                    $('#gender0').css("pointer-events", "none");
                  }else{
                    $('#skin1').css("pointer-events", "none");
                    $('#gender0').css("pointer-events", "auto");
                    $('#hair0').css("pointer-events", "auto");
                    Emoji.arrfil['skin1']='';
                    var butt = $('#dskin1');
                    if(butt.data('mode')!==Emoji.FILTER_BUTTON){
                      butt.html(butt.data('mode'));
                      butt.data('mode',Emoji.FILTER_BUTTON);
                    }

                  }
                  break;

                case 'skin1':
                  if(Emoji.arrfil[dropup.attr('id')]!==''){
                    $('#hair0').css("pointer-events", "none");
                    $('#gender0').css("pointer-events", "none");
                    $('#gender1').css("pointer-events", "none");
                  }else{
                    $('#hair0').css("pointer-events", "auto");
                  }
                  break;

                case 'hair0':
                  if(Emoji.arrfil[dropup.attr('id')]!==''){
                    $('#skin0').css("pointer-events", "auto");
                    $('#skin1').css("pointer-events", "none");
                    $('#gender0').css("pointer-events", "none");
                    $('#gender1').css("pointer-events", "none");
                  }else{
                    $('#skin0').css("pointer-events", "auto");
                    if (Emoji.arrfil["skin0"]!==''){
                      $('#gender0').css("pointer-events", "none");
                    }else{
                      $('#gender0').css("pointer-events", "auto");
                    }
                  }
                  break;

                case 'gender0':
                  if(Emoji.arrfil[dropup.attr('id')]!==''){
                    $('#skin0').css("pointer-events", "none");
                    $('#skin1').css("pointer-events", "none");
                    $('#hair0').css("pointer-events", "none");
                    $('#gender1').css("pointer-events", "auto");
                  }else{
                    $('#gender1').css("pointer-events", "none");
                    $('#skin0').css("pointer-events", "auto");
                    $('#hair0').css("pointer-events", "auto");
                    Emoji.arrfil['gender1']='';
                    var butt = $('#dgender1');
                    if(butt.data('mode')!==Emoji.FILTER_BUTTON){
                      butt.html(butt.data('mode'));
                      butt.data('mode',Emoji.FILTER_BUTTON);
                    }
                  }
                  break;

                case 'gender1':
                  if(Emoji.arrfil[dropup.attr('id')]!==''){
                    $('#skin0').css("pointer-events", "none");
                    $('#skin1').css("pointer-events", "none");
                    $('#hair0').css("pointer-events", "none");
                  }else{
                    $('#gender1').css("pointer-events", "none");
                    $('#gender0').css("pointer-events", "auto");
                  }
                  break;
                default:
                  break;
              }

            var template = '';
            if (Emoji.arrfil['skin0'] !== '') template = template + Emoji.arrfil['skin0'] + '_';
            if (Emoji.arrfil['skin1'] !== '') template = template + Emoji.arrfil['skin1'] + '_';
            if (Emoji.arrfil['hair0'] !== '') template = template + Emoji.arrfil['hair0'] + '_';
            if (Emoji.arrfil['gender0'] !== '') template = template + Emoji.arrfil['gender0'] + '_';
            if (Emoji.arrfil['gender1'] !== '') template = template + Emoji.arrfil['gender1'] + '_';
            template = template.length > 0 ? template.slice(0, template.length - 1) : template;

            $('#group_people_body a').each((i, el) => {
              const $el = $(el);
              const curIcon = $el.html();

              if (!!!$el.data('icon')) {
                $el.data('icon', curIcon);
              }
              const oldIcon = $el.data('icon');
              if (template !== '') {
                var curFilters = template.split('_');
                curFilters.unshift(template);
                for(let j = 0; j < curFilters.length; j++){
                  var futureIcon = Emoji.mode[curFilters[j]][Emoji.EMOJI_LIST][oldIcon];
                  if (!!futureIcon && futureIcon!==curIcon) {
                    $el.data('filter',curFilters[j]);
                    $el.html(futureIcon);
                    break;
                  }else{
                    if(curFilters[0].indexOf($el.data('filter'))===-1){
                      $el.data('filter','');
                      $el.html(oldIcon);
                      break;
                    }
                  }
                }
              } else {
                $el.html(oldIcon);
                $el.data('filter','');
              }
            });
            e.preventDefault();
          });
          dropcont.append(a);
        }
        dropup.append(dropcont);
        filters.append(dropup);
      }
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
            .data('icon', emo)
            .html(emo)
            .attr('title',emojiobj.n)
            .on('click', () => {this.insertEmoji(emojiElem, this.o)});
 //         if (emojiElem.html().length>3){
 //           emojiElem.addClass('double');
 //         }
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
      this.cb(emoji.html(), options);
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
//        pickerLeft = -targetW;
        pickerLeft = 0;        //For demo page ONLY! URGENT!!
    }

    var toBottom =  winH - targetH - targetTop;
    if (toBottom<pickerH+32) {
       if (toBottom<pickerh+32) {
          pickerTop = - pickerh-(emojwrapOFF.top-targetTop)-30;
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
              height: options.heightSmall-32 + "px",
            });
    } else {
        $('.tab-pane').css({
          height: options.heightBig-32+"px",
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
