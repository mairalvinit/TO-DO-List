const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");

//require mongoose
const mongoose = require("mongoose");

const app = express();



app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/todoListDB",{useNewUrlParser: true,useUnifiedTopology:true, useFindAndModify: false });

const itemsSchema = {
  name : {
    type  : String,
    required : [true,"Not added name"],
  },
};

const Item = mongoose.model("Item",itemsSchema);

//new items

const buy = new Item({
  name : "Buy Food",
});
const cook = new Item({
  name : "Cook Food",
});
const eat = new Item({
  name : "Eat Food",
});

const defaultItems = [buy,cook,eat];

const listSchema = {
  name : String,
  items : [itemsSchema],
};

const List = mongoose.model("List",listSchema);

app.get("/", function(req, res) {
Item.find({},function(err,foundItems){
  if (foundItems.length === 0) {

    Item.insertMany(defaultItems,function(err){
      if (err) {
        console.log(err);
      } else {
        console.log("Succefully inserted 3 items!!");
      }
    });
    res.redirect("/")
  } else {
      res.render("list",{listTitle:"Today",newListItems:foundItems});
  }

  // console.log(foundItems);

})
});


app.post("/", function(req, res) {
//console.log(req.body);
const itemName = req.body.newItem;
const listName = req.body.List;

const item = new Item({
  name : itemName,
});

if(listName==="Today"){
  item.save(function(err){
    if(err){
      console.log(err);
    }else{
      console.log("added : "+itemName);
    }
  })
  res.redirect("/");
}else{
  List.findOne({name : listName},function(err,foundList){
    foundList.items.push(item);
    foundList.save();
    res.redirect("/"+listName);
  })
}



})

app.post("/delete",function(req,res){
const checkedItemID = req.body.checkbox;
Item.findByIdAndRemove(checkedItemID,function(err){
  if (err) {
    console.log(err);
  } else {
    console.log("Succefully Deleted !!");
  }
})
res.redirect("/");
})



app.get("/:routeName",function(req,res){
const customListName =  req.params.routeName;
List.findOne({name : customListName},function(err,foundList){
  if(!err){
    if (!foundList) {
      //Create a new List
      const listI = new List({
        name : customListName,
        items : defaultItems,
      })

      listI.save();
      res.redirect("/"+customListName);
    } else {
      //Show an Existing List
      res.render("list",{listTitle:foundList.name, newListItems : foundList.items});
    }
  }
});


});



app.get("/about",function(req,res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("server started at port 3000");
});
