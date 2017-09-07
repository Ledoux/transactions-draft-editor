'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getContentStateFromHtml = undefined;

var _draftJs = require('draft-js');

var getContentStateFromHtml = exports.getContentStateFromHtml = function getContentStateFromHtml(html) {
  var blocksFromHTML = (0, _draftJs.convertFromHTML)(html);
  return _draftJs.ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
};