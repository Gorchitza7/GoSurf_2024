import gulp from "gulp";
import gulpSass from "gulp-sass";
import * as sass from "sass";
import browserSync from "browser-sync";
import uglify from "gulp-uglify";
import concat from "gulp-concat";
import rename from "gulp-rename";
import autoprefixer from "gulp-autoprefixer";
import gulpGhPages from "gulp-gh-pages";

const sassProcessor = gulpSass(sass);

gulp.task("clean", async function () {
    const del = await import("del");
    await del.deleteAsync(["dist"]);
});

gulp.task("scss", function () {
    return gulp
        .src("app/scss/**/*.scss")
        .pipe(sassProcessor({ outputStyle: "compressed" }))
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 8 versions"],
                cascade: false
            })
        )
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task("css", function () {
    return gulp
        .src([
            "node_modules/normalize.css/normalize.css",
            "node_modules/slick-carousel/slick/slick.css",
            "node_modules/animate.css/animate.css",
        ])
        .pipe(concat("_libs.scss"))
        .pipe(gulp.dest("app/scss"))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task("html", function () {
    return gulp.src("app/*.html").pipe(browserSync.reload({ stream: true }));
});

gulp.task("script", function () {
    return gulp.src("app/js/*.js").pipe(browserSync.reload({ stream: true }));
});

gulp.task("js", function () {
    return gulp
        .src(["node_modules/slick-carousel/slick/slick.js", "node_modules/wow.js/dist/wow.js"])
        .pipe(concat("libs.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("app/js"))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task("browser-sync", function () {
    browserSync.init({
        server: {
            baseDir: "app/",
        },
    });
});

gulp.task("export", function () {
    return gulp
        .src([
            "app/**/*.html",
            "app/css/**/*.css",
            "app/js/**/*.js",
            "app/fonts/**/*.*",
            "app/images/**/*.*"
        ], { base: "app" })
        .pipe(gulp.dest("dist"));
});

gulp.task("watch", function () {
    gulp.watch("app/scss/**/*.scss", gulp.parallel("scss"));
    gulp.watch("app/*.html", gulp.parallel("html"));
    gulp.watch("app/js/*.js", gulp.parallel("script"));
});

gulp.task("deploy", function () {
    return gulp.src("./dist/**/*")
        .pipe(gulpGhPages({
            remoteUrl: "https://github.com/Gorchitza7/GoSurf_2024.git" 
        }));
});

gulp.task("build", gulp.series("clean", "scss", "js", "export"));

gulp.task("default", gulp.parallel("css", "scss", "js", "browser-sync", "watch"));
