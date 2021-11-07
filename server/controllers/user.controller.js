/*This file contains the definitions of the controller methods that are used in the user route
declarations as callbacks to be executed when a route request is received by the server.*/

import profileImage from './../../client/assets/images/profile_pic.png'

/*lodash is a JavaScript library that provides utility functions for common programming tasks,
including the manipulation of arrays and objects.*/
import extend from 'lodash/extend';

/*This controller makes use of the errorHandler helper to respond to route requests with meaningful
messages when a Mongoose error occurs.*/
import errorHandler from '../helpers/dbErrorHandler';
import User from '../models/user.model';

/*The formidable Node module will allow the server to read the multipart form data and give us
access to the fields and the file, if there are any. If there is a file, formidable will
store it temporarily in the filesystem. We will read it from the filesystem using the fs
module, which will retrieve the file type and data, and store it in the photo field in
the user model.
The formidable code will go in the "update" controller.*/
import formidable from 'formidable';
import fs from 'fs';



//Creating a new user
/*When the Express app gets a POST request at '/api/users', it calls the create function.
This function creates a new user with the user JSON object that's received in the POST request from
the frontend within req.body. The call to user.save attempts to save the new user in the database after
Mongoose has performed a validation check on the data. Consequently, an error or success response is
returned to the requesting client.
The create function is defined as an asynchronous function with the async keyword, allowing us to use
await with user.save(), which returns a Promise. Using the await keyword inside an async function causes
this function to wait until the returned Promise resolves, before the next lines of code are executed.
If the Promise rejects, an error is thrown and caught in the catch block.
*/
const create = async (req, res) => {
    const user = new User( req.body )
    try {
        await user.save()
        return res.status(200).json({
            message: 'Successfully signed up!'
        })
    }
    catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

//Listing all users
/*The list controller function finds all the users from the database, populates only the name, email, created,
and updated fields in the resulting user list, and then returns this list of users as JSON objects in an array
to the requesting client.
*/
const list = async (req, res) => {
    try {
        let users = await User.find().select('name email updated created photo')
        res.json(users)
    }
    catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}


//LOADING A USER BY ID TO READ, UPDATE, OR DELETE
/*All three API endpoints for read, update, and delete require a user to be loaded from the database based on the
user ID of the user being accessed. We have to program the Express router to do this action first before responding
to a specific request to read, update, or delete.*/

//Loading
/*Whenever the Express app receives a request to a route that matches a path containing the :userId parameter in it,
the app will execute the userByID controller function, which fetches and loads the user into the Express request object,
before propagating it to the next function that's specific to the request that came in.
*/
const userByID = async (req, res, next, id) => {
    try {
        let user = await User.findById(id)
        // The names and IDs of the users referenced in the following and followers arrays.
        .populate('following', '_id name photo')
        .populate('followers', '_id name photo')
        .exec()
        if (!user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }
        /*If a matching user is found in the database, the user object is appended to the request object in the profile key.
        Then, the next() middleware is used to propagate control to the next relevant controller function.*/
        req.profile = user;
        next();
    }
    catch (err) {
        return res.status(400).json({
            error: 'Could not retrieve user'
        })
    }
}

//Reading
/*When the Express app gets a GET request at '/api/users/:userId', it executes the userByID controller function to load the
user by the userId value, followed by the read controller function.
The read function retrieves the user details from req.profile and removes sensitive information, such as the hashed_password
and salt values, before sending the user object in the response to the requesting client.
*/
const read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
}

//Updating
/*When the Express app gets a PUT request at '/api/users/:userId', it loads the user with the :userId parameter value before
executing the update controller function.
The update function retrieves the user details from req.profile and then uses the lodash module to extend and merge the changes
that came in the request body to update the user data. Before saving this updated user to the database, the updated field
is populated with the current date to reflect the last updated timestamp. Upon successfully saving this update, the updated
user object is cleaned by removing sensitive data, such as hashed_password and salt, before sending the user object in the
response to the requesting client.
*/
const update = async (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {        
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            })
        }      
        
        let user = req.profile
        user = extend(user, fields)
        user.updated = Date.now()        
        if(files.photo){
            user.photo.data = fs.readFileSync(files.photo.path)
            user.photo.contentType = files.photo.type
          }
        try {        
            await user.save();
            user.hashed_password = undefined
            user.salt = undefined
            res.json(user);
        }
        catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }        
    })
}

//Deleting
/*When the Express app gets a DELETE request at '/api/users/:userId', it loads the user by ID and then the remove controller
function is executed.
The remove function retrieves the user from req.profile and uses the remove() query to delete the user from the database.
On successful deletion, the requesting client is returned the deleted user object in the response.
*/
const remove = async (req, res) => {
    try {
        let user = req.profile;
        let deletedUser = await user.remove();
        deletedUser.hashed_password = undefined;
        deletedUser.salt = undefined;
        res.json(deletedUser);
    }
    catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

/*We will look for the photo in the photo controller method and, if found, send it in the response to the request at the photo route;
otherwise, we'll call next() to return the default photo. */
const photo = (req, res, next) => {
    if (req.profile.photo.data) {
        res.set("Content-Type", req.profile.photo.contentType)
        return res.send(req.profile.photo.data)
    }
    next()
}

const defaultPhoto = (req, res) => {
    return res.sendFile(process.cwd() + profileImage)
}

/*This method will update the "following" array for the current user by pushing the followed user's reference into the array.*/
const addFollowing = async (req, res, next) => {
    try{
        await User.findByIdAndUpdate(req.body.userId,
            {$push: {following: req.body.followId}})
        next()
    }
    catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(error)
        })
    }
}
/*On successful update of the following array, next() is invoked, and as a result, the addFollower method is executed to add the
current user's reference to the followed user's followers array.*/
const addFollower = async (req, res) => {
    try {
        let result = await User.findByIdAndUpdate(req.body.followId,
            {$push: {followers: req.body.userId}},
            {new: true})
            .populate('following', '_id name photo')
            .populate('followers', '_id name photo')
            .exec()
        result.hashed_password = undefined
        result.salt = undefined
        res.json(result)
    }
    catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

/*For unfollowing, the implementation is similar. The removeFollowing and removeFollower controller methods update the respective
'following' and 'followers' arrays by removing the user references with $pull instead of $push. removeFollowing and removeFollower.*/
const removeFollowing = async (req, res, next) => {
    try{
        await User.findByIdAndUpdate(req.body.userId, {$pull: {following: req.body.unfollowId}})
        next()
    }
    catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(error)
        })
    }
}

const removeFollower = async (req, res) => {
    try {
        let result = await User.findByIdAndUpdate(req.body.unfollowId,
            {$pull: {followers: req.body.userId}},
            {new: true})
            .populate('following', '_id name photo')
            .populate('followers', '_id name photo')
            .exec()
        result.hashed_password = undefined
        result.salt = undefined
        res.json(result)
    }
    catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

/*We will query the User collection in the database to find the users that are not in the current user's following list.*/
const findPeople = async (req, res) => {
    let following = req.profile.following
    following.push(req.profile._id) //including the user id to not get the option of following himself
    try {
        let users = await User.find({ _id: { $nin: following }})
        res.json(users)
    }
    catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

export default { 
    create,
    userByID,
    read,
    list,
    remove,
    update,
    photo,
    defaultPhoto,
    addFollowing,
    addFollower,
    removeFollowing,
    removeFollower,
    findPeople
}