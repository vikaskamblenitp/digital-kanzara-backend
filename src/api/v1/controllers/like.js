const Dislike = require('../models/dislike');
const Like = require('../models/like');
const User = require('../models/user');

const addLike = async (req, res) => {
    try {
        const {_id, username } = req.body;
        const user = await User.find({username}, {likes: 1,dislikes: 1, _id: 0});
    
        if(user[0].likes.some(field => field.postId === _id)) {
           return res.status(501).json("allready liked")
        } else if(user[0].dislikes.some(field => field.postId === _id)){
            // remove it from dilikes and decrease the dislike count 
        }
        const time = Date.now();
        const response = await Like.findOneAndUpdate({postId: _id},{
            $push : {likes: {username, time}},
            $inc: {count: 1}
           }, { upsert : true })
        await User.findOneAndUpdate({username},{
            $push: {likes: {postId: _id, time }}
        })
        
        res.status(201).json({response})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error})
    }
}

const addDislike = async (req, res) => {
    try {
        const {_id, username } = req.body;
        const user = await User.find({username}, {likes: 1,dislikes: 1, _id: 0});
    
        if(user[0].dislikes.some(field => field.postId === _id)) {
           return res.status(501).json("allready disliked")
        } else if(user[0].likes.some(field => field.postId === _id)){
            // remove it from likes and decrease the like count
        }
        const response = await Dislike.findOneAndUpdate({postId: _id},{
            $push : {dislikes: {username, time: Date.now()}},
            $inc: {count: 1}
           }, { upsert : true })

        await User.findOneAndUpdate({username},{
            $push: {dislikes: {postId: _id, time }}
        })

        res.status(201).json({response})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error})
    }
}

module.exports ={
    addLike,
    addDislike
}