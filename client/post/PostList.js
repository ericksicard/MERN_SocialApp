import React from 'react'
import PropTypes from 'prop-types'

import Post from './Post'

/*PostList component will render any list of posts provided to it,
which we can use in both the Newsfeed and the Profile components.*/

export default function PostList(props) {
    return (
        <div style={{marginTop: '24px'}}>
            {props.posts.map( (item, i) => {
                return <Post post={item} key={i} onRemove={props.removeUpdate}/>
                })
            }
        </div>
    )
}

PostList.propTypes = {
    posts: PropTypes.array.isRequired,
    removeUpdate: PropTypes.func.isRequired
}