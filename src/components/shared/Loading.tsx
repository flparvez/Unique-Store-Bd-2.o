import React from 'react';
import Image from 'next/image';
import loadingImage from '../../../public/loading.jpg'; // Make sure to have a loading image in your public directory

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="loader">
        <Image src={loadingImage} alt="Loading..." width={500} height={500} className="animate-pulse" />
      </div>
      <h2 className="text-xl font-semibold mt-4 text-gray-700">Loading...</h2>
    </div>
  );
};

export default Loading;