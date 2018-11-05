

var gulp = require('gulp'),    
    pug = require('gulp-pug'),
    prefix = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create();;

// Directories
var paths = {
    public: './public/',
    sass: './src/assets/sass/',
    css: './public/css/'
};

// Compile .pug files
gulp.task('pug', function () {
  return gulp.src('./src/*.pug')    
    .pipe(pug({
      pretty : true
    }))
    .on('error', function (err) {
      process.stderr.write(err.message + '\n');
    })
    .pipe(gulp.dest(paths.public))
    .pipe(browserSync.stream());
});


// Compile .scss files into public css directory with autoprefixer
gulp.task('sass', function () {
  return gulp.src(paths.sass + '*.scss')
    .pipe(sass({
      includePaths: [paths.sass],
      outputStyle: 'compressed'
    }))
    .on('error', sass.logError)
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
      cascade: true
    }))
    .pipe(gulp.dest(paths.css))
    .pipe(browserSync.stream());
});



// Watch files
gulp.task('watch', function () {
  gulp.watch(paths.sass + '**/*.scss', gulp.series('sass'));
  gulp.watch('./src/**/*.pug', gulp.series('pug'));
});

// Browsersync
gulp.task('browser-sync', function () {
  browserSync.init({
    injectChanges: true,
    server: {
      baseDir: paths.public
    },
    notify: true
  });
});

// Build task compile sass and pug.
gulp.task('build', gulp.parallel('sass', 'pug',function(done) {
  done();
}));

// Default task, running just `gulp` will compile
gulp.task('default', gulp.parallel('browser-sync','watch','sass', function(done) { 
  done();
}));