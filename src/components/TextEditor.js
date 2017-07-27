// https://www.draft-js-plugins.com/plugin/image
import classnames from 'classnames'
import { AtomicBlockUtils,
  convertFromHTML,
  convertFromRaw,
  ContentState,
  EditorState,
  RichUtils
} from 'draft-js'
import createAlignmentPlugin from 'draft-js-alignment-plugin'
import createFocusPlugin from 'draft-js-focus-plugin'
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin'
import createImagePlugin from 'draft-js-image-plugin'
import createMathjaxPlugin from 'draft-js-mathjax-plugin'
import createResizeablePlugin from 'draft-js-resizeable-plugin'
import Editor, { composeDecorators } from 'draft-js-plugins-editor'
import 'draft-js-focus-plugin/lib/plugin.css'
import 'draft-js-image-plugin/lib/plugin.css'
import 'draft-js-alignment-plugin/lib/plugin.css'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Button
  IconButton
  ImageAdd,
  Uploader
} from 'transactions-interface-web'

const focusPlugin = createFocusPlugin()
const resizeablePlugin = createResizeablePlugin()
const alignmentPlugin = createAlignmentPlugin()
const { AlignmentTool } = alignmentPlugin
const blockDndPlugin = createBlockDndPlugin()
const imageDecorator = composeDecorators(
  resizeablePlugin.decorator,
  alignmentPlugin.decorator,
  focusPlugin.decorator,
  blockDndPlugin.decorator
)
const imagePlugin = createImagePlugin({ decorator: imageDecorator })
const plugins = [
  blockDndPlugin,
  focusPlugin,
  alignmentPlugin,
  resizeablePlugin,
  imagePlugin,
  null
]

const inlineStyleButtons = [
  {
    icon: 'bold',
    string: 'BOLD'
  },
  {
    icon: 'italic',
    string: 'ITALIC'
  },
  {
    icon: 'italic',
    string: 'LINK'
  }
]

const getContentStateFromHtml = html => {
  const blocksFromHTML = convertFromHTML(html)
  return ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap
  )
}

class TextEditor extends Component {
  constructor(props) {
    // super
    super(props)
    // unpack
    const { initialRaw,
      initialHtml
    } = props
    // editorSatte
    const editorState = (initialRaw || initialHtml)
    ? EditorState.createWithContent(
      initialRaw
      ? convertFromRaw(
        typeof initialRaw === 'string'
        ? JSON.parse(initialRaw)
        : initialRaw
      )
      : getContentStateFromHtml(initialHtml)
    )
    : EditorState.createEmpty()
    // state
    this.state = {
      editorScrollTop: null,
      editorState,
      isImage: true,
      src: props.initialSrc
    }
    // style
    this.blockStyleFn = this._blockStyleFn.bind(this)
    // plugin focus
    this.onFocusClick = this._onFocusClick.bind(this)
    // special inline tool controls
    this.onToggleInlineStyleClick = this._onToggleInlineStyleClick.bind(this)
    // global editor change
    this.onEditorChange = this._onEditorChange.bind(this)
  }
  componentWillMount () {
    // FIX OF THE MATHJAX PLUGINS LIBRARY
    // THAT ACTUALLY CANNOT REBOOT TWICE
    // SO WE NEED TO REINITIALIZE IT
    plugins[plugins.length - 1] = createMathjaxPlugin()
  }
  componentDidMount () {
    // special listener because by default
    // if the div containing the editor is set with overflow-y equal to scroll
    // a split-block event (by pressing enter) will automatically
    // scroll the editor to the bottom of the element
    // which is annoying when we just want to add more lines
    // in a middle block
    this.scrollListener = this.divEditorElement.addEventListener('scroll', e => {
      const { editorScrollTop } = this.state
      if (editorScrollTop === 0 || editorScrollTop) {
        this.divEditorElement.scrollTo(0, editorScrollTop)
        this.setState({ editorScrollTop: null })
      }
    })
  }
  _blockStyleFn (contentBlock) {
    const type = this.props.type || contentBlock.getType()
    return `text-editor__content__${type}`
  }
  _onFocusClick () {
    this.editorElement.focus()
  }
  _onImageClick () {
    // thanks to https://stackoverflow.com/questions/41039315/how-to-properly-add-image-atomic-without-2-empty-lines-in-draft-js
    const { editorState, src } = this.state
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
    const { editorState } = this.state
    const newEditorState = RichUtils.toggleInlineStyle(editorState, string)
    this.onEditorChange(newEditorState)
  }
  _onEditorChange (editorState) {
    const { onChange } = this.props
    // check for split-block event to not automatically scroll down
    const newState = { editorState }
    if (editorState.getLastChangeType() === 'split-block') {
      newState.editorScrollTop = this.divEditorElement && this.divEditorElement.scrollTop
    }
    // classic editor state update
    this.setState(newState)
    // hook for parent change
    onChange && onChange({
      divEditorElement: this.divEditorElement,
      editorElement: this.editorElement,
      editorState
    })
  }
  componentDidUpdate () {
    if (this.state.isImage === false && this.imageElement.complete) {
      this.setState({ isImage: true })
    }
  }
  componentWillUnmount () {
    this.divEditorElement && this.divEditorElement.removeEventListener('scroll', this.scrollListener)
  }
  render() {
    const { blockStyleFn,
      onFocusClick,
      onToggleInlineStyleClick,
      onEditorChange,
      onImageClick,
      onImageError,
      onImageInputChange
    } = this
    const { placeholder } = this.props
    const { editorState,
      isImage,
      src
    } = this.state
    const currentInlineStyleStrings = editorState.getCurrentInlineStyle()
    return (<div className='text-editor'>
      <div className='text-editor__control'>
        <div className='text-editor__control__inline col'>
          {
            inlineStyleButtons.map(({ icon, string }, index) => <IconButton
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
          }
        </div>
        <div className='text-editor__control__meta col'>
          <div className='text-editor__control__meta__image'>
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
      <div
        className='text-editor__content'
        itemProp='reviewBody'
        onClick={onFocusClick}
        ref={ element => this.divEditorElement = element }
      >
        <Editor
          blockStyleFn={blockStyleFn}
          editorState={editorState}
          onChange={onEditorChange}
          placeholder={placeholder}
          plugins={plugins}
          ref={ element => { this.editorElement = element }}
        />
       { plugins.includes(alignmentPlugin) && <AlignmentTool /> }
      </div>
    </div>)
  }
}

export default TextEditor
