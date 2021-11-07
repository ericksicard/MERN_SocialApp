import mongoose from 'mongoose';

import config from './../config/config'
import app from './express'


// Express app to start a server that listens on the specified port for incoming requests
app.listen(config.port, err => {
    if (err) console.log(err) 
    console.info('Server started on port %s.', config.port)
})

//Connecting the server to MongoDB
/*Mongoose configuration to use native ES6 promises, and handles the connection to the
MongoDB database.*/
mongoose.Promise = global.Promise;
mongoose.connect( config.mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${mongoUri}`)
})