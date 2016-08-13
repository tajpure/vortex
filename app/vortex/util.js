const path = require('path')
const locale = require('./locale.js')

module.exports = {
  fileNameToTitle: (fileName) => {
    if (!fileName) return
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
    if (title.endsWith(locale.TitleSuffix)) {
      title = title.slice(0, -(locale.TitleSuffix.length))
    }
    if (title === locale.Untitled) return
    const titleInfo = title.split(' - ')
    if (!titleInfo[0] || !titleInfo[1]) return
    return path.join(titleInfo[1], titleInfo[0])
  },
  titleToFileBase: (title) => {
    if (!title) return
    if (title.startsWith('* ')) {
      title = title.substr(2)
    }
    if (title.endsWith(locale.TitleSuffix)) {
      title = title.slice(0, -(locale.TitleSuffix.length))
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
  }
}
