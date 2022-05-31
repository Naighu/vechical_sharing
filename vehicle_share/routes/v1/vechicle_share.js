const express = require('express');
const router = express.Router();
const Journey = require('../../models/journey')
const resp = require('./data/response')
const { validateJourney } = require('./middlewares/validator')


let getSections =function(route) {
    return new Promise(function(resolve,reject) {
        const { spawn } = require('child_process');

        const pyProg = spawn('python3', ['/home/naighu/Documents/node_projects/car_pooling/vehicle_share/routes/v1/helpers/get_sections.py',JSON.stringify(route)]);
        
        pyProg.stdout.on('data', function(sections) {

           
            resolve(JSON.parse(sections));  
        });

        pyProg.stderr.on('data', (data) => {

            reject(data);
        });
    })
}

router.post("/add-route",validateJourney,(req,res) => {

    getSections(req.body.route["geometry"]).then(sections => {

        let journey = new Journey();
        for(let[key,value] of Object.entries(req.body)) {
            journey[key] = value;
        }

        journey.userid = req.user._id;
        journey.sections = sections["sections"];
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

module.exports = router;