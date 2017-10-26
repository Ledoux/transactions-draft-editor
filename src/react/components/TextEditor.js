// https://www.draft-js-plugins.com/plugin/image
import classnames from 'classnames'
import { convertFromRaw,
  ContentState,
  EditorState
} from 'draft-js'
import createAlignmentPlugin from 'draft-js-alignment-plugin'
import createFocusPlugin from 'draft-js-focus-plugin'
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin'
import createImagePlugin from 'draft-js-image-plugin'
import createMathjaxPlugin from 'draft-js-mathjax-plugin'
import createResizeablePlugin from 'draft-js-resizeable-plugin'
import Editor, { composeDecorators } from 'draft-js-plugins-editor'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Button } from 'transactions-interface-web'

import ControlsBar from './ControlsBar'
import { getContentStateFromHtml,
  getEmptyRaw
} from '../../utils'

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

class TextEditor extends Component {
  constructor(props) {
    // super
    super(props)
    // unpack
    const { initialRaw,
      initialHtml
    } = props
    // editorState
    let contentState
    if (initialHtml) {
      contentState = getContentStateFromHtml(initialHtml)
    } else if (initialRaw) {
      contentState = convertFromRaw(
        typeof initialRaw === 'string'
        ? JSON.parse(initialRaw)
        : initialRaw
      )
    }
    const editorState = contentState
    ? EditorState.createWithContent(contentState)
    : EditorState.createEmpty()
    // state
    this.state = { editorScrollTop: null,
      editorState
    }
    // style
    this.blockStyleFn = this._blockStyleFn.bind(this)
    // plugin focus
    this.onFocusClick = this._onFocusClick.bind(this)
    // global editor change
    this.onChange = this._onChange.bind(this)
  }
  componentWillMount () {
    if (this.props.isMathjax) {
      // FIX OF THE MATHJAX PLUGINS LIBRARY
      // THAT ACTUALLY CANNOT REBOOT TWICE
      // SO WE NEED TO REINITIALIZE IT
      plugins[plugins.length - 1] = createMathjaxPlugin()
    }
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
  componentDidUpdate (prevProps, prevState) {
    const { onCurrentContentChange,
      onEditorStateChange
    } = this.props
    const { editorState } = this.state
    // hook for parent change only when it has updated because of the editor state
    if (editorState !== prevState.editorState && this._lastChangeType) {
      // prepare the payload
      const newChange = { divEditorElement: this.divEditorElement,
        editorElement: this.editorElement,
        editorState
      }
      // hook for global editor state change (ie current content change +  selection)
      onEditorStateChange && onEditorStateChange(newChange)
      if (editorState.getCurrentContent() !== prevState.editorState.getCurrentContent()) {
        // hook for only current content change
        onCurrentContentChange && onCurrentContentChange(newChange)
      }
      // reset
      this._lastChangeType = null
    }
  }
  _blockStyleFn (contentBlock) {
    const type = this.props.type || contentBlock.getType()
    return `text-editor__content__${type}`
  }
  _onFocusClick () {
    this.editorElement.focus()
  }
  _onChange (editorState) {
    // check for split-block event to not automatically scroll down
    const newState = { editorState }
    const lastChangeType = editorState.getLastChangeType()
    if (lastChangeType === 'split-block') {
      newState.editorScrollTop = this.divEditorElement && this.divEditorElement.scrollTop
    }
    // classic editor state update
    this._lastChangeType = lastChangeType
    this.setState(newState)
  }
  componentWillUnmount () {
    this.divEditorElement && this.divEditorElement.removeEventListener('scroll', this.scrollListener)
  }
  render() {
    const { blockStyleFn,
      onChange,
      onFocusClick,
    } = this
    const { className,
      isControl,
      isScroll,
      placeholder
    } = this.props
    const { editorState } = this.state
    return (
      <div className={className || 'text-editor'}>
        {
          isControl && <ControlsBar editorState={editorState}
            imagePlugin={imagePlugin}
            onChange={onChange}
          />
        }
        <div className={classnames('text-editor__content', {
              'text-editor__content': isScroll
            })}
          itemProp='reviewBody'
          onClick={onFocusClick}
          ref={ element => this.divEditorElement = element }
        >
          <Editor blockStyleFn={blockStyleFn}
            editorState={editorState}
            onChange={onChange}
            placeholder={placeholder}
            plugins={plugins.filter(plugin => plugin)}
            ref={ element => { this.editorElement = element }}
          />
          {
            plugins.includes(alignmentPlugin) && <AlignmentTool />
          }
        </div>
      </div>
    )
  }
}

TextEditor.defaultProps = { isControl: true,
  isMathjax: false
}

export default TextEditor
