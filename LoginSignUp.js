const bodyParser = require("body-parser")
const express = require("express")
const app = express()
app.use(bodyParser.json())
const PORT = 7000
const readline = require("readline-sync")
const jwt = require("jsonwebtoken")



const knex = require('knex')({
    client : "mysql",
    connection : ({
        host : "localhost",
        user : "root",
        password : "Neha@1234",
        database : "LoginSignDB"
    })
})

knex.schema.hasTable("loginsignTB").then((existe) => {
    if(!existe){
        return knex.schema.createTable("loginsignTB",(t) =>{
            t.increments("id").primary()
            t.string("username"),
            t.string("email"),
            t.string("password")
        })
    }
})


app.post("/signup",(req,res) => {
    knex.select("email").from("loginsignTB").where("email", req.body.email)
    .then((data) => {
        if (data.length > 0){
            for (var i=0; i<data.length; i++){
                if (data[i]["email"] === req.body.email){
                    console.log("your sign up  is allready ")
                    res.send("your sign up  is allready ")
                }
            }
        }else {
            if (data.length < 1){
                knex("loginsignTB")
                    .insert({
                        username : req.body.username,
                        email : req.body.email,
                        password : req.body.password
                    })
                    .then(() => {
                        console.log("sign up done")
                        res.send("sign up done")
                    })
                    .catch((err) =>{
                        console.log(err)
                        res.send(err)
                    })
            }
        }
    })
    .catch((error) =>{
        console.log(error)
        res.send(error)
    })
})


app.post("/login",(req,res) => {
    var a = false
    var email = req.body.email
    var password = req.body.password
    knex.select("*").from("loginsignTB")
    .then((data) => {
        for(i of data){
            if(i.email == email && i.password == password){
                a = true
                const token = jwt.sign({email : i["email"],password : i["password"]},"nehaloginsignup")
                // res.send({Token : token})
                res.send("login done")
            }
        }
        if(a){
            console.log("login done")
        }else{
            console.log("invalid details....")
        }
    })
    .catch((errr) => {
        console.log(errr)
        res.send(errr)
    })
    
})




app.listen(PORT,() => {
    console.log(`server is running on ${PORT}`)
})

