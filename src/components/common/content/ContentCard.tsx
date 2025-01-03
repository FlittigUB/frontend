// src/components/common/content/InfoPageContent.tsx

import React from 'react';
import Image from 'next/image';

interface InfoPageContentProps {
  title: string;
  content: string;
  image?: string;
  dateCreated?: string;
  dateUpdated?: string;
}

const InfoPageContent: React.FC<InfoPageContentProps> = ({
                                                           title,
                                                           content,
                                                           image,
                                                           dateCreated,
                                                           dateUpdated,
                                                         }) => {
  return (
    <div className="w-full bg-white shadow-lg rounded-lg">
      {/* Header Image */}
      {image && (
        <div className="relative w-full h-80 md:h-96 rounded-t-lg overflow-hidden">
          <Image
            src={image}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="w-full h-full object-cover"
            priority
          />
        </div>
      )}

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Title */}
        <h1 className="text-4xl font-extrabold mb-6 text-center">{title}</h1>

        {/* Info Dates */}
        {(dateCreated || dateUpdated) && (
          <div className="flex justify-end text-sm text-gray-500 mb-6">
            {dateCreated && (
              <p className="mr-4">
                Opprettet: {new Date(dateCreated).toLocaleDateString('no-NO')}
              </p>
            )}
            {dateUpdated && (
              <p>Sist oppdatert: {new Date(dateUpdated).toLocaleDateString('no-NO')}</p>
            )}
          </div>
        )}

        {/* Content */}
        <div
          className="prose lg:prose-xl max-w-none text-foreground"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </div>
    </div>
  );
};

export default InfoPageContent;
