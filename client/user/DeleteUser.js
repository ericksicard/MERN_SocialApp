import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Redirect} from 'react-router-dom'

import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import auth from './../auth/auth-helper'
import {remove} from './api-user.js'

export default function DeleteUser( props ) {
    const [ open, setOpen ] = useState(false)
    const [ redirect, setRedirect ] = useState(false);
    const jwt = auth.isAuthenticated();

    // The dialog is opened when the user clicks the delete button.
    const clickButton = () => {
        setOpen( true )
    }
    
    // The dialog is closed when the user clicks cancel on the dialog.
    const handleRequestClose = () => {
        setOpen( false )
    }

    /*The component will have access to the userId that's passed in as a prop from the
    Profile component, which is needed to call the remove fetch method, along with
    the JWT credentials, after the user confirms the delete action in the dialog.
    On confirmation, the deleteAccount function calls the remove fetch method with
    the userId from props and JWT from isAuthenticated.
    */
    const deleteAccount = () => {
        remove(
            { userId: props.userId },
            { t: jwt.token }
        )
        .then( data => {
            if (data && data.error) console.log( data.error )
            else {
                auth.clearJWT( () => console.log('deleted') )
                setRedirect(true)
            }
        })
    }
    
    /*On successful deletion, the user will be signed out and redirected to the Home view.
    The Redirect component from React Router is used to redirect the current user to the Home view.
    */
    if (redirect) {
        return <Redirect to='/' />
    }

    return (
        <span>
            <IconButton aria-label='Delete' onClick={clickButton} color='secondary'>
                <DeleteIcon />
            </IconButton>
            <Dialog open={open} onClose={handleRequestClose}>
                <DialogTitle>{'Delete Account'}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Confirm to delete your account
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRequestClose} color='primary'>
                        Cancel
                    </Button>
                    <Button onClick={deleteAccount} color='secondary' autoFocus='autoFocus'>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </span>
    )
}

DeleteUser.propTypes = {
    userId: PropTypes.string.isRequired
}