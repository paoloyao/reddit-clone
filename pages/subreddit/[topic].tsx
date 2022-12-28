import { useRouter } from 'next/router';
import React from 'react'
import Avatar from '../../components/Avatar';
import Feed from '../../components/Feed';
import PostField from '../../components/PostField';

function Subreddit() {
  const { query: { topic } } = useRouter();
  return (
    <div className={'h-24 bg-red-600 p-8'}>
      <div className='-mx-8 mt-10 bg-white'>
        <div className='mx-auto flex max-w-5xl items-center space-x-4 pb-3'>
          <div className='-mt-5 rounded-full border border-gray-400 shadow-md'>
            <Avatar seed={topic as string} large />
          </div>
          <div className='py-2'>
            <h1 className='text-2xl font-semibold'>Welcome to the r/{topic} subreddit</h1>
            <p className='text-md text-gray-400'>r/{topic}</p>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-5xl mt-5 pb-10'>
        <PostField subreddit={topic as string} />
        <Feed topic={topic as string} />
      </div>
    </div>
  )
}

export default Subreddit
