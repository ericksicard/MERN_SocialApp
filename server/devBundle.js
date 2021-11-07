/*In order to keep the development flow simple, we will initialize Webpack to compile
the client-side code when the server is run. In devBundle.js, it's set up a
compile method that takes the Express app and configures it to use the Webpack
middleware to compile, bundle, and serve code, as well as enable hot reloading in
development mode.
*/
import config from './../config/config'
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from './../webpack.config.client.js'

const compile = (app) => {
    if ( config.env == "development" ) {
        const compiler = webpack(webpackConfig)
        const middleware = webpackMiddleware(compiler, {
            publicPath: webpackConfig.output.publicPath
            }
        )
        app.use(middleware)
        app.use(webpackHotMiddleware(compiler))
    }
}
export default { compile }