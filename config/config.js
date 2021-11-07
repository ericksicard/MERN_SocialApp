/*Definition of some server-side configuration-related variables that
will be used in the code but should not be hardcoded as a best practice,
as well as for security purposes.
These variables will give us the flexibility to change values from a single
file and use it across the backend code.*/

const config = {
    env: process.env.NODE_ENV || 'development',             //To differentiate between development and production modes
    port: process.env.PORT || 3000,                         //To define the listening port for the server
    jwtSecret: process.env.JWT_SECRET || "Ironhackers",     //The secret key to be used to sign JWT
    mongoUri: process.env.MONGODB_URI ||                    //The location of the MongoDB database instance for the project
            process.env.MONGO_HOST ||
            'mongodb://' + (process.env.IP || 'localhost') + ':' +
            (process.env.MONGO_PORT || '27017') +
            '/mern-social-app'
}

export default config