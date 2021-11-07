import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import {makeStyles} from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import ImageList from '@material-ui/core/ImageList'
import ImageListItem from '@material-ui/core/ImageListItem'

const useStyles = makeStyles(theme => ({
    root: {
        paddingTop: theme.spacing(2),
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        background: theme.palette.background.paper,
    },
    bigAvatar: {
        width: 60,
        height: 60,
        margin: 'auto'
    },
    gridList: {
        width: 500,
        height: 220,
    },
    tileText: {
        textAlign: 'center',
        marginTop: 10
    }
}))

/*The FollowGrid component will take a list of users as props, display the avatars of
the users with their names, and link them to each user's own profile. We can add this
component to the Profile view to display followings or followers.*/

export default function FollowGrid(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <ImageList rowHeight={160} className={classes.gridList} cols={4}>
                {props.people.map( (person, i) => {
                    return <ImageListItem style={{'height':120}} key={i}>
                                <Link to={'/user/' + person._id}>
                                    <Avatar src={'/api/users/photo/'+ person._id} className={classes.bigAvatar} />
                                    <Typography className={classes.tileText}>
                                        {person.name}
                                    </Typography>
                                </Link>
                            </ImageListItem>
                        })}
            </ImageList>
        </div>
    )
}

FollowGrid.propTypes = {
    people: PropTypes.array.isRequired
}