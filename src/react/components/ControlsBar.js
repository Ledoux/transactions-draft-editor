import classnames from 'classnames'
import { RichUtils } from 'draft-js'
import React, { Component } from 'react'
import { IconButton } from 'transactions-interface-web'

import ImageAdd from './ImageAdd'

class ControlsBar extends Component {
  constructor (props) {
    // super
    super(props)
    // state
    this.state = { isImage: true,
      src: props.initialSrc
    }
    // special inline tool controls
    this.onImageInputChange = this._onImageInputChange.bind(this)
    this.onToggleInlineStyleClick = this._onToggleInlineStyleClick.bind(this)
  }
  _onImageClick () {
    // thanks to https://stackoverflow.com/questions/41039315/how-to-properly-add-image-atomic-without-2-empty-lines-in-draft-js
    const { editorState, src } = this.props
    const contentState = editorState.getCurrentContent()
    const withEntityContentState = contentState.createEntity('image', 'IMMUTABLE', { src })
    const entityKey = withEntityContentState.getLastCreatedEntityKey()
    const withAtomicEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ')
    let newContentState = withAtomicEditorState.getCurrentContent()
    let newBlockMap = newContentState.getBlockMap()
    const currentAtomicBlock = newBlockMap.find(block => {
       if (block.getEntityAt(0) === entityKey) {
          return block
       }
    })
    const atomicBlockKey = currentAtomicBlock.getKey()
    const block_before = newContentState.getBlockBefore(atomicBlockKey).getKey()
    newBlockMap = newBlockMap.filter(block => {
       if ((block.getKey() !== block_before) ) {
          return block
       }
    })
    newContentState = contentState.set('blockMap', newBlockMap)
    const newEditorState = EditorState.createWithContent(newContentState)
    this.onEditorChange(newEditorState)
  }
  _onImageInputChange (event) {
    this.setState({ src: event.target.value })
  }
  _onToggleInlineStyleClick (string) {
    const { editorState,
      onEditorChange
    } = this.props
    const newEditorState = RichUtils.toggleInlineStyle(editorState, string)
    onEditorChange(newEditorState)
  }
  componentDidUpdate () {
    if (this.state.isImage === false && this.imageElement.complete) {
      this.setState({ isImage: true })
    }
  }
  render () {
    const { onImageInputChange,
      onToggleInlineStyleClick
    } = this
    const { editorState,
      imagePlugin,
      inlineStyleButtons,
      onEditorChange
    } = this.props
    const { src } = this.state
    const currentInlineStyleStrings = editorState.getCurrentInlineStyle()
    return (
      <div className='controls-bar'>
        <div className='controls-bar__inline col'>
          {
            inlineStyleButtons.map(({ icon, string }, index) => (
              <IconButton
                className={classnames('icon-button icon-button--no-text', {
                  'icon-button--no-text--clicked': currentInlineStyleStrings.has(string),
                  'icon-button--no-text--first': index === 0,
                  'icon-button--no-text--last': index === inlineStyleButtons.length - 1
                })}
                icon={icon}
                key={index}
                onClick={event => {
                  event.preventDefault()
                  onToggleInlineStyleClick(string)
                }}
                onMouseDown={ event => event.preventDefault() }
              />)
            )
          }
        </div>
        <div className='controls-bar__meta col'>
          <div className='controls-bar__meta__image'>
            <ImageAdd
              editorState={editorState}
              onEditorChange={onEditorChange}
              onUrlChange={onImageInputChange}
              modifier={imagePlugin.addImage}
              src={src}
            />
          </div>
        </div>
      </div>
    )
  }
}

ControlsBar.defaultProps = {
  inlineStyleButtons: [
    {
      icon: 'bold',
      string: 'BOLD'
    },
    {
      icon: 'italic',
      string: 'ITALIC'
    },
    {
      icon: 'chain',
      string: 'LINK'
    }
  ]
}

export default ControlsBar
