/*!
 * Code inspired by http://chriszarate.github.io/sheetrock/
 * License: MIT
 */

(function(gssr) {

    'use strict';

    /* global define, module */
    module.exports = gssr(gssr);

})(function(gssr) {
    'use strict';

    // Google API endpoints and key formats
    var _spreadsheetTypes = {
        'new': {
            'server': 'docs.google.com',
            'path': '/spreadsheets/d/%key%/gviz/tq?tqx=out:json',
            'keyFormat': new RegExp('spreadsheets/d/([^/#]+)', 'i')
        },
        'legacy': {
            'server': 'spreadsheets.google.com',
            'path': '/tq?tqx=out:json&key=%key%',
            'keyFormat': new RegExp('key=([^&#]+)', 'i')
        }
    },

    // Get spreadsheet "type" from Google Spreadsheet URL (default is "new").
    _getSpreadsheetType = function (url) {

        var returnValue;

        for (var _spreadsheetTypeName in _spreadsheetTypes) {
            if (_spreadsheetTypes[_spreadsheetTypeName].keyFormat.test(url)) {
                returnValue = _spreadsheetTypes[_spreadsheetTypeName];
                break;
            }
        }

        return returnValue || _spreadsheetTypes.new;
    },

    // Extract the "key" from a Google Spreadsheet URL.
    _extractKey = function (url, spreadsheetType) {
        return (spreadsheetType.keyFormat.test(url)) ? url.match(spreadsheetType.keyFormat)[1] : false;
    },

    // Extract the "gid" from a Google spreadsheet URL.
    _extractGID = function (url) {
        var gidRegExp = new RegExp('gid=([^/&#]+)', 'i');
        return (gidRegExp.test(url)) ? url.match(gidRegExp)[1] : false;
    },

    // Read the spreadsheet
    read = function (url, sql, callback) {
        // Get spreadsheet type ("new" or "legacy").
        var type = _getSpreadsheetType(url);

        // Get spreadsheet key and gid.
        var key = _extractKey(url, type);
        var gid = _extractGID(url);

        // Set path
        var path = type.path.replace(/%key%/g, key);
        if (sql) {
            path += "&tq=" + encodeURIComponent(sql);
        }
        if (gid) {
            path += "&gid=" + gid;
        }

        var https = require("https");

        var options = {
            host: type.server,
            path: path
        };

        var data = ''
        https.request(options, function (response) {
            response.on('data', function (chunk) {
                data += chunk;
            });

            response.on('end', function () {
                data = data.substr(data.indexOf("(") + 1);
                data = data.substr(0, data.lastIndexOf(")"));
                callback(JSON.parse(data), url);
            });
        }).end();
    }

    gssr.read = read;

    return gssr;
});