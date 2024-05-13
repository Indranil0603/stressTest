const dropboxV2Api = require('dropbox-v2-api');
const dropbox = dropboxV2Api.authenticate({
    token: 'token'
});

const sharedFolderLink = 'https://www.dropbox.com/sh/nx3tnilzqz7df8a/AAAYlTq2tiEHl5hsESw6-yfLa?e=1&dl=0';

const sharedFolderId = sharedFolderLink.match(/\/sh\/(.*)\//)[1];
console.log(sharedFolderId)

function downloadFilesFromFolder(folderPath) {
    dropbox({
        resource: 'files/download',
        parameters: {
            path: `/${sharedFolderId}${folderPath}` 
        }
    }, (err, result, response) => {
        if (err) {
            return console.error(`Error downloading files from folder '${folderPath}':`, err);
        }
        result.entries.forEach(file => {
            
            dropbox({
                resource: 'files/download',
                parameters: {
                    path: file.path_display
                },
                download: true
            }, (err, result, response) => {
                if (err) {
                    return console.error('Error downloading file:', err);
                }
                console.log(`Downloaded file: ${file.name}`);
            });
        });
    });
}

downloadFilesFromFolder('/atcoder_testcases/2019ddccqual/A/in');
