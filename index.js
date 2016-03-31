/*
 * Created brightSPARK Labs
 * www.brightsparklabs.com
 */

'use strict';

// -----------------------------------------------------------------------------
// MODULES
// -----------------------------------------------------------------------------

var pdc     = require('pdc');
var through = require('through2');
var gutil   = require('gulp-util');
var mkdirp  = require('mkdirp');

// -----------------------------------------------------------------------------
// PLUGIN
// -----------------------------------------------------------------------------

var PluginError = gutil.PluginError;
var pluginName  = 'gulp-pandoc-pdf'

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

module.exports = function(opts) {
    var args = opts.args || [];
    var pdfDir = opts.pdfDir;

    return through.obj(function (file, enc, cb) {
        var input = file.contents.toString();
        if (file.isNull())  {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new PluginError(pluginName, 'Streaming not supported'));
            return cb();
        }

        // pandoc does not support specifying PDF as a '-t' format. This
        // would have allowed us to stream the data through and let gulp handle
        // outputing the raw bytes to files.
        //
        // Instead, we need to run pandoc and generate explicit PDF files in
        // the directory specified via the configuration object. Once these
        // are created we need to ensure we send something through the pipeline
        // to gulp, so we call pandoc again and have it stream across HTML
        // content back to the pipeline.

        var pdfFile = pdfDir + '/' + file.relative;
        pdfFile = pdfFile.replace('.md', '.pdf');

        // create directory for pdf
        var outputDir = pdfFile.replace(/[^\/]+$/, '');
        mkdirp(outputDir, function(err) {
            if (err) {
                this.emit('error', err.toString());
                return cb();
            }
        });

        // create pdf
        var pdfArgs = args.slice();
        pdfArgs.push('--output=' + pdfFile);
        pdc(input, 'markdown', 'latex', pdfArgs, function(err, output) {
            if (err) {
                this.emit('error', new PluginError(pluginName, err.toString()));
                return cb();
            }
        });

        // create html
        var htmlArgs = args.slice();
        htmlArgs.push('--standalone');
        pdc(input, 'markdown', 'html5', htmlArgs, function(err, output) {
            if (err) {
                this.emit('error', new PluginError(pluginName, err.toString()));
                return cb();
            }
            file.contents = new Buffer(output);
            file.path = gutil.replaceExtension(file.path, '.html');
            this.push(file);
            return cb();
        }.bind(this));
    });
};

