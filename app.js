const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");

//console.log(date);

const app = express();

const items = [];
const workItems = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"))

app.get("/", function(req, res) {


  res.render("list", {
    listTitle: date.getDate(),
    newListItems: items
  })
});


app.post("/", function(req, res) {
//console.log(req.body);
  const item = req.body.newItem;
  if(req.body.List==="Work"){
  workItems.push(item);
  res.redirect("/work");
}else{
  items.push(item);

  res.redirect("/");
}

})

app.get("/work",function(req,res){
  res.render("list",{listTitle:"Work",newListItems:workItems});
})
app.post("/work",function(req,res){
  const item = req.body.newItem;
  workItems.push(item);

  res.redirect("/work");
});

app.get("/about",function(req,res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("server started at port 3000");
});