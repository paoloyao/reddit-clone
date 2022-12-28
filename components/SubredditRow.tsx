import React from 'react'
import { ChevronUpIcon } from '@heroicons/react/outline'
import Avatar from './Avatar'
import Link from 'next/link'


function SubredditRow({index, topic}: {index: Number, topic: String}) {
 console.log(topic)
  return (
    <div className='flex items-center space-x-2 border-t bg--white px-4 py-2 last:sounded-b'>
      <p>{Number(index) + 1}</p>
      <ChevronUpIcon className='h-4 w-4 flex-0 text-green-400' />
      <Avatar seed={`/subreddit/${topic}`} />
      <p className='flex-1 truncate'>r/{topic}</p>
      <Link href={`/subreddit/${topic}`}>
        <div className='px-3 cursor-pointer rounded-full bg-blue-500 text-white'>
          View
        </div>
      </Link>
    </div>
  )
}

export default SubredditRow