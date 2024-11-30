import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavigationBar from '@/components/portal/v1/NavigationBar';

interface PortalLayoutProps {
  children: React.ReactNode;
}

const PortalLayout: React.FC<PortalLayoutProps> = ({ children }) => {
  const router = useRouter();

  // Placeholder function to get user role; replace with actual logic
  const getUserRole = (): 'arbeidstaker' | 'arbeidsgiver' | null => {
    // Replace with your actual authentication and role retrieval logic
    // Example: return user.role;
    return 'arbeidstaker'; // or 'arbeidsgiver', or null if not logged in
  };

  const userRole = getUserRole();

  useEffect(() => {
    if (!userRole) {
      router.push('/portal/log-inn');
    }
  }, [userRole, router]);

  if (!userRole) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-[#FFF8DC] px-4 pb-16 pt-12 mt-10">
      {children}
      <NavigationBar />
    </div>
  );
};

export default PortalLayout;
