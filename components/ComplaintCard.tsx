import { Complaint } from '@/app/generated/prisma';
import { ComplaintCardProps } from '@/types/types';
import Link from 'next/link';
import React, { memo } from 'react'



const ComplaintCard = ({id, companyId, title, description, status, category, attachments, createdAt, updatedAt, company}: ComplaintCardProps) => {
    
return (
    <Link href={`/ankesa/${id}`} aria-description='ankesa' className="bg-white shadow-lg p-4 flex flex-col gap-2 w-82 hover:bg-gray-50 transition-all relative">
        <div className="flex justify-between items-center mt-3">
        <h3 className="text-xl text-left font-medium text-gray-900 line-clamp-1">{title}</h3>
        </div>
        <p className="text-gray-700 text-sm text-left font-light line-clamp-3">{description}</p>
        <div className="text-xs text-gray-500 flex justify-between items-center">
        <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>

        <div className="absolute flex items-center justify-center max-w-[100px] rounded-tl-lg px-2 py-1 right-0 bottom-0 bg-indigo-600">
            <span className="text-white  text-xs font-medium line-clamp-1">{category}</span>
        </div>

        <div className="absolute flex text-left items-center justify-center max-w-[100px] rounded-br-lg px-2 py-1 left-0 top-0 bg-red-400">
            <span className="text-white  text-xs font-medium line-clamp-1 text-center">{company.name}</span>
        </div>

        {attachments && attachments.length > 0 &&  <div className="absolute flex text-left items-center justify-center max-w-[100px] rounded-bl-lg px-2 py-1 right-0 top-0 bg-black/80">
            <span className="text-white  text-xs font-medium line-clamp-1 text-right">{attachments.length} Imazhe</span>
        </div>}
    </Link>
    );
}

export default memo(ComplaintCard)