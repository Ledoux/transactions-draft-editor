'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRawFromText = exports.getContentStateFromHtml = undefined;
exports.getIsEmptyContent = getIsEmptyContent;
exports.getAttribute = getAttribute;

var _draftJs = require('draft-js');

var getContentStateFromHtml = exports.getContentStateFromHtml = function getContentStateFromHtml(html) {
  var blocksFromHTML = (0, _draftJs.convertFromHTML)(html);
  return _draftJs.ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
};

var getRawFromText = exports.getRawFromText = function getRawFromText(text) {
  return { entityMap: {},
    // when text is too big we prefer to jump lines
    // in order to decrease the size of the block
    blocks: text.split('\n').map(function (line, index) {
      return {
        key: '' + index,
        text: line,
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {}
      };
    })
  };
};

function getIsEmptyContent(editorState) {
  // as we look for an html content
  // we need to determine if the content is actually empty or not
  var contentState = editorState.getCurrentContent();
  var blockMap = contentState.getBlockMap();
  if (blockMap.size > 1) {
    var firstBlockKey = blockMap.keySeq().first();
    var firstBlock = blockMap.get(firstBlockKey);
    if (firstBlock.text.trim() === '') {
      return true;
    }
  }
  return false;
}

function getAttribute(key, _ref) {
  var divEditorElement = _ref.divEditorElement,
      editorState = _ref.editorState;

  if (!getIsEmptyContent(editorState)) {
    return divEditorElement && divEditorElement[key];
  }
}