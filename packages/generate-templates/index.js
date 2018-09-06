const TemplateGenerotor = require('./lib/core')

module.exports = options => {
  const templateGenerotor = new TemplateGenerotor()
  templateGenerotor.use(require('./plugins/chore'))
  templateGenerotor.log()
}
