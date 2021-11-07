import mongoose from 'mongoose';

/*The Post schema will store a post's text content, a photo, a reference to the user who posted,
time of creation, likes on the post from users, and comments on the post by users.
*/
const PostSchema = new mongoose.Schema({
    text: {
        type: String,
        required: 'Text is required'
    },
    photo: {
        type: String,
        default: './../../client/assets/images/profilepic.png'
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    },
    likes: [{
        type: mongoose.Schema.ObjectId, ref: 'User'
    }],
    comments: [{
        text: String,
        created: {
            type: Date,
            default: Date.now
        },
        postedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    }]

})

export default mongoose.model('Post', PostSchema);