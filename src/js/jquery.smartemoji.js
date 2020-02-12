/**
 * This is the entry point for the library
 *
 * @author Wolfgang Stöttinger
 */

import $ from 'jquery';
import generatePlugin from './generate-plugin';
import EmojiArea from 'EmojiArea';

generatePlugin('smartemoji', EmojiArea);

/**
 * call auto initialization.
 */
$(() => {
  //noinspection JSUnresolvedFunction
  $('[data-emojiarea]').smartemoji();
});
