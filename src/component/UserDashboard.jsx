import React from 'react'
import HeroSection from './HeroSection'
import TypesProduct from './TypesProduct'
import dbConnect from '@/connectDb/dbConnect'
import Grozo from '@/models/grozoModels'
import ItemCart from './ItemCart'

const UserDashboard = async () => {
  await dbConnect()
  const getGrocery = await Grozo.find({})
  const plainData = JSON.parse(JSON.stringify(getGrocery))
  return (
    <div className=' min-h-screen bg-linear-to-r from-green-100 via-green-100 to-orange-100'>
      <HeroSection />
      <div className='md:px-2 shadow-xs shadow-orange-200'>
        <TypesProduct />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 px-4 p-5">
        {plainData.map((item) => (
          <ItemCart key={item._id} data={item} />
        ))}
      </div>
    </div>
  )
}

export default UserDashboard
