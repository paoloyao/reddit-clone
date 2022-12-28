import React, { useEffect, useState } from 'react'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BookmarkIcon,
  ChatAltIcon,
  DotsHorizontalIcon,
  GiftIcon,
  ShareIcon
} from '@heroicons/react/outline'
import Avatar from './Avatar'
import ReactTimeago from 'react-timeago'
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { ADD_VOTE } from '../graphql/mutations';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_VOTES_BY_POST_ID } from '../graphql/queries';
import { toast } from 'react-hot-toast';
import { valueToObjectRepresentation } from '@apollo/client/utilities';

type Props = {
  post: Post
}
function Post({ post }: Props) {
  const {data: session} = useSession();
  const [vote, setVote] = useState<boolean>();

  const {data: allVotesById, loading} = useQuery(GET_ALL_VOTES_BY_POST_ID, {
    variables: {
      id: post?.id
    }
  });

  const [insertVoteMutation] = useMutation(ADD_VOTE, {
    refetchQueries: [GET_ALL_VOTES_BY_POST_ID, 'getVoteByPostId']
  });
  const upVote = async (isUpvote: boolean) => {
    if(!session) return signIn();
    if(!!vote && isUpvote) return;
    if(vote === false && !isUpvote) return;
    const loadingToast = toast.loading('Processing your vote...');
    const {data: { insertVote }} = await insertVoteMutation({
      variables: {
        post_id: post?.id,
        upvote: isUpvote,
        username: session?.user?.name
      }
    });
    toast.success('Successfully voted', {
      id: loadingToast
    })
  };

  useEffect(() => {
    const votes: Vote[] = allVotesById?.getVoteByPostId;
    const voteData = votes?.find((vote) => vote.username == session?.user?.name)?.upvote;
    setVote(voteData);
  }, [allVotesById])

  const displayVotes = (data: any) => {
    const votes: Vote[] = data?.getVoteByPostId;
    if(votes?.length === 0) return 0;
    const displayNumber = votes?.reduce((total, vote) => (vote.upvote ? (total += 1) : (total -= 1)), 0)
    if(displayNumber === 0) return votes[0]?.upvote ? 1 : -1;
    return displayNumber;
  }

  return (
      <div className='flex cursor-pointer rounded-md border border-gray-300 
        bg-white shadow-sm hover:border hover:border-gray-600 w-full'>
        <div className='flex flex-col items-center justify-start space-y-1
          rounded-l-md bg-gray-50 p-4 text-gray-400'>
          {/* Votes */}
          <ArrowUpIcon
            onClick={() => upVote(true)}
            className={`voteButtons hover:text-red-400 ${vote && 'text-blue-400'}`} />
          <p className='text-black font-bold text-xs'>
            {displayVotes(allVotesById)}
          </p>
          <ArrowDownIcon
            onClick={() => upVote(false)}
            className={`voteButtons hover:text-blue-400 ${vote === false && 'text-red-400'}`} />
        </div>
        <div className='p-3 pb-1 w-full'>
            <div className='flex items-center space-x-2 w-full'>
              {/* Header */}
              <Avatar seed={post.username} />
              <p className='text-xs text-gray-400'>
                <Link href={`/subreddit/${post.subreddit.topic}`}>
                  <span className='font-bold hover:underline text-black hover:text-blue-400'>
                    r/{post.subreddit.topic}
                  </span>
                </Link>
                {` - Posted by u/${post.username} `}
                <ReactTimeago date={post.created_at} />
              </p>
            </div>
            <Link href={`/post/${post.id}`}>
              {/* Body */}
              <div className='py-4'>
                <h2 className='text-lg font-semibold'>{post.title}</h2>
                <p className='mt-2 text-sm font-light'>{post.body}</p>
              </div>
              {/* Image */}
              <div className='flex items-center w-3/4 mx-auto'>
                <img className='mx-auto' src={post.image || 'https://images.pexels.com/photos/2246476/pexels-photo-2246476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} />
              </div>
            </Link>
            {/* Footer */}
            <div className='flex space-x-4 text-gray-400'>
              <div className='postBUttons'>
                <ChatAltIcon className='h-6 w-6' />
                <p className=''>{post.comment.length} Comments</p>
              </div>
              <div className='postBUttons'>
                <GiftIcon className='h-6 w-6' />
                <p className='hidden sm:inline'>Award</p>
              </div>
              <div className='postBUttons'>
                <ShareIcon className='h-6 w-6' />
                <p className='hidden sm:inline'>Share</p>
              </div>
              <div className='postBUttons'>
                <BookmarkIcon className='h-6 w-6' />
                <p className='hidden sm:inline'>Save</p>
              </div>
              <div className='postBUttons'>
                <DotsHorizontalIcon className='h-6 w-6' />
              </div>
            </div>
        </div>
      </div>
  )
}

export default Post
