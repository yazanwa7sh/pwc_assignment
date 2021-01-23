//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const homeStartingContent = "What a year 2020 has been for every one of us. For the first time in human history, every nation around the world is working on the same problem. The leaders who earned our trust during these challenging times were the ones who spoke to our hearts, not just our heads. They harnessed the power of stories, our most persuasive technology.";
const aboutContent = "Blog Website was launched in January 2021 with a record-breaking high wire walk across the River Thames. The festival and associated activities is operated by Thames Festival Trust, an independent charity.";
const contactContent = "Upcoming events and launches at Totally Thames, Rivers of the World, The Story of Water and other Thames Festival Trust projects.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

const adminSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

const Admin = mongoose.model("Admin", adminSchema);



app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  console.log(req.body);

const newAdmin = new Admin({
  username: req.body.username,
  email: req.body.email,
  password: md5(req.body.password)
});
console.log(newAdmin + "new admin");
newAdmin.save().then(user => {
  console.log("You are now registered and can log in");
  res.redirect('/login');
})
.catch( console.log("err"));
});


app.get("/login", function(req, res){
  res.render("login");
});

app.post("/login", function(req, res){
  const email = req.body.email;
  const password = md5(req.body.password);

  Admin.findOne({email: email}, function(err, foundUser){
    if(err) {
      console.log(err);
    } else{
      if(foundUser){
        if(foundUser.password === password){
            res.redirect('/compose');
        }
      }
    }
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
