/**
 * Ant modular controller for express js.
 * @param {String} moduleDir - directory path of module.
 * @param {Express} app - Expressjs app.
 */
module.exports = function (moduleDir, app) {
    var fs = require('fs');

    // express js supported http method list based on their documentation
    var httpMethod = ['get', 'post', 'put', 'head', 'delete', 'options', 'trace', 'copy', 'lock', 'mkcol', 'move', 'purge', 'propfind', 'proppatch', 'unlock', 'report', 'mkactivity', 'checkout', 'merge', 'm-search', 'notify', 'subscribe', 'unsubscribe', 'patch', 'search', 'connect', 'all'];


    var amc = {
        _baseUrl: "/",
        baseUrl: function (baseUrl) {
            this._baseUrl = baseUrl;

        },
        app: app,
    }

    httpMethod.forEach(function (m) {
        amc[m] = function (path, cb) {
            //remove invalid url slash
            var urlPath = (amc._baseUrl + path).replace("//", "/");
            console.log(urlPath);
            app[m](urlPath, cb);
        }
    });


    fs.readdirSync(moduleDir).forEach(function (file) {
        fs.exists(moduleDir + '/' + file + '/controllers', function (exists) {
            if (exists && fs.statSync(moduleDir + '/' + file + '/controllers').isDirectory()) {
                fs.readdirSync(moduleDir + '/' + file + '/controllers').forEach(function (f) {
                    if (f.substr(-13) == 'Controller.js') {
                        fs.realpath(moduleDir + '/' + file + '/controllers/' + f, function (err, resolvedPath) {
                            if (err) throw err;
                            amc.baseUrl("/" + file + "/" + f.substr(0, (f.length - 13)));
                            var route = require(resolvedPath);
                            route.controller(amc);
                        });
                    }
                })
            }
        });
    });
}