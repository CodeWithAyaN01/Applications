import('dotenv/config')
const { defineConfig } = require('drizzle-kit')

export const config = defineConfig({
    out: './drizzle',
    schema: './models/index.js', // check 
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
})

module.exports = config