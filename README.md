# Mímir

Mímir provides you the possibility to encrypt your service credential files savely as a team using your public/private keys from your machine.

Mímir (Old Norse "The rememberer, the wise one") or Mim is a figure in Norse mythology renowned for his knowledge and wisdom who is beheaded during the Æsir-Vanir War. Afterward, the god Odin carries around Mímir's head and it recites secret knowledge and counsel to him. [Wikipedia](http://en.wikipedia.org/wiki/M%C3%ADmir)

# Start (Encryption)

1. Add files (files add [path/to/file])
2. You should also add all the files you add to Mímir also to your `.gitignore` (otherwise it makes not mcuh sense :)
3. Add collaborators (collaborators add [name] [path/to/privateKey] [path/to/publicKey])
4. Encrypt (encrypt)
5. Mímir will then encrypt the all the files with the publicKeys (saved in the mimir.json) from all collaborators

# Decryption

1. Decrypt (decrypt [name])
2. Mímir will then decrypt all the files with the privateKey (saved on your machine) for a specific collaborator (mostly yours)

# Filenames

    - foo.json
    - configs/
        - bar.json

after encryption with the two users dominik and hawking

    - foo.json
    - foo.json.dominik.crypt
    - foo.json.hawking.crypt
    - configs/
        - bar.json
        - bar.json.dominik.crypt
        - bar.json.hawking.crypt

# Commands

* collaborators list - Lists all the collaborators
* collaborators add [name] [path/to/privateKey] [path/to/publicKey] - adds a new collaborator
* collaborators rm [name] - removes a collaborator
* files list - Lists all the files
* files add [path/to/file] - adds a new file
* files rm [path/to/file] - removes a file
* encrypt - Encrypts all the added files for all collaborators
* decrypt [name] - Decrypt a file with the defined collaborators privateKey (normaly yourself)