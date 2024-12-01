'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import PortalLayout from '@/components/portal/PortalLayout';

export default function NotificationsPage() {
  const router = useRouter();

  const notifications = [
    {
      id: 1,
      title: 'Ny jobb søknad',
      description: 'Du har mottatt en ny jobb søknad for Leksehjelp.',
      timestamp: '10. nov. 2024, 12:00',
      type: 'info',
    },
    {
      id: 2,
      title: 'Jobb søknad godkjent',
      description: 'Linn Hansen har godkjent din søknad for Leksehjelp.',
      timestamp: '9. nov. 2024, 14:30',
      type: 'success',
    },
    {
      id: 3,
      title: 'Søknad avvist',
      description: 'Anne Berit Pedersen har avvist din søknad for Rengjøring.',
      timestamp: '8. nov. 2024, 09:00',
      type: 'error',
    },
    {
      id: 4,
      title: 'Melding om jobb',
      description:
        'Bergulf Lia har sendt deg en melding om jobben for Rydding.',
      timestamp: '7. nov. 2024, 16:20',
      type: 'info',
    },
  ];

  const notificationStyles: any = {
    info: 'bg-blue-100 text-blue-900 border-blue-400',
    success: 'bg-green-100 text-green-900 border-green-400',
    error: 'bg-red-100 text-red-900 border-red-400',
  };

  return (
    <PortalLayout>
      <div className="flex min-h-screen flex-col bg-yellow-50 px-6 py-8">
        {/* Header */}
        <div className="shadow-neumorphic flex items-center justify-between rounded-2xl bg-yellow-100 p-4 pb-6">
          <h1 className="text-3xl font-bold text-gray-800">Varslinger</h1>
          <button
            className="shadow-neumorphic rounded-full bg-yellow-300 px-4 py-2 font-semibold text-gray-800"
            onClick={() => router.push('/portal')}
          >
            Tilbake
          </button>
        </div>

        {/* Notifications List */}
        <div className="mt-8 grid gap-8">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`shadow-neumorphic grid grid-cols-1 gap-4 rounded-3xl border-l-8 bg-yellow-200 p-6 md:grid-cols-2 ${notificationStyles[notification.type]}`}
            >
              {/* Notification Details */}
              <div className="flex flex-col space-y-2">
                <p className="text-lg font-medium text-gray-800">
                  <strong>Tittel:</strong> {notification.title}
                </p>
                <p className="text-gray-800">
                  <strong>Beskrivelse:</strong> {notification.description}
                </p>
                <p className="text-gray-800">
                  <strong>Tidspunkt:</strong> {notification.timestamp}
                </p>
              </div>

              {/* Notification Type and Status */}
              <div
                className={`shadow-neumorphic flex items-center justify-center rounded-2xl p-4 text-center ${notificationStyles[notification.type]}`}
              >
                <p className="text-sm font-medium">
                  {notification.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
