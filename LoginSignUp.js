const bodyParser = require("body-parser")
const express = require("express")
const app = express()
app.use(bodyParser.json())
const PORT = 7000
const readline = require("readline-sync")
const jwt = require("jsonwebtoken")


// with knex database connection
const knex = require('knex')({
    client : "mysql",
    connection : ({
        host : "localhost",
        user : "root",
        password : "Neha@1234",
        database : "LoginSignDB"
    })
})


// knex use for create a table 
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

//sign up api to sign 
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

// login api to login 
app.post("/login",(req,res) => {
    var a = false
    var email = req.body.email
    var password = req.body.password
    knex.select("*").from("loginsignTB")
    .then((data) => {
        for(i of data){
            if(i.email == email && i.password == password){
                a = true
                // const token = jwt.sign({email : i["email"],password : i["password"]},"nehaloginsignup")
                const token = jwt.sign({"email": email,"password" : password},"nehaloginsignup")
                res.send({Token : token})
            }
        }
        if(a){
            console.log("login done")
        }else{
            res.send("invalid details....")
            console.log("invalid details....")
        }
    })
    .catch((errr) => {
        console.log(errr)
        res.send(errr)
    })
    
})


// api for take to token
app.get("/getToken",verifyToken,(req,res) => {
    jwt.verify(req.Token,"nehaloginsignup",(err,authData) => {
        if(err){
            console.log(err)
        }else{
            console.log("Successfully Login Done")
            res.send({
                verifyData : authData
            });
        };
    });
});


//function for verify the token
function verifyToken(req,res,next){
    const bearerHeader = req.headers["authorization"]
    if(bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        req.Token = bearerToken 
        next()
    }else{
        res.sendStatus(403)
    }

}



app.listen(PORT,() => {
    console.log(`server is running on ${PORT}`)
})

