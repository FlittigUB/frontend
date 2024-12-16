// src/hooks/useAuth.ts

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserRole } from '@/common/types';

const useAuth = () => {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to retrieve user data from token or API
  const retrieveUserData = async (token: string): Promise<User | null> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        return data.user;
      } else {
        console.error(
          'Failed to fetch user data:',
          response.status,
          response.statusText,
        );
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window !== 'undefined') {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
          setToken(savedToken);
          setLoggedIn(true);
          const userData = await retrieveUserData(savedToken);
          if (userData) {
            setUser(userData);
            console.log('?   ' + userData.role);
            setUserRole(userData.role); // Update state
            // Removed immediate logging of userRole to avoid undefined
          } else {
            setLoggedIn(false);
            setUser(null);
            router.push('/portal/logg-inn');
          }
        } else {
          setLoggedIn(false);
          setUser(null);
          router.push('/portal/logg-inn');
        }
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Optional: Effect to log userRole whenever it changes
  useEffect(() => {
    if (userRole !== null) {
      console.log('!  ' + userRole);
      // Additional side effects based on userRole can be handled here
    }
  }, [userRole]);

  return { loggedIn, token, userRole, user, loading };
};

export default useAuth;
