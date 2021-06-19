// const mysql = require("mysql")

// const knex = require('knex')({
//     client : "mysql",
//     connection : ({
//         host : "localhost",
//         user : "root",
//         password : "Neha@1234",
//         database : "LoginSignDB"
//     })
// })

// knex.schema.hasTable("LoginSignTB").then((existe) => {
//     if(!existe){
//         return knex.schema.createTable("LoginSignTB",(t) =>{
//             t.increments("id").primary()
//             t.string("name"),
//             t.string("password")
//         })
//     }
// })

// module.exports = knex;
