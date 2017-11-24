// from https://github.com/draft-js-plugins/draft-js-plugins/blob/c8261389407d128ef4edf669bed1186f161fbc0f/docs/client/components/pages/Image/AddImageEditor/ImageAdd/index.js
import classnames from 'classnames'
import React, { Component } from 'react'
import { Button,
  Uploader
} from 'transactions-interface-web'
import { absoluteUrlTest } from 'transactions-tools-isomorphic'
import DebounceInput from 'react-debounce-input'

class ImageAdd extends Component {
  constructor (props) {
    super()
    this.state = { isCompleteImage: false,
      isValidImage: false,
      src: props.src || '',
      value: ''
    }
    // special image tool control
    this.onAddClick = this._onAddClick.bind(this)
    this.onImageError = this._onImageError.bind(this)
    this.onInputChange = this._onInputChange.bind(this)
  }
  _onAddClick () {
    const { editorState,
      onEditorChange,
      modifier
    } = this.props
    const { src } = this.state
    onEditorChange(modifier(editorState, src))
  }
  _onImageError () {
    this.setState({ isCompleteImage: false })
  }
  async _onInputChange ({ target: { value } }) {
    // unpack
    const { assetsPathTest,
      existsPath,
      imagePath,
      onInputChange
    } = this.props
    // update the input text
    this.setState({ value })
    // determine if it is a valid src
    let src
    if (absoluteUrlTest.test(value)) {
      src = value
    } else if (assetsPathTest.test(value)) {
      src = `${window.location.origin}/${value}`
    }
    // return and reset validity
    if (!src) {
      this.setState({ isValidImage: false, src: null })
      return
    }
    // fetch
    const fetchUrl = `${existsPath}?url=${encodeURIComponent(src)}&type=image`
    const result = await fetch(fetchUrl, {
      headers: { 'Content-Type': 'application/json' }
    })
    const json = await result.json()
    // check
    const { isExistingUrl, isTypeValid } = json
    if (isExistingUrl && isTypeValid) {
      this.setState({ isValidImage: true, src })
    } else if (this.state.isValidImage) {
      this.setState({ isValidImage: false, src: null })
    }
    // hook
    onInputChange && onInputChange(src)
  }
  componentDidUpdate () {
    if (this.state.isCompleteImage === false && this.imageElement.complete) {
      this.setState({ isCompleteImage: true })
    }
  }
  render() {
    const { onAddClick,
      onImageError,
      onInputChange
    } = this
    const { isCompleteImage,
      isValidImage,
      src,
      value
    } = this.state
    return (
      <div className='image-add flex items-center'>
        <div className='image-add__src'>
          <DebounceInput className='image-add__src__input'
            debounceTimeout={500}
            onChange={onInputChange}
            placeholder='Paste the image src …'
            type='text'
            value={value} />
        </div>
        <Uploader className='uploader image-add__uploader'
          onUpload={json => json.url && this.setState({
            isValidImage: true, 
            src: json.url
          })}>
          <img className='image-add__uploader__img'
            onError={onImageError}
            ref={ element => this.imageElement = element }
            src={src} />
        </Uploader>
        {
          isCompleteImage && (
            <Button className={classnames(
                'button button--alive image-add__insert', {
                  'image-add__insert--disabled': !isValidImage
                })}
              disabled={!isValidImage}
              icon='plus'
              onClick={event => {
                event.preventDefault()
                onAddClick()
              }}
              onMouseDown={ event => event.preventDefault() }>
              insert image
            </Button>
          )
        }
      </div>
    )
  }
}

ImageAdd.defaultProps = {
  assetsPathTest: /\/static\/images\/(.*)/,
  existsPath: '/scrap/exists'
}

export default ImageAdd
