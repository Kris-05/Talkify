import { useAppStore } from '@/store';
import React from 'react'

const Profile = () => {

  const { userInfo } = useAppStore();
  console.log(userInfo);  

  return (
    <div>
      Profile
    </div>
  )
}

export default Profile
