import Image from 'next/image'
import React from 'react';
import {
  HomeIcon, 
  ChevronDownIcon, 
  SearchIcon,
  MenuIcon, 
} from '@heroicons/react/solid';
import {
  BellIcon,
  ChatIcon,
  GlobeIcon,
  PlusIcon,
  SparklesIcon,
  SpeakerphoneIcon,
  VideoCameraIcon,
} from '@heroicons/react/outline';
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link';

function Header() {
  const { data: session } = useSession();

  return (
    <div className=' sticky top-0 z-50 flex bg-white px-4 py-2 shadow-sm items-center'>
      <div className='relative w-20 h-10 flex-shrink-0 cursor-pointer'>
        <Link href='/'>
          <Image
            src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Reddit_logo_new.svg/1920px-Reddit_logo_new.svg.png?20220313085316' 
            alt='reddit logo'
            fill
            style={{ objectFit: 'contain' }}
          />
        </Link>
      </div>
      <Link href='/'>
        <div className='mx-7 flex items-center xl:min-w-[300px]'>
          <HomeIcon className='h-5 w-5' />
          <p className='flex-1 ml-2 hidden lg:inline'>Home</p>
          <ChevronDownIcon className='h-5 w-5' />
        </div>
      </Link>

      <form className='flex flex-1 items-center space-x-2 border border-gray-200 rounded-md bg-gray-100 px-3 py-1'>
        <SearchIcon className='h-6 w-6 text-gray-400' />
        <input type='text' placeholder='Search in Reddit Clone...' className='flex-1 bg-transparent outline-none' />
        <button type='submit' hidden />
      </form>

      <div className='hidden lg:inline-flex text-gray-500 space-x-2 mx-5 items-center'>
        <SparklesIcon className='icon' />
        <GlobeIcon className='icon' />
        <VideoCameraIcon className='icon' />
        <hr className='h-10 border border-gray-100' />
        <ChatIcon className='icon' />
        <BellIcon className='icon' />
        <PlusIcon className='icon' />
        <SpeakerphoneIcon className='icon' />
      </div>
      <div className='lg:hidden flex text-gray-500 space-x-2 mx-5 items-center'>
        <MenuIcon className='icon' />
      </div>

      {
        session ? (
          <div onClick={() => signOut()} className='hidden lg:flex items-center space-x-2 p-2'>
            <div className='relative h-6 w-6 flex-shrink-0'>
              <Image alt='reddit icon' style={{ objectFit: 'contain' }} fill src='https://upload.wikimedia.org/wikipedia/commons/0/07/Reddit_icon.svg' />
            </div>
            <div className='flex-1 text-xs'>
              <p className='truncate'>{session?. user?.name}</p>
              <p className='text-gray-400'>Sign Out</p>
            </div>
            <ChevronDownIcon className='h-5 flex-shrink-0 text-gray-400' />
          </div>
        ) : (
          <div onClick={() => signIn()} className='hidden lg:flex items-center space-x-2 p-2'>
            <div className='relative h-6 w-6 flex-shrink-0'>
              <Image alt='reddit icon' style={{ objectFit: 'contain' }} fill src='https://upload.wikimedia.org/wikipedia/commons/0/07/Reddit_icon.svg' />
            </div>
            <p className='text-gray-400'>Sign In</p>
          </div>
        )
      }
    </div>
  )
}

export default Header 