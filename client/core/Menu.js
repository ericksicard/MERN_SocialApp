import React from 'react'
import { Link, withRouter } from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import Button from '@material-ui/core/Button'

import auth from './../auth/auth-helper'

/*This fucntion is used to indicate the current location of the application on the Menu.
The link that matches the current location path will be highlighted by changing the color.
*/
const isActive = (history, path) => {
    if (history.location.pathname == path)
        return { color: '#f44336'}
    else 
        return {color: '#ffffff'}
}

/* The Menu component will function as a navigation bar across the frontend application
by providing links to all the available views, and also by indicating the user's current
location in the application.
To implement these navigation bar functionalities, we will use the HOC withRouter from
React Router to get access to the history object's properties.
*/
const Menu = withRouter( ({history}) => (
    <AppBar position='static'>
        <Toolbar>
            <Typography variant='h6' color='inherit'>
                MERN Social
            </Typography>
            <Link to='/'>
                <IconButton arial-label='Home' style={isActive(history, '/')}>
                    <HomeIcon/>
                </IconButton>
            </Link>
            <Link to='/users'>
                <Button style={isActive(history, "/users")}>
                    Users
                </Button>
            </Link>
            
            {/*The links to SIGN UP and SIGN IN should only appear on the menu when the user
            is not signed in. Therefore, we need to add it to the Menu component after the
            Users button with a condition*/}
            {
                !auth.isAuthenticated() && (
                    <span>
                        <Link to='/signup'>
                            <Button style={isActive(history, "/signup")}>
                                Sign Up
                            </Button>
                        </Link>
                        <Link to='/signin'>
                            <Button style={isActive(history, "/signin")}>
                                Sign In
                            </Button>
                        </Link>
                    </span>
                )
            }

            {/*The links to MY PROFILE and SIGN OUT should only appear on the menu when the user
            is signed in. Therefore, we need to add it to the Menu component after the Users button
            with a condition*/}
            {
                auth.isAuthenticated() && (
                    <span>

                        {/*The MY PROFILE button uses the signed-in user's information to link to the user's
                        own profile*/}
                        <Link to={'/user/' + auth.isAuthenticated().user._id}>
                            <Button style={isActive(history, '/user/' + auth.isAuthenticated().user._id)}>
                                My Profile
                            </Button>
                        </Link>

                        {/*The SIGN OUT button calls the auth.clearJWT() method when it's clicked*/}
                        <Button color='inherit' onClick={ () => { auth.clearJWT(() => history.push('/')) }}>
                            Sign Out
                        </Button>
                    </span>
                )
            }
        </Toolbar>
    </AppBar>
))

export default Menu