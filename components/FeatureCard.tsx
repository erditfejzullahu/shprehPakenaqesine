import Image from 'next/image';
import React, { memo } from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: any;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-8 shadow-lg hover:shadow-md transition-shadow hover:-translate-y-1">
      <div className='mx-auto w-full mb-4'>
        <Image 
          src={`/${icon}`}
          alt={icon}
          width={48}
          height={48}
          className='size-12 mx-auto'
        />
      </div>
      <h3 className="text-xl pointer-events-none max-[470px]:text-lg font-semibold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 pointer-events-none max-[420px]:text-sm">{description}</p>
    </div>
  );
};

export default memo(FeatureCard);