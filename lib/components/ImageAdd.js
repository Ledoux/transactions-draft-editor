'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _transactionsInterfaceWeb = require('transactions-interface-web');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // from https://github.com/draft-js-plugins/draft-js-plugins/blob/c8261389407d128ef4edf669bed1186f161fbc0f/docs/client/components/pages/Image/AddImageEditor/ImageAdd/index.js


var ImageAdd = function (_Component) {
  _inherits(ImageAdd, _Component);

  function ImageAdd(props) {
    _classCallCheck(this, ImageAdd);

    var _this = _possibleConstructorReturn(this, (ImageAdd.__proto__ || Object.getPrototypeOf(ImageAdd)).call(this));

    _this.state = {
      isImage: false,
      url: props.url || ''
      // special image tool control
    };_this.onAddClick = _this._onAddClick.bind(_this);
    _this.onImageError = _this._onImageError.bind(_this);
    _this.onUrlChange = _this._onUrlChange.bind(_this);
    return _this;
  }

  _createClass(ImageAdd, [{
    key: '_onAddClick',
    value: function _onAddClick() {
      var _props = this.props,
          editorState = _props.editorState,
          onEditorChange = _props.onEditorChange,
          modifier = _props.modifier;
      var url = this.state.url;

      onEditorChange(modifier(editorState, url));
    }
  }, {
    key: '_onImageError',
    value: function _onImageError() {
      this.setState({ isImage: false });
    }
  }, {
    key: '_onUrlChange',
    value: function _onUrlChange(evt) {
      var onUrlChange = this.props.onUrlChange;

      this.setState({ url: evt.target.value });
      onUrlChange && onUrlChange();
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
      var _this2 = this;

      var onAddClick = this.onAddClick,
          onImageError = this.onImageError,
          onUrlChange = this.onUrlChange;
      var _state = this.state,
          isImage = _state.isImage,
          url = _state.url;

      return _react2.default.createElement(
        'div',
        { className: 'image-add' },
        _react2.default.createElement(
          'div',
          { className: 'image-add__url col' },
          _react2.default.createElement('input', {
            className: 'image-add__url__input',
            type: 'text',
            placeholder: 'Paste the image url \u2026',
            onChange: onUrlChange,
            value: url
          })
        ),
        _react2.default.createElement(
          _transactionsInterfaceWeb.Uploader,
          {
            className: 'uploader image-add__uploader col',
            fileName: 'test',
            onUpload: function onUpload(json) {
              return json.url && _this2.setState({ url: json.url });
            }
          },
          _react2.default.createElement('img', {
            className: 'image-add__uploader__img',
            onError: onImageError,
            ref: function ref(element) {
              return _this2.imageElement = element;
            },
            src: url
          })
        ),
        isImage && _react2.default.createElement(_transactionsInterfaceWeb.IconButton, {
          className: 'icon-button button--alive image-add__insert col',
          icon: 'plus',
          onClick: function onClick(event) {
            event.preventDefault();
            onAddClick();
          },
          onMouseDown: function onMouseDown(event) {
            return event.preventDefault();
          }
        })
      );
    }
  }]);

  return ImageAdd;
}(_react.Component);

exports.default = ImageAdd;