
//подключаем в работу GULP все установленные пакеты
const {src, dest, series, watch} = require('gulp') //подключаем только методы а не весь gulp
const sass = require('gulp-sass')
const csso = require('gulp-csso')
const include = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const del = require('del')
const concat = require('gulp-concat') // объединяет все файлы в 1
const autoprefixer = require ('gulp-autoprefixer')//добавляет любые автопрефиксы которые мы задали
const uglify  = require ('gulp-uglify') //минимизация js файлов
const includer = require ('gulp-include')//должен делать include файлов в один
const rigger = require('gulp-rigger')//для объединения js файлов
const sync = require('browser-sync').create() //используем метод create что бы при начале работы сразу запускался


//собирает html файлы по префиксу и переносит в папку dist
function html() {
  return src('src/**.html')
    .pipe(include({
      prefix: '@@'
    }))
    .pipe(dest('dist'))
}
function pages() {
  return src('src/pages/**.html')
    .pipe(dest('dist/pages'))
}

function scss(){
  return src('src/scss/**.scss')
    .pipe(sass())
    .pipe(sass({
      includePaths: ['node_modules']
    }))
    .pipe(autoprefixer({
      overrideBrowserslist: ['defaults']
    }))
    .pipe(csso())
    .pipe(concat('index.css'))
    .pipe(dest('dist/css'))
}


function javaScript() {
  return src('src/js/**.js')
    .pipe(include())
    .pipe(rigger())
    .pipe(concat('main.js'))
    .pipe(dest('dist/js'))
}

function icon() {
  return src('src/img/icon/**.png')
    .pipe(dest('dist/img/icon'))

}

function img() {
  return src('src/img/**/*.*')
    .pipe(dest('dist/img/'))
}

function fonts() {
  return src('src/fonts/**/*.*')
    .pipe(dest('dist/fonts/'))
}

function clear(){
  return del ('dist')
}

function serve(){
  sync.init({
    server: './dist'
  })

  watch('src/**.html', series(html)).on('change', sync.reload)
  watch('src/scss/**.scss', series(scss)).on('change', sync.reload)
  watch('src/**/**.html', series(html)).on('change', sync.reload)
  watch('src/**/**.js', series(javaScript)).on('change', sync.reload)

}




exports.build = series(clear, scss, html, javaScript, icon, img, fonts, pages)
exports.serve = series(clear, scss, html, javaScript, icon, img, pages, fonts, serve)
exports.clear = clear