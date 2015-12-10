# gulp-pandoc-pdf

`gulp` plugin for generating PDFs via `pandoc`.

Based off the excellent [gulp-pandoc
plugin](https://github.com/gummesson/gulp-pandoc).

Generating PDFs with `pandoc` requires the use of the `--output` flag
to write the file to disk, rather than just the `-t` flag allowing the
data to be streamed through `gulp` pipes.

This plugin simplifies generating the PDFs in the output directory
you desire whilst also piping the data through the `gulp` pipeline in
HTML format.

# Installation

```shell
# shell 
npm install gulp-pandoc-pdf --save-dev 
```

# Usage

Within `gulpfile.js`:

```javascript 
// javascript

var pdf = require('gulp-pandoc-pdf');

gulp.task('build', function() {
    gulp.src('src/markdown/**/*.md')
        .pipe(pdf({
            pdfDir: 'build/pdf'
        })) 
        .pipe(gulp.dest('build/html'));
});
```

# API

## pdf(options)

### options.pdfDir

**Type:** string

Path to the directory into which the generated PDF files will be
placed. This is relative to `gulpfile.js`. E.g. `build/pdf`.

**This parameter is mandatory.**

### options.args

**Type:** array

Additional command line parameters to `pandoc`. 
E.g. `['--smart', '--css=style.css']`.

The following command line parameters are automatically passed to `pandoc`:
`['--toc', '--number-sections']`.

# Licenses

Refer to the `LICENSE` file for details.

