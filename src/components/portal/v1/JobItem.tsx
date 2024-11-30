import React from 'react';
import Link from 'next/link';
import { Job } from '@/common/types';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';

interface JobItemProps {
  job: Job;
  isEmployerView?: boolean;
}

const JobItem: React.FC<JobItemProps> = ({ job, isEmployerView = false }) => {
  return (
    <div className="rounded-xl bg-[#FFE135] p-4 shadow-md">
      <div className="rounded-lg bg-white p-4">
        <h2 className="text-2xl font-semibold text-[#333333]">{job.title}</h2>
        <p className="mt-2 text-[#333333]">{job.description}</p>
        <p className="mt-1 text-sm text-[#333333]">
          Sted: {job.place} | Tilgjengelig fra:{' '}
          {new Date(job.dateAccessible || '').toLocaleDateString('nb-NO')}
        </p>

        {/* Action Buttons */}
        {isEmployerView ? (
          <div className="mt-4 flex items-center">
            <Link href={`/portal/arbeidsgiver/rediger-jobb/${job.id}`}>
              <button className="mr-4 flex items-center justify-center rounded-full border-2 border-black bg-white p-3 shadow focus:outline-none">
                <FaEdit className="text-[#000000]" />
              </button>
            </Link>
            <button className="flex items-center justify-center rounded-full border-2 border-black bg-white p-3 shadow focus:outline-none">
              <FaTrashAlt className="text-[#000000]" />
            </button>
          </div>
        ) : (
          <Link href={`/app/soknad/${job.id}`}>
            <button className="mt-4 flex items-center justify-center rounded-full border-2 border-black bg-white px-6 py-2 text-[#333333] shadow focus:outline-none">
              Søk på denne jobben
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default JobItem;
