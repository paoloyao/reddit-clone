import { useQuery } from '@apollo/client'
import React from 'react'
import { GET_ALL_POST, GET_ALL_POST_BY_TOPIC } from '../graphql/queries'
import Post from './Post';
import { Jelly } from '@uiball/loaders';

function Feed({ topic }: { topic?: string }) {
  const { data, error, loading } = !topic
    ? useQuery(GET_ALL_POST)
    : useQuery(GET_ALL_POST_BY_TOPIC, {
        variables: { topic } 
      });
  const posts: Post[] = !topic ? data?.getPostList : data?.getPostListByTopic;

  if(!posts) return (
    <div className='flex w-full items-center justify-center p-10'>
      <Jelly size={50} color="#FF4501" />
    </div>
  )

  return (
    <div className='mt-5 space-y-4 flex flex-col'>
      {posts?.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
}

export default Feed
