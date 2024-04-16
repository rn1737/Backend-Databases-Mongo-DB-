const mongoose = require('mongoose');
const bcrypt=require('bcrypt'); 

// define the person schema // 
const personSchema = new mongoose.Schema({ 
    name: { 
        type: String, 
        required: true,
    },

    age: { 
        type: Number  // Corrected 'number' to 'Number'
    },

    work: { 
        type: String,
        enum: ['chef', 'waiter', 'manager'],
        required: true,
    },

    mobile: {  // Corrected 'Mobile' to 'mobile' (lowercase)
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    address: { 
        type: String,
    },

    salary: { 
        type: Number,  // Corrected 'number' to 'Number'
        required: true,
    },

    username:{ 
        required:true, 
        type:String
    }, 

    password:{ 
        required:true, 
        type:String
    },
});  

personSchema.pre('save',async function(next){ 
    const person=this; 

    // Hast the password only if it has been modified (or if new) 
    if(!person.isModified('password')) return next(); 
    try{ 
        // hash password generation // 
        const salt=await bcrypt.genSalt(10); 

        // hash 
        const hashedpassword=await bcrypt.hash(person.password,salt); 

        // Override the plain password with the hashed one 
        person.password=hashedpassword;
        next();
    }catch(err){ 
        return next(err);
    }
})  

personSchema.methods.comparePassword=async function(candidatepassword){ 
    try{ 
        // USe bcyrpt to compare the provided password with the hashed password 
        const isMatch=await bcrypt.compare(candidatepassword,this.password);
        return isMatch;
    }catch(err){
        throw err; 
    }
}



// create person Model 
const Person = mongoose.model('Person', personSchema);
module.exports = Person; 