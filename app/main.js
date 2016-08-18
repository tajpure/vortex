import Vue from 'vue'
import App from './App'
import fs from 'fs'
import os from 'os'

/* eslint-disable no-new */
new Vue({
  el: 'body',
  components: { App }
})

const customizedCssPath = os.homedir() + '/.vortex/user.css'

/* Add user customized css file. */
fs.stat(customizedCssPath, (err, stats) => {
  if (err === null) {
    let css = document.createElement('style')
    css.type = 'text/css'
    const customizedCss = fs.readFileSync(customizedCssPath, 'utf8')
    css.innerHTML = customizedCss
    window.document.body.appendChild(css)
  } else if (err.code === 'ENOENT') {
    console.log(customizedCssPath + ' not exists')
  } else {
    console.log('error code: ', err.code)
  }
})
