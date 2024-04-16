const express=require('express'); 
const router=express.Router(); 
const person=require('./../models/person'); 

router.post('/', async (req, res) => {
    try {
        const data = req.body; // assuming a request body contains the personal data 

        // create a new person to the database 
        const newPerson = new person(data); // <-- corrected variable name

        // save the new person to the database 
        const response = await newPerson.save(); // <-- corrected variable name
        console.log('data saved');
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})    

router.get('/',async(req,res)=>{ 
    try{ 
        const data=await person.find(); 
        console.log('data fetched');
        res.status(200).json(data);
    } catch(err){ 
        console.log(err);
        res.status(500).json({error:'Internal server error'});
    }
})

router.put('/.id',async(req,res)=>{ 
    try{ 
        const personId=req.params.id; // extract the id from the URL parser
        const updatedPersonData=req.body // updated data for the person 

        const response=await Person.findByIdAndUpdate(personId,updatedPersonData,{ 
            new:true, // Return the updates document // 
            runValidators:true, // Run Mongoose Validation // 
        })

        if(!response){
            return res.status(404).json({error:'Person not found'}); 
        } 

        console.log('data updated');
        res.status(200).json(response); 
        }catch(err){  
        console.log(err);
        res.status(500).json({error:'Internal Server Error'}); 
    }
    }) 

    router.delete('./id',async(req,res)=>{ 
        try{ 
            const personId=req.params.id; // Extract the person id from the url parameter 

            // Assuming you have a person model // 
            const response=await person.findByIdAndRemove(personId); 
            if(!response){
                return res.status(404).json({error:'Person not found'});
            }
            console.log('data delete');
            res.status(200).json({message:'Person deleted Successfully'});
        }catch(err){ 
            console.log(err); 
            res.status(500).json({error:'Internal Server Error'}); 
        }
    })

module.exports=router;

