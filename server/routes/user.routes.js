// ADDING USER CRUD APIs
/*The user API endpoints exposed by the Express app will allow the frontend to
perform CRUD operations on documents that are generated according to the user
model. To implement these working endpoints, we will write Express routes and the
corresponding controller callback functions that should be executed when HTTP
requests come in for these declared routes. In this section, we will look at how these
endpoints work without any auth restrictions.*/

import express from 'express';
import userCtrl from '../controllers/user.controller';
import authCtrl from '../controllers/auth.controller';

/*The user routes that are defined here will use express.Router() to define route paths
with the relevant HTTP methods and assign the corresponding controller function that
should be called when these requests are received by the server.
We will keep the user routes simplistic by using the following:
    '/api/users' for the following:
        - Listing users with GET
        - Creating a new user with POST
    '/api/users/:userId' for the following:
        - Fetching a user with GET
        - Updating a user with PUT
        - Deleting a user with DELETE
*/
const router = express.Router()

/*When the server receives requests at each of these defined routes, the corresponding
controller functions are invoked. The functionality for each of these controller methods
will be defined and exported from the user.controller.js file.*/

router.route('/api/users')
    .get(userCtrl.list)
    .post(userCtrl.create)

/*The first one is a routes to the photo stored in the database for each user, and the second
route will fetch a default photo if the given user did not upload a profile photo.
*/
router.route('/api/users/photo/:userId')
    .get(userCtrl.photo, userCtrl.defaultPhoto)

router.route('/api/users/defaultphoto')
    .get(userCtrl.defaultPhoto)

/*When a user follows or unfollows another user from the view, both users' records in the database
will be updated in response to the follow or unfollow requests.
*/
router.route('/api/users/follow')
    .put(authCtrl.requireSignin, userCtrl.addFollowing, userCtrl.addFollower)

router.route('/api/users/unfollow')
    .put(authCtrl.requireSignin, userCtrl.removeFollowing, userCtrl.removeFollower)

/*Fetching users not followed*/
router.route('/api/users/findpeople/:userId')
    .get(authCtrl.requireSignin, userCtrl.findPeople)

/*The route to read a user's information only needs authentication verification, whereas
the update and delete routes should check for both authentication and authorization
before these CRUD operations are executed.
*/
router.route('/api/users/:userId')
    .get(authCtrl.requireSignin, userCtrl.read)
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
    .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove)


router.param('userId', userCtrl.userByID)

export default router;