const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    query: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Query",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Answer = mongoose.model("Answer", answerSchema);

module.exports = Answer;
