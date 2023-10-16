import express from "express";
import bcrypt from "bcrypt";
// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection,setDoc, getDoc,updateDoc} from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC97mjmBUouRuL2Yczvvm1Q3A6h5medCNI",
  authDomain: "artisans-72e2d.firebaseapp.com",
  projectId: "artisans-72e2d",
  storageBucket: "artisans-72e2d.appspot.com",
  messagingSenderId: "731608420768",
  appId: "1:731608420768:web:c2d5fec19d0928222814c5"
};



// //init server
 const app=express();

// // Initialize Firebase

const firebase = initializeApp(firebaseConfig);
const db=getFirestore();



//middlewares
app.use(express.static("public"));
app.use(express.json())//enable form sharing

//routes
//home route
app.get('/',(req,res)=>{
    res.sendFile("index.html",{root: "public" })
})
//signup
app.get('/signup',(req,res)=>{
    res.sendFile("signup.html",{root: "public" })

 })
app.post('/signup',(req,res)=>{
   const{ name, email,password,number,tac}=req.body;
   //form validations 
   if(name.length < 3){
    res.json({'alert':'name must be  3 letters long'});
    
    } else if(!email.length){
        res.json({'alert': 'enter your email'});
    }else if(password.length < 8){
        res.json({'alert': 'password must be atleast 8 letter long'});
    }
    else if(number.length < 10){
        res.json({'alert': 'invalid number, Enter a valid one'});
        console.log(number.length);
     }
    
    else if(!tac){
     res.json({'alert':'please accept the terms and conditions'});
        }
        else{
            //store the data in db
            const users=collection(db, "users");
            getDoc(doc(users, email)).then(user=>{
                if(user.exists()){
                    return res.json({'alert':'email already exists'})
                }else{
                    //encrypt the password
                    bcrypt.genSalt(10,(err,salt)=>{
                        bcrypt.hash(password,salt,(err,hash)=>{
                            req.body.password=hash;
                            req.body.seller=false;
                            //set the doc
                            setDoc(doc(users,email),req.body).then(data=>{
                                res.json({
                                    name:req.body.name,
                                    email:req.body.email,
                                    seller:req.body.seller,
                                })
                            })
                        })
                    })
                }
            })
        }
})
// //404 route
app.get('/404',(req,res)=>{
    res.sendFile("404.html",{root:"public"})
})
app.use((req,res)=>{
    res.redirect('/404')
})
app.listen(3000,()=>{
    console.log('listening on port 3000');
})