const Comment = require("../models/comment")

const addComment = async (req, res) => {
    try {
        const {_id, username, comment} = req.body;

        const response = await Comment.findOneAndUpdate({postId: _id},{
            $push : {
               comments: {username, comment, time: Date.now()}
             },
             $inc: {count: 1}
           }, { upsert : true })

        res.status(201).json({response})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error})
    }
}

const getComments = async (req, res) => {
    try {
        const {postId} = req.query;
        const response = await Comment.find({postId}, {comments:1,_id:0});
        const comments = response[0] ? response[0].comments : []
        res.status(200).json({comments})
    } catch (error) {
        res.status(500).json({message: error})
    }
}

module.exports ={
    addComment, getComments
}