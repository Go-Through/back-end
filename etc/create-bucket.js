const AWS = require('aws-sdk');

const ID = 'Access key ID';
const SECRET = '';
const BUCKET_NAME = '';
const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
});

const params = {
  Bucket: BUCKET_NAME,
  CreateBucketConfiguration: {
    // set your region here
    LocationConstraint: 'ap-northeast-2',
  },
};

s3.createBucket(params, (err, data) => {
  if (err) console.error(err.message);
  else console.log('Bucket Created Successfully', data.Location);
});
