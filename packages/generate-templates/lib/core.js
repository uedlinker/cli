const path = require('path')
const fs = require('fs-extra')
const defaults = require('./defaults')

module.exports = class {
  constructor (options = {}) {
    this.map = new Map()
    // TODO: 使用 Ajv 验证参数是否合法
    this.options = Object.freeze({ ...defaults, ...options })
    this.init()
  }

  init () {
    this.map.set('package.json', {
      type: 'json',
      value: {
        private: true,
        name: this.options.name,
        description: this.options.description,
        version: '0.0.0',
        license: 'UNLICENSED',
        scripts: {},
        dependencies: {},
        devDependencies: {},
      },
    })
  }

  use (plugin) {
    plugin({
      options: this.options,
      map: this.map,
    })
  }

  generate () {
    const { cwd } = this.options
    const promises = []

    for (let [key, obj] of this.map) {
      const filename = path.resolve(cwd, key)
      const { type, value } = obj
      let content = ''

      switch (type) {
        case 'json': content = JSON.stringify(value, null, '  ')
      }

      promises.push(new Promise((resolve, reject) => {
        fs.outputFile(filename, content, error => {
          if (error) {
            reject(error)
          } else {
            resolve()
          }
        })
      }))
    }

    Promise.all(promises).then(() => {
      console.log('Create Successfully!')
    }).catch(error => {
      throw error
    })
  }
}
