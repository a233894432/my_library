/**
 * Created by diogoxiang on 2016/4/20.
 */
var gulp = require('gulp'),
    gutil = require('gulp-util'), //让命令行输出的文字带颜色
    uglify = require('gulp-uglify'), //丑化(Uglify)
    cssnano = require('gulp-cssnano'), // 获取 minify-css 模块（用于压缩 CSS）这个是最新的
    imagemin = require('gulp-imagemin'), // 获取 gulp-imagemin 模块
    sass = require('gulp-ruby-sass'), // 获取 gulp-ruby-sass 模块
    rename = require('gulp-rename'), //重命名
    concat = require('gulp-concat'), //合并文件
    watchPath = require('gulp-watch-path'), //实际上我们只需要重新编译被修改的文件
    combiner = require('stream-combiner2'), //监听错误
    sourcemaps = require('gulp-sourcemaps'), //map调试
    stripDebug = require('gulp-strip-debug'),//清理DEBUG与console
    clean = require('gulp-clean'); //清空文件夹
///var inject=require('gulp-inject'); // 功能 很强大的插入数据插件

var handleError = function (err) {
    var colors = gutil.colors;
    console.log('\n');
    gutil.log(colors.red('Error!'));
    gutil.log('fileName: ' + colors.red(err.fileName));
    gutil.log('lineNumber: ' + colors.red(err.lineNumber));
    gutil.log('message: ' + err.message);
    gutil.log('plugin: ' + colors.yellow(err.plugin))
};

var distpath='dist/';
//my_css_framework
var diocssSRC='my_CSS_framework/src/sass/*.scss';
var diocssDIST='my_CSS_framework/dist/css/';
//默认方法
gulp.task('default', function() {
    gutil.log('message');
    gutil.log(gutil.colors.red('error'));
    gutil.log(gutil.colors.green('message:') + "some");
});

//合并js模块
gulp.task('buildJs',function () {

    var combined = combiner.obj([
        gulp.src('src/js/verdor/*.js'),
        concat('verdor.js'),
        uglify(),
        gulp.dest('dist/js')
    ]);

    combined.on('error', handleError);


});

//配置 JS 任务 压缩JS
gulp.task('uglifyjs', function() {
    gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});

gulp.task('watchjs', function () {
    gulp.watch('src/js/**/*.js', function (event) {
        var paths = watchPath(event, 'src/', 'dist/');
        /*
         paths
         { srcPath: 'src/js/log.js',
         srcDir: 'src/js/',
         distPath: 'dist/js/log.js',
         distDir: 'dist/js/',
         srcFilename: 'log.js',
         distFilename: 'log.js' }
         */
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath);

        var combined = combiner.obj([
            gulp.src(paths.srcPath),
            sourcemaps.init(),
            uglify(),
            sourcemaps.write('./'),
            gulp.dest(paths.distDir)
        ]);

        combined.on('error', handleError)
    })
});


gulp.task('watchcss', function () {
    gulp.watch('src/css/**/*.css', function (event) {
        var paths = watchPath(event, 'src/', 'dist/');

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath);
        gulp.src(paths.srcPath)
            .pipe(sourcemaps.init())
            .pipe(autoprefixer({
                browsers: 'last 2 versions'
            }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(paths.distDir))
            .pipe(rename({suffix: '.min' }))
            .pipe(cssnano())//精简
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(paths.distDir))
    })
});

//压缩所有css
gulp.task('minifycss', function () {
    gulp.src('src/css/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: 'last 2 versions'
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/css/'))
        .pipe(rename({suffix: '.min' }))
        .pipe(cssnano())//精简
        .pipe(gulp.dest('dist/css/'))
});


//监听图片变化
gulp.task('watchimage', function() {
    gulp.watch('src/images/**/*', function(event) {
        var paths = watchPath(event, 'src/', 'dist/');

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath);

        gulp.src(paths.srcPath)
            .pipe(imagemin({
                progressive: true
            }))
            .pipe(gulp.dest(paths.distDir))
    })
});
//直接全部压缩
gulp.task('image', function () {
    gulp.src('src/images/**/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/images'))
});

//配置文件复制任务
gulp.task('copy', function () {
    gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts/'))
});

//清理 dist 目录 的数据
gulp.task('cleanDist',function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});



//配置文件复制任务 复制文件到 上一级目录中去
gulp.task('copydir', function () {
    gulp.src('src/js/**/*')
        .pipe(gulp.dest('../name/'))
});


//测试目录 监听

gulp.task('watchTestsass',function () {
    var cssSrc = 'test/ranking/sass/*.scss',
        cssSrca= 'test/ranking/css';//源码也输出一份

    gulp.watch('test/ranking/sass/**/*.scss', function (event) {
        var paths = watchPath(event,'test/ranking/sass/','test/ranking/css/');

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath);

        gulp.src(paths.srcPath)
        return sass(cssSrc, {style: 'expanded'})
            .pipe(gulp.dest(cssSrca))
            .pipe(rename({suffix: '.min' }))
            .pipe(cssnano())//精简
            .pipe(gulp.dest(cssSrca))
            .on('error', function (err) {
                console.error('Error!', err.message);
            });

    })


});

gulp.task('sass', function() {
    var cssSrc = './src/sass/*.scss',
        cssSrca= './src/css';//源码也输出一份


    gulp.src(cssSrc)
    // .pipe(sass({ style: 'expanded'}))
    return sass(cssSrc, {style: 'expanded'})
        .pipe(gulp.dest(cssSrca))
        .pipe(rename({suffix: '.min' }))
        .pipe(cssnano())//精简
        .pipe(gulp.dest(cssSrca))
        .on('error', function (err) {
            console.error('Error!', err.message);
        });

});

/**
 * my_css_framework 监听
 */


gulp.task('watchCSSsass',function () {
    var cssSrc = 'my_CSS_framework/src/sass/*.scss',
        cssSrca= 'my_CSS_framework/src/css';//源码也输出一份

    gulp.watch('my_CSS_framework/src/sass/**/*.scss', function (event) {
        var paths = watchPath(event,'my_CSS_framework/src/sass/','my_CSS_framework/src/css/');

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath);

        gulp.src(paths.srcPath)
        return sass(cssSrc, {style: 'expanded'})
            .pipe(gulp.dest(cssSrca))
            .pipe(rename({suffix: '.min' }))
            .pipe(cssnano())//精简
            .pipe(gulp.dest(cssSrca))
            .on('error', function (err) {
                console.error('Error!', err.message);
            });

    })

});


/**
 * 监听并合并JS
 */
gulp.task('watchJQjs',function(){
    gulp.watch('my_CSS_framework/src/js/vendor/*.js', function (event) {
        var paths = watchPath(event,'my_CSS_framework/src/js/vendor/','my_CSS_framework/src/js/');

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath);

        var combined = combiner.obj([
            gulp.src('my_CSS_framework/src/js/vendor/*.js'),
            concat('verdor.js'),
            //uglify(),
            gulp.dest('my_CSS_framework/src/js/')
        ]);

        combined.on('error', handleError);
    })



});


/**
 * expert_pc SASS .监听
 */

gulp.task('watchEXCSSsass',function () {
    var cssSrc = 'expert_pc/sass/*.scss',
        cssSrca= 'expert_pc/css';

    gulp.watch('expert_pc/sass/**/*.scss', function (event) {
        var paths = watchPath(event,'expert_pc/sass/','expert_pc/css/');

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath);

        gulp.src(paths.srcPath)
        return sass(cssSrc, {style: 'expanded'})
            .pipe(gulp.dest(cssSrca))
            .pipe(rename({suffix: '.min' }))
            .pipe(cssnano())//精简
            .pipe(gulp.dest(cssSrca))
            .on('error', function (err) {
                console.error('Error!', err.message);
            });

    })

});


gulp.task('ClearConsole',function () {
    var jsSRC = 'expert_pc/html/**/*.js',
        jsDEST= 'expert_pc/html';
    return gulp.src(jsSRC)
        .pipe(stripDebug())
        .pipe(rename({suffix: '.min' }))
        .pipe(gulp.dest(jsDEST));

});


/**
 * gebo_pc SASS .监听
 */

gulp.task('watchGBCSSsass',function () {
    var cssSrc = 'gebo_src/sass/*.scss',
        cssSrca= 'gebo_src/css';

    gulp.watch('gebo_src/sass/**/*.scss', function (event) {
        var paths = watchPath(event,'gebo_src/sass/','gebo_src/css/');

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath);

        gulp.src(paths.srcPath)
        return sass(cssSrc, {style: 'expanded'})
            .pipe(gulp.dest(cssSrca))
            .pipe(rename({suffix: '.min' }))
            .pipe(cssnano())//精简
            .pipe(gulp.dest(cssSrca))
            .on('error', function (err) {
                console.error('Error!', err.message);
            });

    })

});
