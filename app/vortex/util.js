'use stricts'
const path = require('path')
const locale = require('./locale.js')

function renderMathsExpression (katex, expr) {
  if (expr[0] === '$' && expr[expr.length - 1] === '$') {
    let displayStyle = false
    expr = expr.substr(1, expr.length - 2)
    if (expr[0] === '$' && expr[expr.length - 1] === '$') {
      displayStyle = true
      expr = expr.substr(1, expr.length - 2)
    }
    let html = null
    try {
      html = katex.renderToString(expr)
    } catch (e) {
      console.error(e)
    }
    if (displayStyle && html) {
      html = html.replace(/class="katex"/g, 'class="katex katex-block" style="display: block;"')
    }
    return html
  } else {
    return null
  }
}

module.exports = {
  fileNameToTitle: (fileName) => {
    if (!fileName) return locale.AppName
    const fileInfo = path.parse(fileName)
    fileName = fileInfo.base
    if (fileInfo.dir) {
      fileName = fileName + ' - ' + fileInfo.dir + locale.TitleSuffix
    } else {
      fileName = fileName + locale.TitleSuffix
    }
    return fileName
  },
  titleToFileName: (title) => {
    if (!title) return
    if (title.startsWith('* ')) {
      title = title.substr(2)
    }
    if (title === locale.Untitled) return
    const titleInfo = title.split(' - ')
    console.log(titleInfo)
    if (!titleInfo[0] || !titleInfo[1]) return
    return path.join(titleInfo[1], titleInfo[0])
  },
  titleToFileBase: (title) => {
    if (!title) return
    if (title.startsWith('* ')) {
      title = title.substr(2)
    }
    if (title === locale.Untitled) return
    const titleInfo = title.split(' - ')
    return titleInfo[0]
  },
  addStarOnTitle: (title) => {
    if (!title || title.startsWith('* ')) return title
    title = '* ' + title
    return title
  },
  removeStarOnTitle: (title) => {
    if (!title || !title.startsWith('* ')) return title
    title = title.substr(2)
    return title
  },
  customizeLink: (renderer) => {
    renderer.link = (href, title, text) => {
      return '<a target="_blank" href="' + href + '" title="' + title + '">' + text + '</a>'
    }
  },
  customizeKatex: (katex, renderer) => {
    let originParagraph = renderer.paragraph.bind(renderer)
    renderer.paragraph = (text) => {
      const blockRegex = /\$\$[^\$]*\$\$/g
      const inlineRegex = /\$[^\$]*\$/g
      let blockExprArray = text.match(blockRegex)
      let inlineExprArray = text.match(inlineRegex)
      for (let i in blockExprArray) {
        const expr = blockExprArray[i]
        const result = renderMathsExpression(katex, expr)
        text = text.replace(expr, result)
      }
      for (let i in inlineExprArray) {
        const expr = inlineExprArray[i]
        const result = renderMathsExpression(katex, expr)
        text = text.replace(expr, result)
      }
      return originParagraph(text)
    }
  },
  customizeCode: (renderer) => {
    let originCode = renderer.code.bind(renderer)
    renderer.code = (code, language) => {
      if (code.match(/^sequenceDiagram/) || code.match(/^graph/) || code.match(/^gantt/) || code.match(/^classDiagram/)) {
        window.mermaid.init()
        return '<div class="mermaid">' + code + '</div>'
      } else {
        return originCode(code, language)
      }
    }
  }
}
