require('dotenv').config();
const fs = require('fs');
const path = require('path');
const dropboxV2Api = require('dropbox-v2-api');

const dropbox = dropboxV2Api.authenticate({
    token: process.env.DROPBOX_ACCESS_TOKEN
});

const sharedFolderLink = 'https://www.dropbox.com/sh/nx3tnilzqz7df8a/AAAYlTq2tiEHl5hsESw6-yfLa';

function downloadFilesFromFolder(folderPath, localFolderPath) {
    dropbox({
        resource: 'files/list_folder',
        parameters: {
            shared_link: { url: sharedFolderLink },
            path: folderPath
        }
    }, (err, result, response) => {
        if (err) {
            return console.error(`Error listing files in folder '${folderPath}':`, err);
        }
        console.log(response.body);
        const files = result.entries.filter(entry => entry['.tag'] === 'file');

        files.forEach(file => {
            const downloadPath = file.id // Construct download path using folderPath and file name
            const localFilePath = path.join(localFolderPath, file.name);

            dropbox({
                resource: 'files/download',
                parameters: {
                    path: downloadPath
                }
            }, (err, result, response) => {
                if (err) {
                    console.error(`Error downloading file '${downloadPath}':`, err);
                 
                } else {
                    const writer = fs.createWriteStream(localFilePath);
                    result.pipe(writer);
                    console.log(`Downloaded file: ${localFilePath}`);
                }
            });
        });
    });
}

const localFolderPath = './input'; // Specify the local folder path
if (!fs.existsSync(localFolderPath)) {
    fs.mkdirSync(localFolderPath);
}

downloadFilesFromFolder('/2019ddccqual/A/in', localFolderPath);
