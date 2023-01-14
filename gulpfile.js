const { src, dest, series, watch } = require('gulp')
const htmlmin = require('gulp-htmlmin')
const csso = require('gulp-csso')
const sass = require('gulp-sass')(require('sass'))
const del = require('del')
const sync = require('browser-sync').create()
const include = require('gulp-file-include')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const imagemin = require('gulp-imagemin')
const plumber = require('gulp-plumber')
const removeComments = require('gulp-remove-css-comments')
const autoprefix = require('gulp-autoprefixer')

function html() {
    return src('src/**.html')
        .pipe(plumber())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest('dist'))
}

function css() {
    return src('src/css/**.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefix())
        .pipe(dest('dist/css'))
        .pipe(csso())
        .pipe(removeComments())
        .pipe(rename('style.min.css'))
        .pipe(dest('dist/css'))
}
function js() {
    return src('src/js/**.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(dest('dist/js/'))
}
function jsModule() {
    return src('src/js/module/**.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(dest('dist/js/module'))
}
function img() {
    return src('src/img/**.**')
        .pipe(imagemin())
        .pipe(dest('dist/img'))
}
function clear() {
    return del('dist/*')
}

function serve() {
    sync.init({
        server: './dist'
    })
    watch('src/**.html', series(html)).on('change', sync.reload)
    watch('src/**.html', series(html)).on('add', sync.reload)
    watch('src/css/**.scss', css).on('change', sync.reload)
    watch('src/js/**.js', js).on('change', sync.reload)
    watch('src/js/module/**.js', jsModule).on('change', sync.reload)
    watch('src/js/module/**.js', jsModule).on('add', sync.reload)
    watch('src/img/**.**', img).on('add', sync.reload)
}

exports.clear = clear
exports.serve = serve
exports.build = series(html, css, js, jsModule, img)