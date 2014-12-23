var queue = require('q');
var fs = require('fs');

function Config() {

    this.filename = 'mimir.json';

    this.config = {
        files: [],
        collaborators: []
    };
}

Config.prototype.saveConfig = function() {
    var self = this;
    return function() {
        var deferred = queue.defer();
        fs.writeFile(self.filename, JSON.stringify(self.config, null, 4), deferred.makeNodeResolver());
        return deferred.promise;
    }
}


Config.prototype.loadConfig = function() {
    var self = this;
    return function() {
        var deferred = queue.defer();

        fs.readFile(self.filename, function(err, data) {
            if(err) {
                // config does not exist -> create it
                self.saveConfig();
            } else {
                self.config = JSON.parse(data);
            }
            deferred.resolve(self.config);
        });

        return deferred.promise;
    }
}

module.exports = Config;