# SmartEmoji JS

This is a client-side jquery plugin on the SmartEmoji that adds emoji support to textareas and features an emoji picker
to insert emoji directly into the textarea.

**Emoji data sources are available in the project [SmartEmoji.php](https://github.com/nothrem/SmartEmoji.php).**
You can either download the `data/*.json` files from there or install the whole project and use it to update the sources.

This plugin is based on [EmojiArea by Wolfgang Stöttinger](https://github.com/wstoettinger/jquery.emojiarea.js),
library [emoji-picker by OneSignal](https://github.com/OneSignal/emoji-picker)
and [emojiarea by DIY co](https://github.com/diy/jquery-emojiarea).
It has been rewritten from scratch by Wolfgang Stöttinger with easy usability from the developer perspective in mind.

## Installation

```
npm i --save SmartEmoji.jquery.js
```

### Versatile usage
Plugin allows users to insert unicode (UTF8-encoded) emoji into selected textareas.

Note: plugin uses updated emoji data sources generated from provided data sheets from UNICODE org.
For that reason only unicode mode is supported. Other modes (images, CSS placeholders, colon aliases, etc.) are not
supported. Server and/or database must fully support UNICODE (aka UTF8MB4) to process and save all emoji.

### Features in development
 - load data files from SmartEmoji.php project via AJAX (as a replacement for hard-coded data file from EmojiArea)
 - display group and emoji names in selected language
 - search emoji based on nationalized names and keywords
 - remember recent and favorite emoji in separate group

### Known Bugs/Todos
 - fix caret position after paste and/or insert
