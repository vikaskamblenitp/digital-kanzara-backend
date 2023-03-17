const Dislike = require('../models/dislike');
const Like = require('../models/like');
const User = require('../models/user');

const addLike = async (req, res) => {
    try {
        const {postId} = req.params;
        const {username } = req.body;
        const user = await User.find({username}, {likes: 1, _id: 0});
    
        if(user[0].likes.some(field => field.postId === postId)) {
            return res.status(501).json("allready liked")
        }
        const time = Date.now();
        const response = await Like.findOneAndUpdate({postId},{
            $push : {likes: {username, time}},
            $inc: {count: 1}
        }, { upsert : true })
        await User.findOneAndUpdate({username},{
            $push: {likes: {postId, time }}
        })
        
        res.status(201).json({response})
    } catch (error) {
        res.status(500).json({message: error})
    }
}

const getLikes = async (req, res) => {
    try {
        const {postId} = req.params;
        const result = await Like.aggregate([
            {
                $match: {
                    postId: postId
                }
            },
            {
            $unwind: "$likes"
            },
            {
            $sort: {
                "likes.time": -1
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
                likes: {$push: "$likes"}
            }
            }
        ]);
        const likes = result[0] ? result[0].likes : []
        res.status(200).json({likes})
    } catch (error) {
        res.status(500).json({message: error})
    }
}

const addDislike = async (req, res) => {
    try {
        const {_id, username } = req.body;
        const user = await User.find({username}, {dislikes: 1, _id: 0});
    
        if(user[0].dislikes.some(field => field.postId === _id)) {
            return res.status(501).json("allready disliked")
        }
        const response = await Dislike.findOneAndUpdate({postId: _id},{
            $push : {dislikes: {username, time: Date.now()}},
            $inc: {count: 1}
        }, { upsert : true })
        const time = Date.now();
        await User.findOneAndUpdate({username},{
            $push: {dislikes: {postId: _id, time }}
        })

        res.status(201).json({response})
    } catch (error) {
        res.status(500).json({message: error})
    }
}

module.exports ={
    addLike,
    getLikes,
    addDislike
}