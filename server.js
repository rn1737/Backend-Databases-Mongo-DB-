const express = require('express'); 
const app = express();  
const db=require('./db'); 
const passport=require('passport'); 
const LocalStrategy=require('passport-local').Strategy;

const person=require('./models/person');

const bodyParser=require('body-parser');
app.use(bodyParser.json()); 

// MIDDLE WARE FUNCTIONS to hit the show time // 
const logRequest=(req,res,next)=>{ 
    console.log(`[${new Date().toLocaleString()}] Request Made to:${req.originalURL}`); 
    next(); // Move on the next Phase 
}  

passport.use(new LocalStrategy(async (USERNAME, password, done) => {
    // authentication logic error 
    try {
        console.log('Received credentials:', USERNAME, password);
        const user = await person.findOne({ username: USERNAME });
        if (!user) 
            return done(null, false, { message: 'Incorrect username.' });

        const ispasswordMatch = await user.comparepassword(password);
        if (ispasswordMatch) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Incorrect password' });
        }

    } catch (err) {
        return done(err);
    }
}));


app.use(passport.initialize()); 


app.use(logRequest); 
app.get('/', passport.authenticate('local',{session:false}), function(req, res) { 
    res.send('Welcome to my hotel... how can I help you?');
});  

const menuitem=require('./models/menuitem'); 



app.post('/person', async (req, res) => {
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


// get method to get the person 
app.get('/person',async(req,res)=>{ 
    try{ 
        const data=await person.find(); 
        console.log('data fetched');
        res.status(200).json(data);
    } catch(err){ 
        console.log(err);
        res.status(500).json({error:'Internal server error'});
    }
})


app.get('/Rice', (req, res) => { 
    res.send('Sure sir, I would love to take your order for rice.');
}); 


app.get('/idli', (req, res) => { 
    var customized_idli = { 
        name: 'rava idli',
        size: '10 cm diameter',
        is_sambhar: true, 
        is_chutney: true,
    };
    res.send(customized_idli);
});

app.post('/items', (req, res) => { 
    // Logic to handle saving data should be implemented here
    res.send('Data is saved');
});

app.get('/person/:workType',async(req,res)=>{ 
    try{ 
        const workType=req.params.workType; // Extract the work type from the URL parameter
        if(workType=='chef' || workType=='manager' || workType=='waiter'){
            const response=await person.find({work:workType});
            console.log('response fetched');
            res.status(200).json(response);
        }else{ 
            res.status(400).json({error:'Invalid work type'});
        }
    } catch(err){ 
        console.log(err);
        res.status(500).json({error:'Internal server error'});
    }
})

// import the router files 
const personroutes=require('./routes/personroutes'); 

// use the routers // 
app.use('/person',personroutes); 


const port = 525; // Change the port number
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 
