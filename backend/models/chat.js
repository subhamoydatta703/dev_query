const mongoose = require("mongoose");

// perform schemas and models

const chatSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  msg: {
    type: String,
    maxlength: 50,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
 
});

// this prevents fully duplicates but allow if atleast any one field is different or unique 
chatSchema.index({ from:1, to: 1, msg: 1 },{unique: true})

const Chat = mongoose.model("Chat", chatSchema)

module.exports=Chat