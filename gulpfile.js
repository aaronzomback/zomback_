var gulp = require('gulp')

// css
var cleanCSS = require("gulp-clean-css")
var postcss = require("gulp-postcss")
var sourcemaps = require("gulp-sourcemaps")
var concat = require("gulp-concat")

// browser refresh reates a brand new server... ref. to ".create()"
var browserSync = require('browser-sync').create()

// images
var imagemin = require('gulp-imagemin')

// github deployment
var ghpages = require('gh-pages')

gulp.task("css", function () {
  // we want to run "sass css/app.scss app.css --watch"
  return gulp.src ([
    "src/css/reset.css",
    "src/css/typography.css",
    "src/css/app.css"
  ])
  .pipe(sourcemaps.init())
  .pipe(
    postcss([
      require ("autoprefixer"),
      require ("postcss-preset-env")({
        stage: 1,
        browsers: ["ie 11", "last 2 versions"]
      })
    ])
  )
  .pipe(concat("app.css"))
  .pipe(
    cleanCSS({
      compatibility: 'ie8' })
  )
  .pipe(sourcemaps.write())
  .pipe(gulp.dest("dist"))
  .pipe(browserSync.stream())
})

gulp.task("fonts", function() {
  return gulp.src("src/fonts/*")
  .pipe(gulp.dest("dist/fonts"))
})

gulp.task("images", function() {
  return gulp.src("src/img/*")
  .pipe(imagemin())
  .pipe(gulp.dest("dist/img"))
})

gulp.task("html", function () {
  return gulp .src("src/*.html")
  .pipe(gulp.dest("dist"))
})

gulp.task( "watch", function () {

  browserSync.init({
    server: {
      baseDir: "dist"
    }
  })
  gulp.watch("src/*.html", ["html"]).on("change", browserSync.reload)
  gulp.watch("src/css/*", ["css"])
  gulp.watch("src/fonts/*", ["fonts"])
  gulp.watch("src/img/*", ["images"])
})

gulp.task("deploy", function() {
  ghpages.publish("dist")
})

gulp.task('default', ["html", "css", "fonts", "images", "watch"])
