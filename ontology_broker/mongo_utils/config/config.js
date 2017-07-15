const config = {
    MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost'
};
console.log(process.env.MONGODB_URL);
module.exports = config;