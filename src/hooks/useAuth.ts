// src/hooks/useAuth.ts

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserRole } from '@/common/types';

const useAuth = () => {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  const retrieveUserData = useCallback(
    async (token: string): Promise<User | null> => {
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
          console.log('Retrieved user data:', data.user);
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
    },
    [],
  );

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        console.log('Current path:', currentPath);

        // Exclude login page from authentication checks
        if (currentPath === '/portal/logg-inn') {
          console.log('On login page, skipping auth check.');
          setLoggedIn(false);
          setUser(null);
          setIsAuthLoading(false);
          return;
        }

        const savedToken = localStorage.getItem('token');
        console.log('Saved token:', savedToken);
        if (savedToken) {
          setToken(savedToken);
          setLoggedIn(true);
          const userData = await retrieveUserData(savedToken);
          if (userData) {
            setUser(userData);
            setUserRole(userData.role);
            console.log('User role set to:', userData.role);
          } else {
            console.log('User data retrieval failed, redirecting to login.');
            setLoggedIn(false);
            setUser(null);
            router.push('/portal/logg-inn');
          }
        } else {
          console.log('No token found, redirecting to login.');
          setLoggedIn(false);
          setUser(null);
          router.push('/portal/logg-inn');
        }
        setIsAuthLoading(false);
      }
    };

    checkAuth();
  }, [retrieveUserData, router]);

  useEffect(() => {
    if (userRole !== null) {
      console.log('User Role:', userRole);
      // Handle role-specific side effects here
    }
  }, [userRole]);

  return { loggedIn, token, userRole, user, isAuthLoading };
};

export default useAuth;
