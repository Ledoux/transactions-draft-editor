// from https://github.com/draft-js-plugins/draft-js-plugins/blob/c8261389407d128ef4edf669bed1186f161fbc0f/docs/client/components/pages/Image/AddImageEditor/ImageAdd/index.js
import React, { Component } from 'react'
import { IconButton,
  Uploader
} from 'transactions-interface-web'

class ImageAdd extends Component {
  constructor (props) {
    super()
    this.state = {
      isImage: false,
      url: props.url || ''
    }
    // special image tool control
    this.onAddClick = this._onAddClick.bind(this)
    this.onImageError = this._onImageError.bind(this)
    this.onUrlChange = this._onUrlChange.bind(this)
  }
  _onAddClick () {
    const { editorState,
      onEditorChange,
      modifier
    } = this.props
    const { url } = this.state
    onEditorChange(modifier(editorState, url))
  }
  _onImageError () {
    this.setState({ isImage: false })
  }
  _onUrlChange (evt) {
    const { onUrlChange } = this.props
    this.setState({ url: evt.target.value })
    onUrlChange && onUrlChange()
  }
  componentDidUpdate () {
    if (this.state.isImage === false && this.imageElement.complete) {
      this.setState({ isImage: true })
    }
  }
  render() {
    const { onAddClick,
      onImageError,
      onUrlChange
    } = this
    const { isImage,
      url
    } = this.state
    return (<div className='image-add'>
      <div className='image-add__url col'>
        <input
          className='image-add__url__input'
          type='text'
          placeholder='Paste the image url …'
          onChange={onUrlChange}
          value={url}
        />
      </div>
      <Uploader
        className='uploader image-add__uploader col'
        fileName='test'
        onUpload={json => json.url && this.setState({ url: json.url })}
      >
        <img
          className='image-add__uploader__img'
          onError={onImageError}
          ref={ element => this.imageElement = element }
          src={url}
        />
      </Uploader>
      {
        isImage && (<IconButton
          className='icon-button button--alive image-add__insert col'
          icon='plus'
          onClick={event => {
            event.preventDefault()
            onAddClick()
          }}
          onMouseDown={ event => event.preventDefault() }
        />)
      }
    </div>)
  }
}

export default ImageAdd
