var queue = require('q');
var fs = require('fs');

var ursa = require('../ursa/ursa.js');

var Config = require('./config');
var config = new Config();

function addFile(name) {
    queue().
        then(config.loadConfig()).
        then(function() {
            var deferred = queue.defer();

            config.config.files.push(name);
            deferred.resolve();

            return deferred.promise;
        }).
        then(config.saveConfig()).
        then(function() {
            console.log('file added');
        })
}

function deleteFile(name) {
    queue().
        then(config.loadConfig()).
        then(function() {
            var newFiles = config.config.files.filter(function(file) {
                return file !== name;
            });

            config.config.files = newFiles;
        }).
        then(config.saveConfig()).
        then(function() {
            console.log('file removed');
        })
}

function listFiles() {
    queue().
        then(config.loadConfig()).
        then(function() {
            console.log('Known files:');
            console.log('  - ' + config.config.files.join("\n  - "));
        });
}

module.exports = {
    addFile: addFile,
    deleteFile: deleteFile,
    listFiles: listFiles
};