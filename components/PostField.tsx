import { useSession, signIn } from 'next-auth/react'
import React, { useState, useCallback } from 'react'
import Avatar from './Avatar';
import { LinkIcon, PhotographIcon } from '@heroicons/react/outline'
import { useForm } from "react-hook-form";
import { useMutation } from '@apollo/client';
import { ADD_POST, ADD_SUBREDDIT_TOPIC } from '../graphql/mutations';
import client from '../apollo-client';
import { GET_ALL_POST, GET_ALL_POST_BY_TOPIC, GET_SUBREDDIT_BY_TOPIC } from '../graphql/queries';
import toast from 'react-hot-toast';

type PostDataType = {
  postTitle: string,
  postBody: string,
  postImage: string,
  subreddit: string
}

type PropsSubreddit = {
  subreddit?: string
}

function PostField({ subreddit }: PropsSubreddit) {
  const { data: session } = useSession();
  const refetchValue = !!subreddit
    ? [GET_ALL_POST_BY_TOPIC, 'getPostListByTopic']
    : [GET_ALL_POST,'getPostList'];

  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: refetchValue,
    awaitRefetchQueries: true
  });

  const [addSubredditTopic] = useMutation(ADD_SUBREDDIT_TOPIC);
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PostDataType>();
  const [imageBoxOpen, setImageBoxOpen] = useState(false);
  const toggleImageBoxOpen = useCallback(() => setImageBoxOpen(!imageBoxOpen), [imageBoxOpen]);
  
  const addPostMutation = async (
    body: string,
    image: string,
    subreddit_id: string,
    title: string,
    username: string,
    ) => {
      const { data: { insertPost: newPostWithNewSubr } } = await addPost({
        variables: {
          body,
          subreddit_id,
          title,
          username,
          image,
        }
      });
      return newPostWithNewSubr;
  };

  const onSubmit = handleSubmit(async (formData) => {
    const notifyLoading = toast.loading('Processing new post...');
    try {
      // Check if Subreddit Exists. If not, create that subreddit
      const { data: { getSubredditListByTopic } } = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: {
          topic: subreddit || formData.subreddit
        }
      });
      console.log('2')
      const image = formData.postImage || 'https://images.pexels.com/photos/7600368/pexels-photo-7600368.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

      if(getSubredditListByTopic.length > 0) {
        //Use the existing subreddit
        addPostMutation(formData.postBody, image, getSubredditListByTopic[0].id, formData.postTitle, session?.user?.name ?? '')
      } else {
        //Create the New subreddit
        const { data: { insertSubredditTopic: createdSubreddit } } =  await addSubredditTopic({
          variables: {
            topic: subreddit || formData.subreddit
          }
        });
        addPostMutation(formData.postBody, image, createdSubreddit.id, formData.postTitle, session?.user?.name ?? '');
      }
      setValue('postBody', '');
      setValue('postImage', '');
      setValue('subreddit', '');
      setValue('postTitle', '');
      toast.success('Successfuly created new post!', {
        id: notifyLoading
      });
    } catch (error) {
      toast.error('Something went wrong', {
        id: notifyLoading
      });
      console.log(error);
    }
  });

  const handleIfNoSession = () => {
    if(!!session) return true;
    signIn();
  };
  
  const postTitlePlaceholder = () => {
    if(session) {
      if(!!subreddit) 
        return `Create a post in r/${subreddit}`; 
      return'Enter title of new post';
    }
    return 'Sign in to create post';
  };

  return (
    <form onSubmit={onSubmit}
      className={`${!!watch('postTitle') ? 'shadow-lg border border-gray-600' : ''} sticky top-20 z-50 p-2 bg-white border rounded-md border-gray-300 shadow-md`}
    >
      <div className='flex items-center space-x-3'>
        <Avatar />
        <input
          {...register('postTitle', { required: true, maxLength: 80 })}
          onFocus={() => handleIfNoSession()}
          className='bg-gray-50 p-2 pt-5 outline-none rounded-md flex-1'
          type='text' 
          placeholder={ postTitlePlaceholder() }
        />
        <PhotographIcon onClick={toggleImageBoxOpen} 
          className={`h-6 cursor-pointer text-gray-3000 ${imageBoxOpen && 'text-blue-300'}`} />
        <LinkIcon className={`h-6 text-gray-300`} />    
      </div>
      {!!watch('postTitle') && (
        <div className='flex flex-col py-2'>
          <div className='flex items-center px-2'>
            <p className='min-w-[90px]'>Body:</p>
            <input 
              className='m-2 flex-1 bg-blue-50 p-2 outline-none'
              {...register('postBody', { maxLength: 150 })} 
              type='text' 
              placeholder='Optional...' />
          </div>
          {!subreddit && (
            <div className='flex items-center px-2'>
              <p className='min-w-[90px]'>Subreddit:</p>
              <input 
                className='m-2 flex-1 bg-blue-50 p-2 outline-none'
                {...register('subreddit', { required: true, maxLength: 50 })} 
                type='text' 
                placeholder='Ex: nextjs' />
            </div>
          )}
          { imageBoxOpen && (
            <div className='flex items-center px-2'>
              <p className='min-w-[90px]'>Image Url:</p>
              <input 
                className='m-2 flex-1 bg-blue-50 p-2 outline-none'
                {...register('postImage')} 
                type='text' 
                placeholder='Optional...' />
            </div>
          )}
          {Object.keys(errors).length > 0 && (
            <div className='space-y-2 p-2 text-red-500'>
              {errors?.postTitle?.type === 'required' && (
                <p>Post Title field is required</p>
              )}
              {errors?.subreddit?.type === 'required' && (
                <p>Subreddit field is required</p>
              )}
            </div>
          )}
          {!!watch('postTitle') && (
            <button
              className='w-full md:max-w-lg rounded-full bg-blue-400 p-2 text-white mt-4 mx-auto'
            >
              Create Post
            </button>
          )}
        </div>
      )}
    </form>
  )
}

export default PostField