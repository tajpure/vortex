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
    const titleInfo = title.split(' - ')
    return path.join(titleInfo[1], titleInfo[0])
  }
}
