import { convertFromHTML,
  ContentState
} from 'draft-js'

export const getContentStateFromHtml = html => {
  const blocksFromHTML = convertFromHTML(html)
  return ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap
  )
}

export const getRawFromText = (text, config) => {
  const eol = config.eol || '\n'
  return { entityMap: {},
    // when text is too big we prefer to jump lines
    // in order to decrease the size of the block
    blocks: text.split(eol).map((line, index) => {
      return {
        key: `${index}`,
        text: line,
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges:[],
        entityRanges: [],
        data: {}
      }
    })
  }
}

export function getIsEmptyContent (editorState) {
  // as we look for an html content
  // we need to determine if the content is actually empty or not
  const contentState =  editorState.getCurrentContent()
  const blockMap = contentState.getBlockMap()
  if (blockMap.size > 1) {
    const firstBlockKey = blockMap.keySeq().first()
    const firstBlock = blockMap.get(firstBlockKey)
    if (firstBlock.text.trim() === '') {
      return true
    }
  }
  return false
}

export function getAttribute (key, { divEditorElement, editorState }) {
  if (!getIsEmptyContent(editorState)) {
    return divEditorElement && divEditorElement[key]
  }
}
