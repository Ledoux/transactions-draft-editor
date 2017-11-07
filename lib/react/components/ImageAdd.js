'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _transactionsInterfaceWeb = require('transactions-interface-web');

var _transactionsToolsIsomorphic = require('transactions-tools-isomorphic');

var _reactDebounceInput = require('react-debounce-input');

var _reactDebounceInput2 = _interopRequireDefault(_reactDebounceInput);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // from https://github.com/draft-js-plugins/draft-js-plugins/blob/c8261389407d128ef4edf669bed1186f161fbc0f/docs/client/components/pages/Image/AddImageEditor/ImageAdd/index.js


var ImageAdd = function (_Component) {
  _inherits(ImageAdd, _Component);

  function ImageAdd(props) {
    _classCallCheck(this, ImageAdd);

    var _this = _possibleConstructorReturn(this, (ImageAdd.__proto__ || Object.getPrototypeOf(ImageAdd)).call(this));

    _this.state = { isCompleteImage: false,
      isValidImage: false,
      src: props.src || '',
      value: ''
      // special image tool control
    };_this.onAddClick = _this._onAddClick.bind(_this);
    _this.onImageError = _this._onImageError.bind(_this);
    _this.onInputChange = _this._onInputChange.bind(_this);
    return _this;
  }

  _createClass(ImageAdd, [{
    key: '_onAddClick',
    value: function _onAddClick() {
      var _props = this.props,
          editorState = _props.editorState,
          onEditorChange = _props.onEditorChange,
          modifier = _props.modifier;
      var src = this.state.src;

      onEditorChange(modifier(editorState, src));
    }
  }, {
    key: '_onImageError',
    value: function _onImageError() {
      this.setState({ isCompleteImage: false });
    }
  }, {
    key: '_onInputChange',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref2) {
        var value = _ref2.target.value;

        var _props2, assetsPathTest, existsPath, imagePath, onInputChange, src, fetchUrl, result, json, isExistingUrl, isTypeValid;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // unpack
                _props2 = this.props, assetsPathTest = _props2.assetsPathTest, existsPath = _props2.existsPath, imagePath = _props2.imagePath, onInputChange = _props2.onInputChange;
                // update the input text

                this.setState({ value: value });
                // determine if it is a valid src
                src = void 0;

                if (_transactionsToolsIsomorphic.absoluteUrlTest.test(value)) {
                  src = value;
                } else if (assetsPathTest.test(value)) {
                  src = window.location.origin + '/' + value;
                }
                // return and reset validity

                if (src) {
                  _context.next = 7;
                  break;
                }

                this.setState({ isValidImage: false, src: null });
                return _context.abrupt('return');

              case 7:
                // fetch
                fetchUrl = existsPath + '?url=' + encodeURIComponent(src) + '&type=image';
                _context.next = 10;
                return fetch(fetchUrl, {
                  headers: { 'Content-Type': 'application/json' }
                });

              case 10:
                result = _context.sent;
                _context.next = 13;
                return result.json();

              case 13:
                json = _context.sent;

                // check
                isExistingUrl = json.isExistingUrl, isTypeValid = json.isTypeValid;

                if (isExistingUrl && isTypeValid) {
                  this.setState({ isValidImage: true, src: src });
                } else if (this.state.isValidImage) {
                  this.setState({ isValidImage: false, src: null });
                }
                // hook
                onInputChange && onInputChange(src);

              case 17:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _onInputChange(_x) {
        return _ref.apply(this, arguments);
      }

      return _onInputChange;
    }()
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this.state.isCompleteImage === false && this.imageElement.complete) {
        this.setState({ isCompleteImage: true });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var onAddClick = this.onAddClick,
          onImageError = this.onImageError,
          onInputChange = this.onInputChange;
      var _state = this.state,
          isCompleteImage = _state.isCompleteImage,
          isValidImage = _state.isValidImage,
          src = _state.src,
          value = _state.value;

      return _react2.default.createElement(
        'div',
        { className: 'image-add flex items-center' },
        _react2.default.createElement(
          'div',
          { className: 'image-add__src' },
          _react2.default.createElement(_reactDebounceInput2.default, { className: 'image-add__src__input',
            debounceTimeout: 500,
            onChange: onInputChange,
            placeholder: 'Paste the image src \u2026',
            type: 'text',
            value: value })
        ),
        _react2.default.createElement(
          _transactionsInterfaceWeb.Uploader,
          { className: 'uploader image-add__uploader',
            fileName: 'test',
            onUpload: function onUpload(json) {
              return json.url && _this2.setState({ src: json.url });
            } },
          _react2.default.createElement('img', { className: 'image-add__uploader__img',
            onError: onImageError,
            ref: function ref(element) {
              return _this2.imageElement = element;
            },
            src: src })
        ),
        isCompleteImage && _react2.default.createElement(
          _transactionsInterfaceWeb.Button,
          { className: (0, _classnames2.default)('button button--alive image-add__insert', {
              'image-add__insert--disabled': !isValidImage
            }),
            disabled: !isValidImage,
            icon: 'plus',
            onClick: function onClick(event) {
              event.preventDefault();
              onAddClick();
            },
            onMouseDown: function onMouseDown(event) {
              return event.preventDefault();
            } },
          'insert image'
        )
      );
    }
  }]);

  return ImageAdd;
}(_react.Component);

ImageAdd.defaultProps = {
  assetsPathTest: /\/static\/images\/(.*)/,
  existsPath: '/scrap/exists'
};

exports.default = ImageAdd;