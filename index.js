const express = require('express');
var bodyParser = require('body-parser');
var service = require('./messageService');
var cors = require('cors')


const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({extendxed:false}));
app.use(bodyParser.json());

const port = 8080;


app.listen(port, ()=>{
    console.log(`listing on port:${port}`);
});

app.post("/",(req,res)=>{
    const mil_seconds = req.body.delay ?? 0;
    delay(mil_seconds).then(function() {
        service.sendFcmMessage(req.body.token,req.body.type);
    });
    res.json({status:"ok"});
});

app.get("/",(req,res)=>{
    res.send(data);
});

function delay(t, v) {
    return new Promise(resolve => setTimeout(resolve, t, v));
}