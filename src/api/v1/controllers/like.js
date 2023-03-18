const Dislike = require('../models/dislike');
const Like = require('../models/like');
const User = require('../models/user');

const addLike = async (req, res) => {
    try {
        const {postId} = req.params;
        const {username, value } = req.body;
        const time = Date.now();
        if(value === true) {
            await Like.findOneAndUpdate({postId},{
                $push : {likes: {username, time}},
                $inc: {count: 1}
            }, { upsert : true })
            await User.findOneAndUpdate({username},{
                $push: {likes: {postId, time }}
            })
        } else if(value === false) {
            await Like.findOneAndUpdate({postId}, {
                $pull: {
                    likes: {username: username},
                },
                $inc: {count: -1}
            }, { upsert : true });
            await User.findOneAndUpdate({username},{
                $pull: {likes: {postId}}
            })
        }
        
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
        const { postId } = req.params;
        const { username, value } = req.body;
        if(value === true) {
            let time = Date.now();
            await Dislike.findOneAndUpdate({postId},{
                $push : {dislikes: {username, time}},
                $inc: {count: 1}
            }, { upsert : true });
            await User.findOneAndUpdate({username},{
                $push: {dislikes: {postId, time }}
            })
        } else if(value === false) {
            await Dislike.findOneAndUpdate({postId}, {
                $pull: {
                    dislikes: {username: username},
                },
                $inc: {count: -1}
            }, { upsert : true });
            await User.findOneAndUpdate({username},{
                $pull: {dislikes: {postId}}
            })
        }

        res.status(201).json({message: "updated successfully"})
    } catch (error) {
        res.status(500).json({message: error})
    }
}

module.exports ={
    addLike,
    getLikes,
    addDislike
}