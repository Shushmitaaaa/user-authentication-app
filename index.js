//create a midlware called auth that verifies if a user is logged in and ends the request early if the user is not logged in.
const express=require("express")
const app= express();
const jwt=require('jsonwebtoken')
JWT_SECRET=process.env.JWT_SECRET
const cors=require("cors")

let users=[];

app.use(cors())
app.use(express.json())


//returning frontend part also on the same port as backend to avoid cors(/ means get request sent to localhost)
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname + 'index.html'))
})


app.post('/signup',function(req,res){
    const username=req.body.username;
    const password=req.body.password

    users.push({
        username:username,
        password:password
    })

    res.json({
        message:"Successfully signed up"
    })
})

app.post('/signin',function(req,res){
    const username=req.body.username;
    const password=req.body.password

    let founduser=null;

    for(let i=0;i<users.length;i++){
        if(users[i].username===username && users[i].password===password){
            founduser=users[i];
        }
    }

    if(founduser){
        const token=jwt.sign({
            username:username
        },JWT_SECRET);
        res.json({
            token:token
        })
    }else{
        return res.status(401).json({
            message:"eroorrrr"
        })
    }
})

//middleware using it for authentication
function auth(req,res,next){
    const token=req.headers.token;
    const decode=jwt.verify(token,JWT_SECRET);
    

    if(decode.username){
        req.username=decode.username//modify the req and then send it to next func
        next()
    }else{
        return res.status(401).json({
            message:"Invalid or expired"
            
        })
    }
}

function details(req,res){
    // const token=req.headers.token;
    // const decode=jwt.verify(token,JWT_SECRET);
    // const username=decode.username;
    let founduser=null;
    for(let i=0;i<users.length;i++){
        if(users[i].username===req.username){
            founduser=users[i];
        }
    }
    res.json({
        username:founduser.username,
        password:founduser.password
    })
}

app.get('/me',auth,details);

app.listen(3000)
