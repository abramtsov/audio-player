const { src, dest, series, watch } = require('gulp');
const htmlmin = require('gulp-htmlmin');
const csso = require('gulp-csso');
const sass = require('gulp-sass')(require('sass'));
const del = require('del');
const sync = require('browser-sync').create();
const include = require('gulp-file-include');

function html() {
    return src('src/**.html').pipe(htmlmin({ collapseWhitespace: true })).pipe(dest('dist'))
}
function scss() {
    return src('src/**.scss').pipe(sass()).pipe(csso()).pipe(dest('dist'));
}
function clear() {
    return del('dist/**.**')
}

function serve() {
    sync.init({
        server: './dist'
    })
    watch('src/**.html', series(clear, html)).on('change', sync.reload)
    watch('src/**.scss', scss).on('change', sync.reload)
}
// exports.build = series(clear)
// exports.clear = clear
exports.html = html
exports.scss = scss
exports.serve = serve