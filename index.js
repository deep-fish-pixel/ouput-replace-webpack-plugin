/**
 * conf.json中打包日期自动替换
 */
const fs = require('fs');
const path = require('path');

class WebpackOutputReplacePlugin {
  constructor (options) {
    this.options = {
      file: '',
      match: null,
      conent: null,
      replaces: [],
    }
    Object.assign(this.options, options);
    if (this.options.match) {
      this.options.replaces({
        file: this.options.file,
        match: this.options.match,
        conent: this.options.conent,
      });
    }
  }
  apply (compiler){
    const pluginName = this.constructor.name;
    const options = this.options;
    if ( !options.replaces.length ) {
      console.error('options can\'t be null!!');
      return;
    }

    function handleReplaces(compilation, callback) {
      options.replaces.forEach((options) => {
        handleReplace(options);
      })
      if(callback){
        callback();
      }
    }

    function handleReplace(options) {
      const basePath = path.join(compiler.outputPath, options.file);
      const buffer = fs.readFileSync(basePath);
      fs.writeFileSync(
        basePath,
        buffer.toString().replace(options.match, options.conent),
      );
    }

    if (compiler.hooks) {
      compiler.hooks.done.tapAsync(pluginName, handleReplaces);
    } else {
      compiler.plugin('done', handleReplaces);
    }
  }
}

module.exports =  WebpackOutputReplacePlugin;
