var queue = require('q');
var fs = require('fs');

var ursa = require('../ursa/ursa.js');

var Config = require('./config');
var config = new Config();

function addCollaborator(name, privateKey, publicKey) {
    queue().
        then(config.loadConfig()).
        then(function() {
            var deferred = queue.defer();
            // console.log('adding', name, privateKey, publicKey);
            fs.readFile(publicKey, function(err, data) {

                var crt = ursa.openSshPublicKey(data.toString());

                var publicKeyString = crt.toPublicPem().toString();
                var collaborator = {
                    name: name,
                    privateKey: privateKey,
                    publicKey: publicKeyString
                };

                config.config.collaborators.push(collaborator);
                deferred.resolve();
            });

            return deferred.promise;
        }).
        then(config.saveConfig()).
        then(function() {
            console.log('collaborator added');
        })
}

function deleteCollaborator(name) {
    queue().
        then(config.loadConfig()).
        then(function() {
            var newCollaborators = config.config.collaborators.filter(function(collaborator) {
                return collaborator.name !== name;
            });

            config.config.collaborators = newCollaborators;
        }).
        then(config.saveConfig()).
        then(function() {
            console.log('collaborator removed');
        })
}

function listCollaborators() {
    queue().
        then(config.loadConfig()).
        then(function() {
            var names = config.config.collaborators.map(function(collaborator) {
                return collaborator.name
            });

            console.log('Known collaborators:');
            console.log('  - ' + names.join("\n  - "));
        });
}

module.exports = {
    addCollaborator: addCollaborator,
    deleteCollaborator: deleteCollaborator,
    listCollaborators: listCollaborators
};