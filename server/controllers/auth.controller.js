// AUTH CONTROLLER
/*The auth controller functions will not only handle requests to the signin and signout routes,
but also provide JWT and express-jwt functionality to enable authentication and authorization for
protected user API endpoints.*/

import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import config from './../../config/config';

//Signin
/*When the Express app gets a POST request at '/auth/signin', it executes the signin controller function.
The POST request object receives the email and password in req.body. This email is used to retrieve a
matching user from the database. Then, the password authentication method defined in UserSchema is used to
verify the password that's received in req.body from the client.
If the password is successfully verified, the JWT module is used to generate a signed JWT using a secret key
and the user's _id value.
Then, the signed JWT is returned to the authenticated client, along with the user's details. Optionally, we
can also set the token to a cookie in the response object so that it is available to the client-side if cookies
are the chosen form of JWT storage. On the client-side, this token must be attached as an Authorization header
when requesting protected routes from the server. To sign-out a user, the client-side can simply delete this
token depending on how it is being stored.
*/
const signin = async (req, res) => {
    try {
        let user = await User.findOne({ 'email': req.body.email })

        if (!user) return res.status(401).json({ error: 'User not found'})
        if (!user.authenticate(req.body.password)) return res.status(401).send({ error: 'Email and password do not match.'})

        const token = jwt.sign({ _id: user._id }, config.jwtSecret);
        res.cookie('t', token, { expire: new Date() + 9999 })

        return res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                photo: user.photo
            }
        })
    }
    catch(err) {
        return res.status(401).json({ error: 'Could not sign in'})
    }
}

//Signout
/*When the Express app gets a GET request at '/auth/signout', it executes the signout controller function.
The signout function clears the response cookie containing the signed JWT. This is an optional endpoint and
not really necessary for auth purposes if cookies are not used at all in the frontend.
With JWT, user state storage is the client's responsibility, and there are multiple options for client-side
storage besides cookies. On signout, the client needs to delete the token on the client-side to establish
that the user is no longer authenticated. On the server-side, we can use and verify the token that's generated
at sign-in to protect routes that should not be accessed without valid authentication.
*/
const signout = (req, res) => {
    res.clearCookie('t')
    return res.status(200).json({ message: 'Signed out'})
}


// PROTECTING ROUTES WITH EXPRESS-JWT
/*To protect access to the read, update, and delete routes, the server will need to check that the requesting
client is actually an authenticated and authorized user.
To check whether the requesting user is signed in and has a valid JWT when a protected route is accessed,
we will use the express-jwt module.*/

//Requiring sign-in
/*This method uses express-jwt to verify that the incoming request has a valid JWT in the Authorization header.
If the token is valid, it appends the verified user's ID in an 'auth' key to the request object; otherwise,
it throws an authentication error.
We can add requireSignin to any route that should be protected against unauthenticated access.
*/
const requireSignin = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'auth'
})

//Authorizing signed in users
/*For some of the protected routes, such as update and delete, on top of checking for authentication we also want
to make sure the requesting user is only updating or deleting their own user information.
To achieve this, the hasAuthorization function will check whether the authenticated user is the same as the user
being updated or deleted before the corresponding CRUD controller function is allowed to proceed.
The req.auth object is populated by express-jwt in requireSignin after authentication verification, while req.profile
is populated by the userByID function in user.controller.js. We will add the hasAuthorization function to routes that
require both authentication and authorization.
*/
const hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id == req.auth._id ;
    if (!authorized) return res.status(403).json({ error: 'User is not authorized'})
    next()
}

export default { signin, signout, requireSignin, hasAuthorization }