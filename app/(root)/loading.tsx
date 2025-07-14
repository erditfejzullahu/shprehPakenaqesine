import React from 'react'
import { PageLoader } from '@/components/LoadingComponents'

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-indigo-600 font-medium">Loading...</p>
    </div>
  );
};

export default Loading
