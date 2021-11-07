import formidable from 'formidable'
import cloudinary from '../../config/cloudinary-config'

import errorHandler from '../helpers/dbErrorHandler';
import Post from '../models/post.model'


/*The listNewsFeed controller method will query the Post collection in the database
to get the matching posts.
In the query to the Post collection, we find all the posts that have postedBy user
references that match the current user's followings and the current user. The posts
that are returned will be sorted by the created timestamp, with the most recent post
listed first. Each post will also contain the id and name of the user who created the
post and of the users who left comments on the post.
*/
const listNewsFeed = async (req, res) => {
    let following = req.profile.following
    following.push(req.profile._id) //this will include the posts of the signed-in user
    try{
        let posts = await Post.find({ postedBy: { $in: req.profile.following }})
                                .populate('comments.postedBy', '_id name photo')
                                .populate('postedBy', '_id name photo')
                                .sort('-created')
                                .exec()
        res.json(posts)
    }
    catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

/*The listByUser controller method will query the Post collection to find posts that have
a matching reference in the postedBy field to the user specified in the userId param in
the route*/
const listByUser = async (req, res) => {
    try{
        let posts = await Post.find({ postedBy: req.profile._id })
                                .populate('comments.postedBy', '_id, name photo')
                                .populate('postedBy', '_id name photo')
                                .sort('-created')
                                .exec()
        res.json(posts)
    }
    catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

/* This method will use the formidable module to access the fields and the image file, if any.*/
const create = async (req, res, next) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            })
        }
        let post = new Post(fields);
        post.postedBy = req.profile;
        
        if (files.photo) {
            await cloudinary.uploader.upload(files.photo.path,
                {use_filename: true,
                folder: 'MERN_SocialApp/posts'},
                function(err, result) {
                    post.photo = result.url
                })
        }

        try {
            let result = await post.save();
            res.json(result)
        }
        catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
    })
}

//The photo controller will return the photo data stored in MongoDB
const photo = (req, res, next) => {
    return res.send(req.post.photo)
}

/*postByID will attach the post retrieved from the database to the request object so that
it can be accessed by the next method.
The attached post data in this implementation will also contain the ID and name of the
postedBy user reference since we are invoking populate().
*/
const postByID = async (req, res, next, id) => {
    try{
        let post = await Post.findById(id)
                        .populate('postedBy', '_id name photo')
                        .exec()
        if (!post) {
            return res.status(400).json({
                error: 'Post not found'
            })
        }
        req.post = post
        next()
    }
    catch (err) {
        return res.status(400).json({
            error: "Could not retrieve user post"
        })
    }
}

/*The isPoster method checks whether the signed-in user is the original creator of
the post before executing the next method.*/
const isPoster = (req, res, next) => {
    let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id
    if(!isPoster){
      return res.status('403').json({
        error: "User is not authorized"
      })
    }
    next()
  }

const remove = async (req, res) => {
    let post = req.post
    try{
        let deletedPost = await post.remove()
        res.json(deletedPost)
    }
    catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
          })
    }
}

/*The post ID that's received in the request body will be used to find the specific
Post document and update it by pushing the current user's ID to the likes array. */
const like = async (req, res) => {
    try{
        let result = await Post.findByIdAndUpdate(
            req.body.postId,
            {$push: {likes: req.body.userId}},
            {new: true}
        )
        res.json(result)
    }
    catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

/*The unlike method will find the post by its ID and update the likes array by removing
the current user's ID using $pull instead of $push.*/
const unlike = async (req, res) => {
    try{
        let result = await Post.findByIdAndUpdate(
            req.body.postId,
            {$pull: {likes: req.body.userId}},
            {new: true}
        )
        res.json(result)
    }
    catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

/*The comment controller method will find the relevant post to be updated by its ID and push
the comment object that's received in the request body to the comments array of the post.
In the response, the updated post object will be sent back with details of the postedBy users
populated in the post and in the comments.*/
const comment = async (req, res) => {
    let comment = req.body.comment
    comment.postedBy = req.body.userId

    try {
        let result = await Post.findByIdAndUpdate(
            req.body.postId,
            {$push: {comments: comment}},
            {new: true})
            .populate('comments.postedBy', '_id name')
            .populate('postedBy', '_id name')
            .exec()
        res.json(result)
    }
    catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

/*The uncomment controller method will find the relevant post by ID and pull the
comment with the deleted comment's ID from the comments array in the post*/
const uncomment = async (req, res) => {
    let comment = req.body.comment

    try {
        let result = await Post.findByIdAndUpdate(
            req.body.postId,
            {$pull: {comments: {_id: comment._id}}},
            {new: true})
            .populate('comments.postedBy', '_id name')
            .populate('postedBy', '_id name')
            .exec()
        res.json(result)
    }
    catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

export default {
    listNewsFeed,
    listByUser,
    create,
    photo,
    postByID,
    isPoster,
    remove,
    like,
    unlike,
    comment,
    uncomment
}