//system database
const isProduction=process.env.NODE_ENV==="production";
//if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
//}
//require("dotenv").config();
const { Pool }=require('pg');

const connectionString=`postgresql://${process.env.DB_USER}${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
const client=new Pool({
    connectionString:isProduction? process.env.DATABASE_URL:connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});
module.exports={client};
