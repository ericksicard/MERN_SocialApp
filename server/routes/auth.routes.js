//INTEGRATING USER AUTH AND PROTECTED ROUTES
/*To restrict access to user operations such as user profile view, user update, and user
delete, we will first implement sign-in authentication with JWT, then use it to protect
and authorize the read, update, and delete routes.*/

//Auth routes
/*The two auth APIs are defined in the auth.routes.js file using express.Router() to declare
the route paths with the relevant HTTP methods. They're also assigned the corresponding
controller functions, which should be called when requests are received for these routes.
The auth routes are as follows:
'/auth/signin' for the following:
- Authenticate the user with their email and password with POST
'/auth/signout' for the following: 
- Clear the cookie containing a JWT, that was set on the response object after sign-in, with GET
*/
import express from 'express';
import authCtrl from '../controllers/auth.controller';

const router = express.Router();

router.route('/auth/signin')
    .post(authCtrl.signin)

router.route('/auth/signout')
    .get(authCtrl.signout)

export default router;