import { useQuery } from '@apollo/client';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router'
import React from 'react'
import Post from '../../components/Post';
import { GET_ALL_POST_BY_POST_ID } from '../../graphql/queries'
import { Jelly } from '@uiball/loaders';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ADD_COMMENT } from '../../graphql/mutations';
import { useMutation } from '@apollo/client';
import { toast } from 'react-hot-toast';
import Avatar from '../../components/Avatar';
import ReactTimeago from 'react-timeago';

type FormData = {
  comment: string
}

function PostPage() {
  const params = useRouter();
  const { data: postData } = useQuery(GET_ALL_POST_BY_POST_ID, {
    variables: { id: params.query.postId }
  });
  const post: Post = postData?.getPost;
  const {data: session} = useSession();

  const handleIfNoSession = () => {
    if(!!session) return true;
    signIn();
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [GET_ALL_POST_BY_POST_ID, 'GET_ALL_POST_BY_POST_ID']
  });
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const loadingToast = toast.loading('Posting your comment...');
    const { data: { insertComment: insertedComment } } = await addComment({
      variables: {
        username: session?.user?.name,
        post_id: post.id,
        text: data.comment
      }
    });
    setValue('comment', '');
    toast.success('Successfully posted comment', {
      id: loadingToast
    })
  };

  if(!post) return (
    <div className='flex w-full items-center justify-center p-10'>
      <Jelly size={50} color="#FF4501" />
    </div>
  )

  return (
    <div className='mx-auto my-7 max-w-5xl'>
      <Post post={post} />

      <div className='rounded-b-md border border-top-0 border-gray-300 bg-white p-5 pl-16'>
        <p className='text-sm'>
          Comment as <span className='text-red-500'>{session?.user?.name}</span>
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-3'>
          <textarea 
            {...register('comment')}
            disabled={!session}
            className='h-24 rounded-md border p-2 pl-4 outline-none disabled:bg-gray-50 border-gray-200'
            placeholder={session ? 'Leave a your thoughts...' : 'Please sign in to comment...'}
            onFocus={() => handleIfNoSession()}
          />
          <button 
            disabled={!session}
            type='submit'
            className='rounded-full bg-red-500 p-3
            font-semibold text-white disabled:bg-gray-200'>
              Comment
            </button>
        </form>
      </div>
      <div className='-my-5 rounded-b-md border border-t-0 border-gray-300 py-5 px-10 bg-white'>
        <hr className='py-2' />
        {post?.comment?.map(com => 
          <div className='relative flex items-center space-x-2 space-y-5' key={com.id}>
            <hr className='absolute top-10 h-16 left-7 z-0 border' />
            <div className='z-50'>
              <Avatar seed={com.username} />
            </div>
            <div className='flex flex-col'>
              <p className='py-2 text-xs text-gray-400'>
                <span className='font-semibold text-gray-600'>{com.username}</span>
                {' '}
                <ReactTimeago live={false} date={com.created_at} />
              </p>
              <p>
                {com.text}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostPage
