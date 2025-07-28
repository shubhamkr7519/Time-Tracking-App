const crypto = require('crypto');

exports.generateActivationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

exports.generateAuthToken = () => {
  return crypto.randomBytes(16).toString('hex');
};
