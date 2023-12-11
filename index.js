const express=require('express');
const mongoose=require('mongoose');
mongoose.connect("mongodb+srv://mridul:maiHOON2002@cluster0.lz02lwx.mongodb.net/?retryWrites=true&w=majority");
const cors=require('cors');
const PORT=process.env.PORT||6010;
//import user schema
const UserModel=require('./models/Schema')

const app=express();

// to access our server side in frontend
app.use(cors());

// whenever we will send our data to frontend, it will parse it to json otherwise it give us the error
app.use(express.json());

//post request
app.post("/createUser",(req,res)=>{
    UserModel.create(req.body)
    .then(users=>res.json(users))
    .catch(err=>res.json(err))
})

//get request
app.get("/",(req,res)=>{
    UserModel.find()
    .then(users=>res.json(users))
    .catch(err=>res.json(err))
})

//get user with pagination
app.get("/allUsers", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 5;
    const sortBy = req.query.sortBy || "name"; // default sorting by name

    try {
        const users = await UserModel.find()
            .sort({ [sortBy]: 1 }) // 1 for ascending, -1 for descending
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            
        const totalUsers = await UserModel.countDocuments();

        res.json({
            users,
            totalPages: Math.ceil(totalUsers / itemsPerPage),
            currentPage: page,
        });
    } catch (err) {
        res.json({ error: err.message });
    }
});
// Search Users by Name with Pagination
app.get('/searchUsers', async (req, res) => {
    const searchQuery = req.query.name;
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 6;

    try {
        const users = await UserModel.find({ name: { $regex: searchQuery, $options: 'i' } })
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage);

        const totalUsers = await UserModel.countDocuments({ name: { $regex: searchQuery, $options: 'i' } });

        res.json({
            users,
            totalPages: Math.ceil(totalUsers / itemsPerPage),
            currentPage: page,
        });
    } catch (err) {
        res.json({ error: err.message });
    }
});

// Search Users by Name without pagination
app.get('/search', async (req, res) => {
    const searchQuery = req.query.name;

    try {
        const users = await UserModel.find({ name: { $regex: searchQuery, $options: 'i' } });
        res.json(users);
    } catch (err) {
        res.json({ error: err.message });
    }
});

//get User
app.get('/getuser/:id',(req,res)=>{
    const id=req.params.id;
    UserModel.findById({_id:id})
    .then(users=>res.json(users))
    .catch(err=>res.json(err))
})

//Update User
app.put('/updateUser/:id',(req,res)=>{
    const id=req.params.id;
    UserModel.findByIdAndUpdate({_id:id},{
        name:req.body.name,
        email:req.body.email,
        age:req.body.age
    })
    .then(users=>req.jsin(users))
    .catch(err=>res.json(err))
})

//Delete User
app.delete('/deleteUser/:id',(req,res)=>{
    const id=req.params.id;
    UserModel.findByIdAndDelete({_id:id})
    .then(res=>res.json(res))
    .catch(err=>res.json(err))
})

//to run our server
app.listen(PORT,()=>{
    console.log("Server is Running");
})