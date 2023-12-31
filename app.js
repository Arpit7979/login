import 'dotenv/config'
import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import encrypt from "mongoose-encryption"
import md5 from 'md5'
import bcrypt from "bcrypt"
const saltRounds = 10;

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
await mongoose.connect('mongodb://127.0.0.1:27017/storage').
catch(error => handleError(error))

const userSchema = new mongoose.Schema (
    {
        email:String,
        password:String
    }
);


 export const User = new mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
    res.render("home.ejs");
});

app.get("/login",(req,res)=>{
    res.render("login.ejs");
});

app.get("/register",(req,res)=>{
    res.render("register.ejs",{output:""});
});

app.post("/register",async (req,res)=>{

    bcrypt.hash(req.body["password"], saltRounds, function(err, hash) {
        const newUser = new User({
            email:req.body["username"],
            password:hash
        }) ;
        newUser.save()
        .then(res.render("secrets.ejs"))
    });

});

  

app.post("/login",async (req,res)=>{
      const email =  req.body["username"];
      const password = req.body["password"];

      try {
        const passwordFound = (await User.findOne({email:email})).password
        
       
        bcrypt.compare(password, passwordFound, function(err, result) {
            if(result === true){
                res.render("secrets.ejs");
            }
        });
        
    } catch (err) {
        res.render("register.ejs",{output:"Register first"});
    }

  
});

app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
});













