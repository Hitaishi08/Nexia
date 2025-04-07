const express = require('express');
const {connectToMongoDB}  = require('./connection')
const Authrouter = require('./routes/authRoutes')
const projectroute = require('./routes/projectRoutes');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();

const reportRoutes = require('./routes/reportRoutes');

const corsOptions = {
    origin: 'http://localhost:3000',   // The frontend URL
    credentials: true,                // Allow sending cookies with requests
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
};
app.use(cors(corsOptions));
app.use(cookieParser());

const PORT = 3003
// connect to MongoDB
connectToMongoDB('mongodb://127.0.0.1:27017/projectManagement').then(()=>{
    console.log("Connected to MongoDB");
}).catch(err => console.log(err));

app.use(express.json());

app.get('/cookie-parse',(req, res) => {
    const token = req.cookies.authToken;
    if(token){
        try{
        const decoded = jwt.decode(token);
        res.status(200).json({decoded});
        }catch(err){
            console.log(err);
            res.status(500).json({message : 'Internal Server Error'});
        }
    }else{
        res.status(404).json({message : 'No cookie found'});
    }
})
app.use('/user',Authrouter);
app.use('/',projectroute);
app.use('/api/reports', reportRoutes);
app.listen(PORT,()=>console.log(`server started at ${PORT}`))