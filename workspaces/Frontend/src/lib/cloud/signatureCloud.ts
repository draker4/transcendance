const cloudinary = require('cloudinary').v2;
const apiSecret = process.env.CLOUD_SECRET;

// Server-side function used to sign an upload with a couple of
// example eager transformations included in the request.
const signuploadform = () => {
  const timestamp = Math.round((new Date).getTime()/1000);

  const signature = cloudinary.utils.api_sign_request({
    timestamp: timestamp,
    eager: 'c_pad,h_300,w_400|c_crop,h_200,w_260',
    folder: process.env.CLOUD_FOLDER}, apiSecret);

  return { timestamp, signature }
}

module.exports = {
  signuploadform
}
