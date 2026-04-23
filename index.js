const express = require("express");
const app = express();
const port = process.env.PORT || 8080;    //  for render const port:8080 is not working 
const path = require("path");

const { v4 : uuidv4 } = require('uuid');   // v4 -> we are using version 4 to create random id 
// generates id like:'9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

const methodOverride = require("method-override");    // using method override package 
app.use(methodOverride("_method"));

app.set("view engine","ejs");                          // ejs engine setting
app.set("views",path.join(__dirname,"views"));        // joins views folder

app.use(express.static(path.join(__dirname,"public")));    // joins public folder

app.use(express.urlencoded({extended: true}));

app.listen(port,() =>{
    console.log(`app is listening on port ${port}`);
})

app.get("/", (req,res) =>{                // root path
    res.redirect("/posts");
})

let posts = [
    {
        id : uuidv4(),                     // this function generates random id 
        username : "Aloke",
        content : "Live Love Laugh",
    },
    { 
        id : uuidv4(),                    // this function generates random id 
        username : "Rahul",
        content : "Hardwork is the key to success",
    },
    {
        id : uuidv4(),                    // this function generates random id 
        username : "Rohit",
        content : "Determination and perseverance",
    },
];

app.get("/posts", (req,res) =>{           // route to render the index.ejs file
    res.render("index.ejs",{posts});    
});
 
app.get("/posts/new", (req,res) => {        // route to add new posts
    res.render("new.ejs");
});

app.post("/posts", (req,res) => {  // route to push the new posts into the post array and go to /posts
    let {username,content} = req.body;
    let id = uuidv4();
    posts.push({ id , username , content });
    res.redirect("/posts");
});

app.get("/posts/:id", (req,res) => {        // route to show a particular post in details
    let {id} = req.params;
    let post = posts.find((p) => id === p.id);
    res.render("show.ejs" , {post});
});

app.patch("/posts/:id" , (req,res) => {   // editing the content of post and redirect to posts page
    let {id} = req.params;
    let newContent = req.body.content;
    let post = posts.find((p) => id === p.id);
    post.content = newContent;
    res.redirect("/posts");
});

app.get("/posts/:id/edit" , (req,res) => {      // route to edit posts and render edit.ejs
    let {id} = req.params;
    let post = posts.find((p) => id === p.id);
    res.render("edit.ejs" , {post});                        
});

app.delete("/posts/:id" , (req,res) => {   // route to delete post from posts array permanently
    let {id} = req.params;
    posts = posts.filter((p) => id !== p.id);
    res.redirect("/posts");
});
