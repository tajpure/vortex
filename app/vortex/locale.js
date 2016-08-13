module.exports = {
  lang: 'en',
  langArray: ['en'],
  get Untitled () {
    const data = {
      'en': 'Untitled'
    }
    return data[this.lang]
  },
  get TitleSuffix () {
    const data = {
      'en': ' - Vortex'
    }
    return data[this.lang]
  }
}
