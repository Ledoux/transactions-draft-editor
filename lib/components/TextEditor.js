'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _draftJs = require('draft-js');

var _draftJsAlignmentPlugin = require('draft-js-alignment-plugin');

var _draftJsAlignmentPlugin2 = _interopRequireDefault(_draftJsAlignmentPlugin);

var _draftJsFocusPlugin = require('draft-js-focus-plugin');

var _draftJsFocusPlugin2 = _interopRequireDefault(_draftJsFocusPlugin);

var _draftJsDragNDropPlugin = require('draft-js-drag-n-drop-plugin');

var _draftJsDragNDropPlugin2 = _interopRequireDefault(_draftJsDragNDropPlugin);

var _draftJsImagePlugin = require('draft-js-image-plugin');

var _draftJsImagePlugin2 = _interopRequireDefault(_draftJsImagePlugin);

var _draftJsMathjaxPlugin = require('draft-js-mathjax-plugin');

var _draftJsMathjaxPlugin2 = _interopRequireDefault(_draftJsMathjaxPlugin);

var _draftJsResizeablePlugin = require('draft-js-resizeable-plugin');

var _draftJsResizeablePlugin2 = _interopRequireDefault(_draftJsResizeablePlugin);

var _draftJsPluginsEditor = require('draft-js-plugins-editor');

var _draftJsPluginsEditor2 = _interopRequireDefault(_draftJsPluginsEditor);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _transactionsInterfaceWeb = require('transactions-interface-web');

var _ImageAdd = require('./ImageAdd');

var _ImageAdd2 = _interopRequireDefault(_ImageAdd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // https://www.draft-js-plugins.com/plugin/image


var focusPlugin = (0, _draftJsFocusPlugin2.default)();
var resizeablePlugin = (0, _draftJsResizeablePlugin2.default)();
var alignmentPlugin = (0, _draftJsAlignmentPlugin2.default)();
var AlignmentTool = alignmentPlugin.AlignmentTool;

var blockDndPlugin = (0, _draftJsDragNDropPlugin2.default)();
var imageDecorator = (0, _draftJsPluginsEditor.composeDecorators)(resizeablePlugin.decorator, alignmentPlugin.decorator, focusPlugin.decorator, blockDndPlugin.decorator);
var imagePlugin = (0, _draftJsImagePlugin2.default)({ decorator: imageDecorator });
var plugins = [blockDndPlugin, focusPlugin, alignmentPlugin, resizeablePlugin, imagePlugin, null];

var inlineStyleButtons = [{
  icon: 'bold',
  string: 'BOLD'
}, {
  icon: 'italic',
  string: 'ITALIC'
}, {
  icon: 'chain',
  string: 'LINK'
}];

var getContentStateFromHtml = function getContentStateFromHtml(html) {
  var blocksFromHTML = (0, _draftJs.convertFromHTML)(html);
  return _draftJs.ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
};

var TextEditor = function (_Component) {
  _inherits(TextEditor, _Component);

  function TextEditor(props) {
    _classCallCheck(this, TextEditor);

    // unpack
    var _this = _possibleConstructorReturn(this, (TextEditor.__proto__ || Object.getPrototypeOf(TextEditor)).call(this, props));
    // super


    var initialRaw = props.initialRaw,
        initialHtml = props.initialHtml;
    // editorSatte

    var editorState = initialRaw || initialHtml ? _draftJs.EditorState.createWithContent(initialRaw ? (0, _draftJs.convertFromRaw)(typeof initialRaw === 'string' ? JSON.parse(initialRaw) : initialRaw) : getContentStateFromHtml(initialHtml)) : _draftJs.EditorState.createEmpty();
    // state
    _this.state = {
      editorScrollTop: null,
      editorState: editorState,
      isImage: true,
      src: props.initialSrc
      // style
    };_this.blockStyleFn = _this._blockStyleFn.bind(_this);
    // plugin focus
    _this.onFocusClick = _this._onFocusClick.bind(_this);
    // special inline tool controls
    _this.onToggleInlineStyleClick = _this._onToggleInlineStyleClick.bind(_this);
    // global editor change
    _this.onEditorChange = _this._onEditorChange.bind(_this);
    return _this;
  }

  _createClass(TextEditor, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      // FIX OF THE MATHJAX PLUGINS LIBRARY
      // THAT ACTUALLY CANNOT REBOOT TWICE
      // SO WE NEED TO REINITIALIZE IT
      plugins[plugins.length - 1] = (0, _draftJsMathjaxPlugin2.default)();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      // special listener because by default
      // if the div containing the editor is set with overflow-y equal to scroll
      // a split-block event (by pressing enter) will automatically
      // scroll the editor to the bottom of the element
      // which is annoying when we just want to add more lines
      // in a middle block
      this.scrollListener = this.divEditorElement.addEventListener('scroll', function (e) {
        var editorScrollTop = _this2.state.editorScrollTop;

        if (editorScrollTop === 0 || editorScrollTop) {
          _this2.divEditorElement.scrollTo(0, editorScrollTop);
          _this2.setState({ editorScrollTop: null });
        }
      });
      console.log('lll', this._e);
      console.log('AlignmentTool', AlignmentTool);
    }
  }, {
    key: '_blockStyleFn',
    value: function _blockStyleFn(contentBlock) {
      var type = this.props.type || contentBlock.getType();
      return 'text-editor__content__' + type;
    }
  }, {
    key: '_onFocusClick',
    value: function _onFocusClick() {
      this.editorElement.focus();
    }
  }, {
    key: '_onImageClick',
    value: function _onImageClick() {
      // thanks to https://stackoverflow.com/questions/41039315/how-to-properly-add-image-atomic-without-2-empty-lines-in-draft-js
      var _state = this.state,
          editorState = _state.editorState,
          src = _state.src;

      var contentState = editorState.getCurrentContent();
      var withEntityContentState = contentState.createEntity('image', 'IMMUTABLE', { src: src });
      var entityKey = withEntityContentState.getLastCreatedEntityKey();
      var withAtomicEditorState = _draftJs.AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
      var newContentState = withAtomicEditorState.getCurrentContent();
      var newBlockMap = newContentState.getBlockMap();
      var currentAtomicBlock = newBlockMap.find(function (block) {
        if (block.getEntityAt(0) === entityKey) {
          return block;
        }
      });
      var atomicBlockKey = currentAtomicBlock.getKey();
      var block_before = newContentState.getBlockBefore(atomicBlockKey).getKey();
      newBlockMap = newBlockMap.filter(function (block) {
        if (block.getKey() !== block_before) {
          return block;
        }
      });
      newContentState = contentState.set('blockMap', newBlockMap);
      var newEditorState = _draftJs.EditorState.createWithContent(newContentState);
      this.onEditorChange(newEditorState);
    }
  }, {
    key: '_onImageInputChange',
    value: function _onImageInputChange(event) {
      this.setState({ src: event.target.value });
    }
  }, {
    key: '_onToggleInlineStyleClick',
    value: function _onToggleInlineStyleClick(string) {
      var editorState = this.state.editorState;

      var newEditorState = _draftJs.RichUtils.toggleInlineStyle(editorState, string);
      this.onEditorChange(newEditorState);
    }
  }, {
    key: '_onEditorChange',
    value: function _onEditorChange(editorState) {
      var onChange = this.props.onChange;
      // check for split-block event to not automatically scroll down

      var newState = { editorState: editorState };
      if (editorState.getLastChangeType() === 'split-block') {
        newState.editorScrollTop = this.divEditorElement && this.divEditorElement.scrollTop;
      }
      // classic editor state update
      this.setState(newState);
      // hook for parent change
      onChange && onChange({
        divEditorElement: this.divEditorElement,
        editorElement: this.editorElement,
        editorState: editorState
      });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this.state.isImage === false && this.imageElement.complete) {
        this.setState({ isImage: true });
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.divEditorElement && this.divEditorElement.removeEventListener('scroll', this.scrollListener);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var blockStyleFn = this.blockStyleFn,
          onFocusClick = this.onFocusClick,
          onToggleInlineStyleClick = this.onToggleInlineStyleClick,
          onEditorChange = this.onEditorChange,
          onImageClick = this.onImageClick,
          onImageError = this.onImageError,
          onImageInputChange = this.onImageInputChange;
      var placeholder = this.props.placeholder;
      var _state2 = this.state,
          editorState = _state2.editorState,
          isImage = _state2.isImage,
          src = _state2.src;

      var currentInlineStyleStrings = editorState.getCurrentInlineStyle();
      return _react2.default.createElement(
        'div',
        { className: 'text-editor' },
        _react2.default.createElement(
          'div',
          { className: 'text-editor__control' },
          _react2.default.createElement(
            'div',
            { className: 'text-editor__control__inline col' },
            inlineStyleButtons.map(function (_ref, index) {
              var icon = _ref.icon,
                  string = _ref.string;
              return _react2.default.createElement(_transactionsInterfaceWeb.IconButton, {
                className: (0, _classnames2.default)('icon-button icon-button--no-text', {
                  'icon-button--no-text--clicked': currentInlineStyleStrings.has(string),
                  'icon-button--no-text--first': index === 0,
                  'icon-button--no-text--last': index === inlineStyleButtons.length - 1
                }),
                icon: icon,
                key: index,
                onClick: function onClick(event) {
                  event.preventDefault();
                  onToggleInlineStyleClick(string);
                },
                onMouseDown: function onMouseDown(event) {
                  return event.preventDefault();
                }
              });
            })
          ),
          _react2.default.createElement(
            'div',
            { className: 'text-editor__control__meta col' },
            _react2.default.createElement(
              'div',
              { className: 'text-editor__control__meta__image' },
              _react2.default.createElement(_ImageAdd2.default, {
                editorState: editorState,
                onEditorChange: onEditorChange,
                onUrlChange: onImageInputChange,
                modifier: imagePlugin.addImage,
                src: src
              })
            )
          )
        ),
        _react2.default.createElement(
          'div',
          {
            className: 'text-editor__content',
            itemProp: 'reviewBody',
            onClick: onFocusClick,
            ref: function ref(element) {
              return _this3.divEditorElement = element;
            }
          },
          _react2.default.createElement(_draftJsPluginsEditor2.default, {
            blockStyleFn: blockStyleFn,
            editorState: editorState,
            onChange: onEditorChange,
            placeholder: placeholder,
            plugins: plugins,
            ref: function ref(element) {
              _this3.editorElement = element;
            }
          }),
          plugins.includes(alignmentPlugin) && _react2.default.createElement(AlignmentTool, { ref: function ref(_e) {
              _this3._e = _e;
            }, testa: 'ee' })
        )
      );
    }
  }]);

  return TextEditor;
}(_react.Component);

exports.default = TextEditor;