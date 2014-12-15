var queue = require('q');
var fs = require('fs');

var ursa = require('../ursa/ursa');

var Config = require('./config');
var config = new Config();

function startEncryption(config, collaborator) {
    return function (){
        var deferred = queue.defer();

        var encryptionQueue = queue();

        for (var i = 0; i < config.files.length; i++) {
            var file = config.files[i];
            console.log('  - ' + file);

            encryptionQueue = encryptionQueue.then(encrypt(file, collaborator));

        };

        encryptionQueue.then(function() {
            console.log('all done!');
            deferred.resolve();
        });

        return deferred.promise;
    }
}

function startDecryption(user) {
    return function() {
        var deferred = queue.defer();

        var decryptionQueue = queue();
        for (var i = 0; i < config.config.collaborators.length; i++) {
            var collaborator = config.config.collaborators[i];
            if(collaborator.name === user) {
                break;
            }
        };

        console.log('decrypting ' + user);

        var privateKey = null;

        decryptionQueue = decryptionQueue.then(loadPrivateKey(collaborator));

        for (var i = 0; i < config.config.files.length; i++) {
            var file = config.config.files[i];

            decryptionQueue = decryptionQueue.then(decrypt(file, collaborator));

        };

        decryptionQueue.then(function() {
            deferred.resolve();
        });
        decryptionQueue.fail(function(error) {
            console.error('ERROR: ', error);
        })

        return deferred.promise;
    }
}

function encrypt(file, collaborator) {
    return function() {
        var deferred = queue.defer();

        fs.readFile(file, function(err, data) {
            if(err) {
                console.error(err);
                deferred.reject();
            }
            var crt = ursa.createPublicKey(collaborator.publicKey);

            var encrypted = crt.encrypt(data);
            fs.writeFile(file + '.' + collaborator.name + '.crypt', encrypted, deferred.makeNodeResolver());
        });

        return deferred.promise;
    }
}

function decrypt(file, collaborator) {
    return function() {
        var deferred = queue.defer();

        var filename = file + '.' + collaborator.name + '.crypt';

        fs.readFile(filename, function(err, input) {

            var decrypted = privateKey.decrypt(input);

            fs.writeFile(file, decrypted, function() {
                deferred.resolve();
                console.log('    - ' + file);
            });

        });

        return deferred.promise;
    }
}

function loadPrivateKey(collaborator) {
    return function() {
        var deferred = queue.defer();

        fs.readFile(collaborator.privateKey, function(err, key) {

            try {
                privateKey = ursa.createPrivateKey(key.toString());
                deferred.resolve();
            } catch(e) {
                deferred.reject(e);
            }

        });

        return deferred.promise;
    }
}

function doEncrypt() {
    queue().
    then(config.loadConfig()).
    then(function() {
        var deferred = queue.defer();

        var publicKeyQueue = queue();
        for (var i = 0; i < config.config.collaborators.length; i++) {
            var collaborator = config.config.collaborators[i];
            console.log('enrypting for ' + collaborator.name);

            publicKeyQueue = publicKeyQueue.
                then(startEncryption(config.config, collaborator));
        }

        publicKeyQueue.then(function() {
            deferred.resolve();
        });

        deferred.resolve();
    });
}

function doDecrypt(user) {
    queue().
        then(config.loadConfig()).
        then(startDecryption(user)).
        then(function() {
            console.log('all decrypted');
        });
}

module.exports = {
    encrypt: doEncrypt,
    decrypt: doDecrypt,
}