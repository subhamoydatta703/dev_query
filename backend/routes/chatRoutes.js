const express = require("express");
const router = express.Router();
const Chat = require("../models/chat");
const {createChat, delChat, } = require("../seed")

// Router helps us create separate route files.
// It works like a small Express app where we write routes.
// it helps us to create different routes and connect them with the servewr that reduces complexity
// Later, we connect this router to the main server.

// chat route-> shows all chats
router.get("/chat", async (req, res) => {
  console.log("Home route");

  try {
    let datas = await Chat.find();
    res.render("show.ejs",{datas});
    console.log(datas);
  } catch (error) {
    console.log(error);
  }
});

// go to the form for creating new chat
router.get("/chat/new",(req, res)=>{
  
    res.render("new.ejs")
})


// creating a post
router.post("/chat",(req, res)=>{
let {from, to, msg}= req.body;
 createChat(from, to, msg);
res.redirect("/chat")

})


// get for edit form

router.get("/chat/:_id/edit",async (req, res)=>{
  let {_id} = req.params;
  let chatDetail= await Chat.findById(_id)
  // console.log(":Chat detail");
  
  console.log("Chat details: ",{chatDetail});
  
  res.render("edit.ejs",{chatDetail})
})


// update the edit to the db
router.patch("/chat/:_id",async(req, res)=>{
  let {_id}=req.params;
  let {msg}=req.body
  
  await Chat.findByIdAndUpdate(_id,{msg})
  res.redirect("/chat")
  
  
})

router.delete("/chat/:_id",(req, res)=>{
    let {_id} = req.params;
    if(_id){
        delChat(_id);
    }
    console.log(_id);
    res.redirect("/chat")
    
})




module.exports = router;
