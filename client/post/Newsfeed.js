/*The basic structure of the Newsfeed component with contain the NewPost and PostList components inside it.
As the parent component, Newsfeed will control the state of the posts' data that's rendered in the child components.
It will provide a way to update the state of posts across the components when the post data is modified within the
child components, such as the addition of a new post in the NewPost component or the removal of a post from the
PostList component.
In the Newsfeed component we initially make a call to the server to fetch a list of posts from people that the
currently signed-in user follows. Then we set this list of posts to the state to be rendered in the PostList component.
The Newsfeed component provides the addPost and removePost functions to NewPost and PostList, which will be used when
a new post is created or an existing post is deleted to update the list of posts in the Newsfeed's state and ultimately
reflect it in the PostList.
*/

import React, {useState, useEffect} from 'react'

import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

import auth from './../auth/auth-helper'
import PostList from './PostList'
import { listNewsFeed } from './api-post.js'
import NewPost from './NewPost'

const useStyles = makeStyles(theme => ({
    card: {
        margin: 'auto',
        paddingTop: 0,
        paddingBottom: theme.spacing(3)
    },
    title: {
        padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
        color: theme.palette.openTitle,
        fontSize: '1em'
    },
    media: {
        minHeight: 330
    }
  }))

  export default function Newsfeed() {
      const classes = useStyles()
      const [ posts, setPosts ] = useState([])
      const jwt = auth.isAuthenticated()

      /*This will retrieve the list of posts from the backend and set it to the state of the
      Newsfeed component to initially load the posts that are rendered in the PostList component*/
      useEffect( () => {
        const abortController = new AbortController()
        const signal = abortController.signal

        listNewsFeed(
            { userId: jwt.user._id },
            { t: jwt.token },
            signal
            )
            .then( (data) => {
                if (data.error) { console.log(data.error) }
                else {
                    setPosts(data)
                }
          })

          return function cleanup(){
            abortController.abort()
          }

      }, [])

      /*The addPost function will take the new post that was created in the NewPost component
      and add it to the posts in the state.*/
      const addPost = (post) => {
          const updatedPost = [...posts]
          updatedPost.unshift(post)
          setPosts(updatedPost)
      }

      /*The removePost function will take the deleted post from the Post component in PostList
      and remove it from the posts in the state.*/
      const removePost = (post) => {
          const updatedPost = [...posts]
          const index = updatedPost.indexOf(post)
          updatedPost.splice(index, 1)
          setPosts(updatedPost)
      }

      return (
        <Card className={classes.card}>
            <Typography type="title" className={classes.title}>
                Newsfeed
            </Typography>
            <Divider/>
            <NewPost addUpdate={addPost}/>
            <Divider/>
            <PostList removeUpdate={removePost} posts={posts}/>
        </Card>
      )
  }