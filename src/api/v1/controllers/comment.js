const Comment = require("../models/comment")

const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const {username, comment} = req.body;

        const response = await Comment.findOneAndUpdate({postId},{
            $push : {
                comments: {username, comment, time: Date.now()}
            },
            $inc: {count: 1}
        }, { upsert : true })

        res.status(201).json({response})
    } catch (error) {
        res.status(500).json({message: error})
    }
}

const getComments = async (req, res) => {
    try {
        const {postId} = req.params;
        const result = await Comment.aggregate([
            {
                $match: {
                    postId: postId
                }
            },
            {
            $unwind: "$comments"
            },
            {
            $sort: {
                "comments.time": -1
            }
            },
            // {
            //     $skip: req.body.limit * req.body.page
            // },
            {
                $limit: 50
            },
            {
            $group: {
                _id: "$_id",
                comments: {$push: "$comments"}
            }
            }
        ]);
        const comments = result[0] ? result[0]?.comments : []
        res.status(200).json({comments})
    } catch (error) {
        res.status(500).json({message: error})
    }
}

module.exports ={
    addComment, getComments
}