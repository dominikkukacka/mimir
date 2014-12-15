var fs = require('fs');
var spawn = require('child_process').spawn;
var queue = require('q');



var ursa = require('./ursa/ursa');

var collaborators = require('./lib/collaborators');
var files = require('./lib/files');
var encryption = require('./lib/encryption');

var action = process.argv[2];
switch(action) {

    case 'collaborators':

        var subaction = process.argv[3];

        switch(subaction) {
            case 'delete':
            case 'remove':
            case 'rm':
                var name = process.argv[4];
                if(!name) {
                    console.error('please specify a name');
                    return;
                }

                collaborators.deleteCollaborator(name);

                break;

            case 'create':
            case 'new':
            case 'add':
                var name = process.argv[4];
                if(!name) {
                    console.error('please specify a name');
                    return;
                }

                var privateKey = process.argv[5];
                if(!privateKey) {
                    console.error('please specify a privateKey');
                    return;
                }

                var publicKey = process.argv[6];
                if(!publicKey) {
                    console.error('please specify a publicKey');
                    return;
                }

                collaborators.addCollaborator(name, privateKey, publicKey);

                break;

            case 'list':
            default:
                collaborators.listCollaborators();
                break;
        }


        break;

    case 'files':

        var subaction = process.argv[3];

        switch(subaction) {
            case 'delete':
            case 'remove':
            case 'rm':
                var name = process.argv[4];
                if(!name) {
                    console.error('please specify a name');
                    return;
                }

                files.deleteFile(name);

                break;

            case 'create':
            case 'new':
            case 'add':
                var name = process.argv[4];
                if(!name) {
                    console.error('please specify a name');
                    return;
                }

                files.addFile(name);

                break;

            case 'list':
            default:
                files.listFiles();
                break;
        }


        break;

    case 'encrypt':
        encryption.encrypt();
        break;

    case 'decrypt':
        var user = process.argv[3];
         if(!user) {
            console.error('please specify a user');
            return;
        }

        encryption.decrypt(user);
        break;

    default:
        console.log(
            "Mímir\n\n" +
            "Mímir provides you the possibility to store your service credentials savely as a team\n\n"+

            "Usage:\n"+

            "\n"+
            "    * collaborators list - Lists all the collaborators\n"+
            "    * collaborators add [name] [path/to/privateKey] [path/to/publicKey] - adds a new collaborator\n"+
            "    * collaborators rm [name] - removes a collaborator\n"+

            "\n"+
            "    * files list - Lists all the files\n"+
            "    * files add [name] - adds a new file\n"+
            "    * files rm [name] - removes a file\n"+

            "\n"+
            "    * encrypt - Encrypts all the added files for all collaborators\n"+
            "    * decrypt [name] - Decrypt a file with the defined collaborators privateKey (normaly yourself)"
            );

}
