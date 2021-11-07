import express from 'express';
import path from 'path';

// DEPRECATED
/*bodyParser is a middleware to handle the complexities of parsing streamable request objects
so that we can simplify browser-server communication by exchanging JSON in the request body*/
// import bodyParser from 'body-parser';

/*Cookie parsing middleware to parse and set cookies in request objects.*/
import cookieParser from 'cookie-parser';

/*Compression middleware that will attempt to compress response bodies for all requests that
traverse through the middleware.*/
import compress from 'compression';

/*Middleware to enable cross-origin resource sharing (CORS).*/
import cors from 'cors';

/*Collection of middleware functions to help secure Express apps by setting various HTTP headers.*/
import helmet from 'helmet';

import Template from './../template'
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import postRoutes from './routes/post.routes';
import devBundle from './devBundle'; //comment out before building for production !!!


// MODULES FOR SERVER-SIDE RENDERING
/* - React modules: The following modules are required to render the React components and use renderToString: */
import React from 'react';
import ReactDOMServer from 'react-dom/server';

/* - Router modules: StaticRouter is a stateless router that takes the requested URL to match with the
frontend route which was declared in the MainRouter component. The MainRouter is the root component
in our frontend.*/
import MainRouter from './../client/MainRouter'
import { StaticRouter } from 'react-router-dom'

/* - Material-UI modules and the custom theme: The following modules will help generate the CSS styles for
the frontend components based on the stylings and Material-UI theme that are used on the frontend: */
import { ServerStyleSheets, ThemeProvider } from '@material-ui/styles'
import theme from './../client/theme'


const app = express();

/*In development mode, when this line is executed, Webpack will compile and bundle the React
code to place it in dist/bundle.js.*/
devBundle.compile(app);     //comment out before building for production !!!

// app.use(bodyParser.json()) //bodyParser is deprecated. For latest version of express you don't have to install body-parser package
app.use(express.json())
// app.use(bodyParser.urlencoded({ extended: true })) //bodyParser is deprecated. For latest version of express you don't have to install body-parser package
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
app.use(helmet())
app.use(cors())

// Serving static files from the dist folder
/*Webpack will compile client-side code in both development and production mode, then place the
bundled files in the dist folder. These two lines configure the Express app to return static files
from the dist folder when the requested route starts with /dist.
*/
const CURRENT_WORKING_DIR = process.cwd()
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

/*All routes and API endpoints need to be mounted on the Express app so that they can be accessed from
the client-side.*/
app.use('/', userRoutes)
app.use('/', authRoutes)
app.use('/', postRoutes)

// Basic server-side rendering
/*To render the relevant React components when the server receives requests to the frontend routes,
we need to generate the React components on the serve-side with regard to the React Router and Material-UI
components, before the client-side JS is ready to take over the rendering.
  The basic idea behind server-side rendering React apps is to use the renderToString method from react-dom
to convert the root React component into a markup string. Then, we can attach it to the template that the
server renders when it receives a request.
*/
app.get('*', (req, res) => {
    // 1. Generate CSS styles using Material-UI's ServerStyleSheets
    // 2. Use renderToString to generate markup which renders components specific to the route requested
    // 3. Return template with markup and CSS styles in the response

    const sheets = new ServerStyleSheets();
    const context = {};
    const markup = ReactDOMServer.renderToString(
        sheets.collect(
            <StaticRouter location={req.url} context={context}>
                <ThemeProvider theme={theme}>
                    <MainRouter />
                </ThemeProvider>
            </StaticRouter>
        )
    )
    
    if ( context.url) {
        return res.redirect(303, context.url)
    }
    
    const css = sheets.toString()
    res.status(200).send( Template({
        markup: markup,
        css: css
    }))
})


//Auth error handling for express-jwt
/*We will handle auth-related errors thrown by express-jwt when it tries to validate JWT tokens in
incoming requests.
express-jwt throws an error named UnauthorizedError when a token cannot be validated for some reason.
We catch this error here to return a 401 status back to the requesting client. We also add a response
to be sent if other server-side errors are generated and caught here.
*/
app.use( (err, req, res, next) =>{
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ 'error': err.name + ': ' + err.message })
    }
    else if (err) {
        res.status(400).json({"error" : err.name + ": " + err.message})
        console.log(err)
    }
})

export default app;