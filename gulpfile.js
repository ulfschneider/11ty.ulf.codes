const images = require('./_gulp/images.js');
const css = require('./_gulp/css.js');
const javascript = require('./_gulp/javascript.js');

const { series, watch } = require('gulp');

const watcher = () => {
    watch(['_assets/css/**/*', 'content/**/*', '_includes/**/*', '_layouts/**/*'], { ignoreInitial: true }, css);
    watch(['_assets/js/**/*'], { ignoreInitial: true }, javascript);
    watch(['_data/site.js', 'content/img/**/*'], { ignoreInitial: true }, images);
};

exports.default = series([javascript, css, images]);

exports.watch = watcher;