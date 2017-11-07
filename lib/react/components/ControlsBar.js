'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _draftJs = require('draft-js');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _transactionsInterfaceWeb = require('transactions-interface-web');

var _ImageAdd = require('./ImageAdd');

var _ImageAdd2 = _interopRequireDefault(_ImageAdd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ControlsBar = function (_Component) {
  _inherits(ControlsBar, _Component);

  function ControlsBar(props) {
    _classCallCheck(this, ControlsBar);

    // state
    var _this = _possibleConstructorReturn(this, (ControlsBar.__proto__ || Object.getPrototypeOf(ControlsBar)).call(this, props));
    // super


    _this.state = { isImage: true,
      src: props.initialSrc
      // special inline tool controls
    };_this.onImageInputChange = _this._onImageInputChange.bind(_this);
    _this.onToggleInlineStyleClick = _this._onToggleInlineStyleClick.bind(_this);
    return _this;
  }

  _createClass(ControlsBar, [{
    key: '_onImageClick',
    value: function _onImageClick() {
      // thanks to https://stackoverflow.com/questions/41039315/how-to-properly-add-image-atomic-without-2-empty-lines-in-draft-js
      var _props = this.props,
          editorState = _props.editorState,
          onEditorChange = _props.onEditorChange,
          src = _props.src;

      var contentState = editorState.getCurrentContent();
      var withEntityContentState = contentState.createEntity('image', 'IMMUTABLE', { src: src });
      var entityKey = withEntityContentState.getLastCreatedEntityKey();
      var withAtomicEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
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
      var newEditorState = EditorState.createWithContent(newContentState);
      onEditorChange(newEditorState);
    }
  }, {
    key: '_onImageInputChange',
    value: function _onImageInputChange(src) {
      this.setState({ src: src });
    }
  }, {
    key: '_onToggleInlineStyleClick',
    value: function _onToggleInlineStyleClick(string) {
      var _props2 = this.props,
          editorState = _props2.editorState,
          onEditorChange = _props2.onEditorChange;

      var newEditorState = _draftJs.RichUtils.toggleInlineStyle(editorState, string);
      onEditorChange(newEditorState);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this.state.isImage === false && this.imageElement.complete) {
        this.setState({ isImage: true });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var onImageInputChange = this.onImageInputChange,
          onToggleInlineStyleClick = this.onToggleInlineStyleClick;
      var _props3 = this.props,
          assetsPathTest = _props3.assetsPathTest,
          existsPath = _props3.existsPath,
          editorState = _props3.editorState,
          imagePlugin = _props3.imagePlugin,
          inlineStyleButtons = _props3.inlineStyleButtons,
          onEditorChange = _props3.onEditorChange;
      var src = this.state.src;

      var currentInlineStyleStrings = editorState.getCurrentInlineStyle();
      return _react2.default.createElement(
        'div',
        { className: 'controls-bar flex items-center' },
        _react2.default.createElement(
          'div',
          { className: 'controls-bar__inline mr1' },
          inlineStyleButtons.map(function (_ref, index) {
            var icon = _ref.icon,
                string = _ref.string;
            return _react2.default.createElement(_transactionsInterfaceWeb.IconButton, { className: (0, _classnames2.default)('icon-button icon-button--no-text', {
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
              } });
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'controls-bar__meta' },
          _react2.default.createElement(
            'div',
            { className: 'controls-bar__meta__image' },
            _react2.default.createElement(_ImageAdd2.default, { assetsPathTest: assetsPathTest,
              existsPath: existsPath,
              editorState: editorState,
              onEditorChange: onEditorChange,
              onInputChange: onImageInputChange,
              modifier: imagePlugin.addImage,
              src: src })
          )
        )
      );
    }
  }]);

  return ControlsBar;
}(_react.Component);

ControlsBar.defaultProps = {
  inlineStyleButtons: [{
    icon: 'bold',
    string: 'BOLD'
  }, {
    icon: 'italic',
    string: 'ITALIC'
  }]
};

exports.default = ControlsBar;