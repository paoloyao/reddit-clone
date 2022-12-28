import { useSession } from 'next-auth/react'
import Image from 'next/image';
import React from 'react'

type Props = {
  seed?: string,
  large?: boolean
}

function Avatar({ seed, large }: Props) {
  const { data: session } = useSession();
  return (
    <div className={`overflow-hidden relative h-10 w-10 rounded-full border-gray-300 bg-white ${large && 'h-20 w-20' }`}>
      <Image 
        fill
        src={`https://avatars.dicebear.com/api/open-peeps/${ seed || session?.user?.name || 'placeholder'}.svg`}
        alt='avatar pic'
      />
    </div>
  )
}

export default Avatar