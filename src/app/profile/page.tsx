
import ProfilePage from '@/components/shared/ProfilePage';

// import OrderTable from '@/components/OrderTable';

import React from 'react';

export const metadata = {
  title: 'My Account',
  description: 'My Account Unique Store BD',
};



const Profile =async  () => {

  const res = await fetch('https://landig-store.vercel.app/api/order')
  const data = await res.json()

  // Fetch orders

  // Fetch user session



 
  return (
<div>
    <ProfilePage orders ={data?.orders} />
</div>
  );
};

export default Profile;