import { auth } from '@/auth'
import React from 'react'

const AdminDashboard = async() => {
  const session = await auth()
  console.log(session?.user)
  return (
    <div>
      hii iam AdminDashboard
    </div>
  )
}

export default AdminDashboard

