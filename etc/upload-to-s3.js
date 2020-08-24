const AWS = require('aws-sdk');

const BUCKET_NAME = '';
const s3 = new AWS.S3({ accessKeyId: '', secretAccessKey: '' });
const uploadFile = (fileName, fileContent) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: 'test.txt', // File name you want to save as in S3
    Body: fileContent,
  };

  s3.upload(params, (err, data) => {
    if (err) { throw err; }
    console.log(`File uploaded Successfully. ${data.Location}`);
    return data.Location;
  });
};

module.exports = {
  uploadFile,
};
