import { Complaint } from '@/app/generated/prisma';
import { ComplaintCardProps } from '@/types/types';
import React from 'react'



const ComplaintCard = ({id, companyId, title, description, status, category, attachments, createdAt, updatedAt, company}: ComplaintCardProps) => {
    
return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-3 w-72 hover:shadow-lg transition-all">
        <div className="flex justify-between items-center">
        <h3 className="text-md font-bold text-gray-900">{title}</h3>
        <span
            className={`text-xs px-2 py-1 rounded-full`}
        >
            {status}
        </span>
        </div>
        <p className="text-gray-700 text-sm line-clamp-4">{description}</p>
        <div className="text-xs text-gray-500 flex justify-between items-center">
        <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
    </div>
    );
}

export default ComplaintCard