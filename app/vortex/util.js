import path from 'path'

module.exports = {
  fileNameToTitle: (fileName) => {
    if (!fileName) return
    const fileInfo = path.parse(fileName)
    fileName = fileInfo.base
    if (fileInfo.dir) {
      fileName = fileName + ' - ' + fileInfo.dir + ' - Vortex'
    }
    return fileName
  },
  titleToFileName: (title) => {
    if (!title || title === 'Untitled') return
    if (title.startsWith('* ')) {
      title = title.substr(2)
    }
    const titleInfo = title.split(' - ')
    if (!titleInfo[0] || !titleInfo[1]) return
    return path.join(titleInfo[1], titleInfo[0])
  },
  titleToFileBase: (title) => {
    if (!title || title === 'Untitled') return title
    if (title.startsWith('* ')) {
      title = title.substr(2)
    }
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
