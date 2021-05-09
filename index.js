/**
 * conf.json中打包日期自动替换
 */
const fs = require('fs');
const formatDate = require('./formatDate');

class WebpackOutputReplacePlugin {
  constructor (options) {
    this.options = {
      file: 'conf.json',
      match: /\d+\/\d+\/\d+/g,
      conent: formatDate(new Date(), 'yyyy-MM-dd~hh:mm:ss'),
    }
    Object.assign(this.options, options)
  }
  apply (compiler){
    const options = this.options;
    const pluginName = this.constructor.name;

    function handle(compilation, callback) {
      const basePath = `${compiler.outputPath}/${options.file}`;
      fs.readFile(basePath, (error, buffer) => {
        if(error){
          console.log(error)
          return;
        }
        fs.writeFile(basePath,
          buffer.toString().replace(options.match, options.conent),
          () => {
            callback && callback();
          });
      });
    }

    if (compiler.hooks) {
      compiler.hooks.done.tapAsync(pluginName, handle);
    } else {
      compiler.plugin('done', handle);
    }
  }
}

module.exports =  WebpackOutputReplacePlugin;
