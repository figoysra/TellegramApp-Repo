require ('dotenv').config()

const env = {
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    JWT_SECRET: process.env.JWT_SECRET,
    EMAIL_PASS: process.env.EMAIL_PASS,
    PORT: process.env.PORT,
};
module.exports = env