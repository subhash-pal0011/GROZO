import Image from 'next/image'
import React from 'react'

const UnAuthroize = () => {
  return (
    <div className='w-full h-screen items-center text-center justify-center flex flex-col'>
      <Image src="/cross.gif" height={200} width={200} alt='icon' />
      <h1 className='text-red-500 text-3xl font-semibold'>You Can't Access Page</h1>
    </div>
  )
}

export default UnAuthroize
