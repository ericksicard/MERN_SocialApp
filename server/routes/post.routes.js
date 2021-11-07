import express from 'express';
const router = express.Router();

import authCtrl from '../controllers/auth.controller';
import userCtrl from '../controllers/user.controller';
import postCtrl from '../controllers/post.controller';

/*Creating a new post*/
router.route('/api/posts/new/:userId')
    .post(authCtrl.requireSignin, postCtrl.create)

//Returning the photo associated to a post
router.route('/api/posts/photo/:postId')
    .get(postCtrl.photo)

/*This route path that will receive the request for retrieving posts that have been shared by a specific user.*/
router.route('/api/posts/by/:userId')
    .get(authCtrl.requireSignin, postCtrl.listByUser)

/*This route path that will receive the request for retrieving Newsfeed posts for a specific user.
We are using the :userID parameter in this route to specify the currently signed-in user. We will
utilize the userByID controller method in user.controller to fetch the user details and append
these to the request object that is accessed in the listNewsFeed post controller method.
*/
router.route('/api/posts/feed/:userId')
    .get(authCtrl.requireSignin, postCtrl.listNewsFeed)

/*The like API will be a PUT request that will update the likes array in the Post
document. The request will be received at the api/posts/like route.*/
router.route('/api/posts/like')
    .put(authCtrl.requireSignin, postCtrl.like)

router.route('/api/posts/unlike')
    .put(authCtrl.requireSignin, postCtrl.unlike)
 
//Adding a comment to a post
router.route('/api/posts/comment')
.put(authCtrl.requireSignin, postCtrl.comment)

//Deleting a comment from a post
router.route('/api/posts/uncomment')
    .put(authCtrl.requireSignin, postCtrl.uncomment)
    
/*The delete route will check for authorization before calling remove on the post by
ensuring the authenticated user and postedBy user are the same users. The isPoster method
checks whether the signed-in user is the original creator of the post before executing
the next method. */
router.route('/api/posts/:postId')
    .delete(authCtrl.requireSignin, postCtrl.isPoster, postCtrl.remove)


router.param('userId', userCtrl.userByID)
router.param('postId', postCtrl.postByID)

export default router;