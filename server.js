const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var { mongoose } = require("./db/mongoose");
var { User } = require("./model/User");
var { TravelList } = require("./model/TravelList");
const jwt = require('jsonwebtoken')
const config = require('config')


var cors = require("cors");
const auth = require("./middleware/auth");
const { status } = require("express/lib/response");
app.use(cors());
app.use(bodyParser.json()).use(
    bodyParser.urlencoded({
      extended: true
    })
  );

// app.use(app.router)
mongoose.connection.once('open', function () {
  console.log('MongoDB database connection established successfully')
})


app.post("/api/auth/register", async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const phone = req.body.phone;
    const gender = req.body.gender;
    const address = req.body.address;

    //find user exist or not 
    const data = await User.find({ email });
  
    try{
      console.log('NEW LOGIN')

      console.log(email)  
  
      if (data.length <= 0) {
        var user = new User({
          username,
          email,
          phone,
          gender,
          address
        });

        await user.save();

        //Generate payload
            const payload = {
                user:{
                    id:email
                }
            } 
            jwt.sign(payload, config.get('jwtSecret'),{        
                expiresIn:360000 
              }, (err,token)=>{
                 if(err) throw err;
                 res.json({token});
                console.log('Sign in',token)
              })

  
      } else {

         const payload = {
                user:{
                    id:email
                }
            } 
            jwt.sign(payload, config.get('jwtSecret'),{        
                expiresIn:360000 
              }, (err,token)=>{
                 if(err) throw err;
                 console.log(token)
                 res.json({token});
              })
       }
    }
    catch (error) {
      res.status(500).send('Something broke!')
    }
  });


  app.get('/allTravelList', auth, async(req,res)=>{
     // get auth
     const email = req.email.id;
     console.log(email)
     if(email){

        try {
          const result = await TravelList.find({});
          res.json(result)
        } catch (error) {
          
        }

     } else {
      res.sendStatus(404, "Email not found");

     }
  })


  app.post('/addTravelList', auth, async(req,res)=>{
    // get auth
    const email = req.email.id;
    console.log(email)
    // Get travel details 
   
// {
//   "title": "London",
//   "description": "Planing to travel london, anyone up?",
//   "travelDate": "12th March",
//   "lat": 34,
//   "lng":34,
//   "status":"Fixed"
// }
    const checkEmail = User.find({email});

    if (checkEmail) {

      const marked_by = email;
      const title = req.body.title;
      const description = req.body.description;
      const travelDate = req.body.travelDate;
      const lat = req.body.lat;
      const lng = req.body.lng;
      const status = req.body.status;
      try {
          const data = new TravelList({
              marked_by,title,description,travelDate,lat,lng,status
          })

          const result = await data.save()
          console.log("Result", result);
          res.json(result);
      } catch (e) {
        console.log(e)
          res.sendStatus(404, "Error");
      }
  } else {
      res.sendStatus(404, "Email not found");
  }
    
  })


  //remove traevl list
app.delete("/removeTravelList/:id", auth, async(req,res)=>{
  const email = req.email.id;
  const data = await User.find({ email });
  try {
    if(data){
          const Tid = await TravelList.findByIdAndDelete(req.params.id);
          console.log("Deleted" ,Tid)
          res.json("Deleted")
    }
    
  } catch (error) {
    console.log(e)
    res.sendStatus(404, "Error while finding memes");
  }

   
})



  // Add travel buddies 
  app.post("/addTravelBuddies/:travelId",auth,  async(req,res)=>{
    const email = req.email.id;
    // const travelId = "625ec6347f98d70d78d07e22";
    
    console.log("Found from token", email);

    const checkEmail = await User.find({email});

    if(checkEmail){
       const resultName = await User.find({email}, {username:1})
       const name = resultName[0].username
       console.log(name);

       let dataBuddy = {
         name,email
       }
       console.log(dataBuddy)

    //    const checkIfBudyy = await TravelList.find({ members: { 
    //     $elemMatch: { email: email } 
    //  }})

     
    //  if(!checkIfBudyy) {
       console.log("token from params", req.params.travelId)
       const result = await TravelList.findByIdAndUpdate({_id:req.params.travelId},{$push:{
        buddies:dataBuddy
        }})
        console.log("Check result", result)
        res.json(result)
  
      //  console.log(result)
       
    //  }



    } else {
      res.sendStatus(404, "Email not found");

    }
  })


  






// Add travel list









const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`running on ${port}`);
});
