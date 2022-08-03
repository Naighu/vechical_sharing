const express = require('express');
const router = express.Router();
const fs = require('fs')
//const {getDistance} = require('geolib')
const driverJourney = require('../../models/journey')
const seekerJourney = require('../../models/seeker_journey')
const resp = require('./data/response')
const { validateJourney, validateSeekerJourney } = require('./middlewares/validator');



let getSections =function(route) {
    return new Promise(function(resolve,reject) {
        const { spawn } = require('child_process');

        const pyProg = spawn('python', ['E:/MiniProject/vehicle_share/routes/v1/helpers/get_sections.py',JSON.stringify(route)]);
        
        pyProg.stdout.on('data', function(sections) {

           resolve(JSON.parse(sections));  
        });

        pyProg.stderr.on('data', (data) => {
            reject(data);
        });
    })
}

router.post("/add-route",validateJourney, (req,res) => {

    getSections(req.body.route["geometry"]).then(sections => {

        let journey = new driverJourney();
        for(let[key,value] of Object.entries(req.body)) {
            journey[key] = value;
        }

      
// if(data == null) {
//     res.status(200).json({code: 400,message:"Vechicle Does not exist"})
//     return;
// }
     
        journey.userid = req.user._id;
        journey.sections = sections;
        journey.save().then(data => {
            res.status(201).json({code: 200,message: "Data inserted",result: {joureny_id: data._id.toString()}});
        }).catch(err => {
            console.log(err);
            res.status(200).json({code: 500,message: resp[500]});
        })
    }).catch(err => {
        console.log("error");
        console.log(Buffer.from(err).toString());

        res.status(200).json({code: 500,message:"Could not generate the sections"})
    })
})

router.get("/active-route",(req,res)=> {
    driverJourney.find({"user_id": req.user._id}).then(data => {
        
      
        res.status(201).json({code: 200,message: "Data Listed",result: data});
    })
})


router.post("/seeker-add-route",validateSeekerJourney,(req,res) => {

    getSections(req.body.route["geometry"]).then(sections => {

        let journey = new seekerJourney();
        for(let[key,value] of Object.entries(req.body)) {
            journey[key] = value;
        }

      
// if(data == null) {
//     res.status(200).json({code: 400,message:"Vechicle Does not exist"})
//     return;
// }
     
        journey.userid = req.user._id;
        journey.sections = sections;
        journey.save().then(data => {
            res.status(201).json({code: 200,message: "Data inserted",result: {joureny_id: data._id.toString()}});
        }).catch(err => {
            console.log(err);
            res.status(200).json({code: 500,message: resp[500]});
        })
    }).catch(err => {
        console.log("error");
        console.log(Buffer.from(err).toString());

        res.status(200).json({code: 500,message:"Could not generate the sections"})
    })
})

router.get("/seeker-active-route",(req,res)=> {
    seekerJourney.find({"user_id": req.user._id}).then(data => {
        
      
        res.status(201).json({code: 200,message: "Data Listed",result: data});
    })
})

router.get("/nearby-driver", (req,res) => {

    driverJourney.find().then(data => {
        if(data != null)
        {
            totlen = data.length
            const result = []
            for(let i=0;i<totlen;i++){
                result.push(data[i].userid)
            }
            res.status(200).json({code:200, message:"Drivers Found", result:result})
        }
        else{
            res.status(201).json({code:201, message:"Drivers Not Found"})
        }
    }).catch(err => {
        res.status(400).json({code:400, message:"Something went wrong", result:err})
    })
    
    
    // driverJourney.find().then(data => {
    //     totlen = data.length
    //     for(i=0;i<totlen;i++)
    //     {
    //         const driverstart = data[i].route.geometry
    //         const driverid = data[i]._id
    //         //console.log(driverstart)

    //         seekerJourney.find({userid:req.user._id}).then(data => {
    //             if(data != null)
    //             {
    //                 var flag = 0
    //                 console.log(data)
    //                 const seekerstart = data[0].route.geometry
    //                 //console.log(seekerstart)
    //                 seekerlen = seekerstart.coordinates.length
    //                 driverlen = driverstart.coordinates.length
    //                 if (driverlen>=seekerlen)
    //                 {
    //                     for(i=0;i<seekerlen-1;i++)
    //                     {
                            
    //                         const distance = getDistance(
    //                             { latitude: driverstart.coordinates[i][0], longitude: driverstart.coordinates[i][1] },
    //                             { latitude: seekerstart.coordinates[i][0], longitude: seekerstart.coordinates[i][1] }
    //                         )
    //                         //console.log(distance/1000)
    //                     }

    //                     const seekerstartposlat = seekerstart.coordinates[0][0]
    //                     const seekerstartposlong = seekerstart.coordinates[0][1]
    //                     const seekerendposlat = seekerstart.coordinates[seekerlen-1][0]
    //                     const seekerendposlong = seekerstart.coordinates[seekerlen-1][1]
    //                     for(i=0;i<driverlen;i++)
    //                     {
    //                         //console.log("Hi", driverstart.coordinates[i])
    //                         if(seekerstartposlat == driverstart.coordinates[i][0] && seekerstartposlong == driverstart.coordinates[i][1])
    //                             {
    //                                 //console.log("Hekkoafas")
    //                                 for(j=0;j<driverlen;j++){
    //                                     if(seekerendposlat == driverstart.coordinates[j][0] && seekerendposlong == driverstart.coordinates[j][1])
    //                                     {
    //                                         flag = flag+1
    //                                         res.status(200).json({code:200, message:"Driver Found", result:driverid})
    //                                         break
    //                                     }
    //                                 }
    //                             }
                            
    //                     }
    //                     if(flag == 0){
    //                             res.status(200).json({code:400, message:"Driver Not Found"})
    //                     }
    //                 }
    //                 else{
    //                     res.status(200).json({code:400, message:"Driver Not Found"})
    //                 }
    //             }
    //             else{
    //                 res.status(200).json({code:400, message:"Seeker Not Found"})
    //             }
    //         }).catch( err => {
    //             console.log("something went wrong"+ err)
    //         })
            
    //     }

    // }).catch( err => {
    //     console.log("something went wrong"+ err)
    // })

    
})
router.get('/ride-request/:id', (req,res) => {
    let id = req.params.id.split("=")[1]
    driverJourney.find({_id:id}).then(data =>{
        if(data[0] != null){
            if(!data[0].reqPending.includes(req.user._id)){
                data[0].reqPending.push(req.user._id)
                data[0].save()
                res.status(200).json({code:200, message:"Ride Request Send Successfully"})
            }
            else{
                res.status(200).json({code:400, message:"Request Already Sent"})
            } 
        }
        else{
            res.status(200).json({code:400, message:"Journey Not Found"})
        }
    }).catch(err => {
        res.status(200).json({code:500, message:"Something went wrong", error:err})
    })
})
router.post('/ride-accepted', (req,res) => {
    driverJourney.find({user_id: req.user._id}).then(data =>{
        totlen = data.length
        const seeker_id = req.body.seeker_id
        if(data[0] != null)
        {
            for(let i=0; i<totlen; i++){
                for(let j=0; j<totlen; j++)
                {
                    if(data[i].reqPending[j].toString() === seeker_id){
                        data[i].reqAccepted.push(data[i].reqPending[j])
                        data[i].reqPending.splice(j,1)
                        data[i].save()
                        res.status(200).json({code:200, message:"Ride Accepted", result:seeker_id})
                        break;
                    }
                }
            }
            
        }   
    }).catch(err => {
        console.log(err)
        res.status(400).json({code:400, message:"Something Went Wrong", result:err})
    })
})
module.exports = router;