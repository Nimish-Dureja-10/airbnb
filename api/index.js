const express = require('express');
const cors = require('cors');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const imageDownloader = require('image-downloader');
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User.js');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
const fs = require('fs');

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'dhiehiq3ehdjkqahfe94r';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/uploads",express.static(__dirname+'/uploads'))
app.use(cors({
    credentials:true,
    origin:"http://127.0.0.1:5173"
}));

mongoose.connect(process.env.MONGO_URL);

function getUserDataFromReq(req){
    return new Promise((resolve,reject)=>{
        jwt.verify(req.cookies.token,jwtSecret,{},async (err,userData)=>{
            if(err) throw err;
            resolve(userData);
        })
    })
}

app.get("/",(req,res)=>{
    res.json("Backend Hosted Successfully");
)};

app.get("/test",(req,res)=>{
    res.json("Test Ok")
});

app.post("/register",async (req,res)=>{
    const {name,email,password} = req.body;
    try{
        const userDoc = await User.create({
            name,
            email,
            password:bcrypt.hashSync(password,bcryptSalt)
        });
        res.json(userDoc);
    }catch(error){
        console.log(error);
        res.status(422).json(error);
    }
});

app.post("/login",async (req,res)=>{
    try {
        const {email,password} = req.body;
        const userDoc = await User.findOne({email});
        if(userDoc){
            const passwordOk = bcrypt.compareSync(password,userDoc.password);
            if(passwordOk){
                jwt.sign({email:userDoc.email,id:userDoc._id},jwtSecret,{},(err,token)=>{
                    res.cookie('token',token).json(userDoc);
                });
            }else{
                res.status(422).json('Invalid Password')
            }
        }else{
            res.json("Invalid Username or Password");
        }

    } catch (error) {
        console.log(error);
    }
});

app.get("/profile", (req,res) => {
    const {token} = req.cookies;
    if(token){
        jwt.verify(token,jwtSecret,{},async (err,userData)=>{
            if (err) throw err;
            const {name,email,_id} = await User.findById(userData.id)
            res.json({name,email,_id});
        });
    }else{
        res.json(null);
    }
});

app.post("/logout",(req,res)=>{
    res.cookie('token','').json(true);
});

app.post("/upload-by-link",async (req,res)=>{
    const {link} = req.body;
    const newName = "photo" + Date.now() + '.jpg';
    await imageDownloader.image({
        url:link,
        dest: __dirname+'/uploads/' + newName
    });
    res.json(newName);
});

const photoMiddleware = multer({dest: "uploads"});
app.post("/upload",photoMiddleware.array('photos',100),(req,res)=>{
    const uploadedFiles = [];
    for(let i=0;i<req.files.length;i++){
        const {path,originalname} = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length-1];
        const newPath = path + "." + ext;
        fs.renameSync(path,newPath);
        uploadedFiles.push(newPath.replace("uploads/",""));
    }
    res.json(uploadedFiles);
});

app.post("/places",(req,res)=>{
    const {token} = req.cookies;
    const {
        title,address,addedPhotos,description,
        extraInfo,perks,checkIn,checkOut,maxGuests,price
    } = req.body;
    jwt.verify(token,jwtSecret,{},async (err,userData)=>{
        if (err) throw err;
        const placeDoc = await Place.create({
            owner:userData.id,
            title,address,photos:addedPhotos,description,
            extraInfo,perks,checkIn,checkOut,maxGuests,price
        });
        res.json(placeDoc);
    });
});

app.get("/user-places",(req,res)=>{
    const {token} = req.cookies;
    jwt.verify(token,jwtSecret,{},async (err,userData)=>{
        const {id} = userData;
        res.json(await Place.find({owner:id}))
    });
});

app.get("/places/:id",async (req,res)=>{
    const {id} = req.params;
    res.json(await Place.findById(id));
});

app.put('/places',async (req,res)=>{
    const {token} = req.cookies;
    const {
        id,title,address,addedPhotos,description,
        extraInfo,perks,checkIn,checkOut,maxGuests,price
    } = req.body;
    jwt.verify(token,jwtSecret,{},async (err,userData)=>{
        const placeDoc = await Place.findById(id);
        if(userData.id === placeDoc.owner.toString()){
            placeDoc.set({
                title,address,photos:addedPhotos,description,
                extraInfo,perks,checkIn,checkOut,maxGuests,price
            });
            await placeDoc.save();
            res.json('ok');
        }
    });
});

app.get("/places",async (req,res)=>{
    res.json(await Place.find());
});

app.get("/place/:id",async (req,res)=>{
    const {id} = req.params;
    res.json(await Place.findById(id));
});

app.post("/bookings",async (req,res)=>{
    const userData = await getUserDataFromReq(req);
    const {place,checkIn,checkOut,numberOfGuests,name,phone,price} = req.body;
    Booking.create({
        place,checkIn,checkOut,numberOfGuests,name,phone,price,user:userData.id
    }).then((doc)=>{ 
        res.json(doc);
    }).catch((err)=>{
        throw err;
    });
});

app.get("/bookings",async (req,res)=>{
    const userData = await getUserDataFromReq(req);
    res.json(await Booking.find({user:userData.id}).populate('place'))

})

app.listen(4000,()=>{
    console.log(`server is running on port 4000`);
});


// mZPhuG31Fs3WFpTW
