const express = require('express');
var bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const port = 80;


const data = [
    {
        name:'mahdi',
        age:20,
        city:'Oshkosh'

    },
    {
        name:'popo',
        age:28,
        city:'Chicago'

    }
]

app.listen(port, ()=>{
    console.log(`listing on port:${port}`);
});

app.post("/",(req,res)=>{
    console.log(req.body);
    res.json({message:"ok"});
});

app.get("/",(req,res)=>{
    //res.setHeader('Content-Type', 'application/json');
    res.send(data);
});
