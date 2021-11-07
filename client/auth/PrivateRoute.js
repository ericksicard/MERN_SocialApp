import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'

import auth from './auth-helper'

/*Components to be rendered in this PrivateRoute will only load when the user is authenticated,
which is determined by a call to the "isAuthenticated" method; otherwise, the user will be redirected
to the Signin component. We load the components that should have restricted access, such as the user
profile component, in a PrivateRoute. This will ensure that only authenticated users are able to view
the user profile page.*/

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    auth.isAuthenticated() ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/signin',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

export default PrivateRoute