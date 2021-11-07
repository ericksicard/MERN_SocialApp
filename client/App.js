//ROOT REACT COMPONENT
/*In this file, we configure the React app so that it renders the view components with a customized
Material-UI theme, enables frontend routing, and ensures that the React Hot Loader can instantly load
changes as we develop the components.*/

//Wrapping the root component with ThemeProvider and BrowserRouter
/*The custom React components that we will create to make up the user interface will be accessed with
the frontend routes specified in the "MainRouter" component. This component will be our core component
in the root "App", because it houses all the custom views that have been developed for the application
and needs to be given the theme values and routing features.
The "MainRouter" component is wrapped with ThemeProvider, which gives it access to the Material-UI theme,
and BrowserRouter, which enables frontend routing with React Router. The custom theme variables we defined
previously are passed as a prop to "ThemeProvider", making the theme available in all our custom React components.
*/
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/styles'
/*Higher-order component(HOC) hot module from react-hot-loader to mark the root component as hot.*/
import { hot } from 'react-hot-loader'

import MainRouter from './MainRouter'
import theme from './theme'

const App = () => {

    React.useEffect(() => {
      const jssStyles = document.querySelector('#jss-server-side')
      if (jssStyles) {
        jssStyles.parentNode.removeChild(jssStyles)
      }
    }, [])
    
    return (
    <BrowserRouter>
        <ThemeProvider theme={theme}>
          <MainRouter/>
        </ThemeProvider>
    </BrowserRouter>
  )}

//Marking the root component as hot-exported
/*Marking the App component as hot in this way essentially enables live reloading of our React components
during development.
*/
export default hot(module)(App);

