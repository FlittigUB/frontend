// src/hooks/useAuth.ts

import { useCallback, useEffect, useState } from 'react';
import { User, UserRole } from '@/common/types';

const useAuth = () => {
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
    []
  );

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === 'undefined') {
        return;
      }

      const savedToken = localStorage.getItem('token');

      if (!savedToken) {
        // No token => user is not logged in
        setLoggedIn(false);
        setUser(null);
        setIsAuthLoading(false);
        return;
      }

      // We have a token => attempt to fetch user data
      setToken(savedToken);
      setLoggedIn(true);
      const userData = await retrieveUserData(savedToken);
      if (userData) {
        setUser(userData);
        setUserRole(userData.role);
      } else {
        setLoggedIn(false);
        setUser(null);
      }
      setIsAuthLoading(false);
    };

    checkAuth();
  }, [retrieveUserData]);

  return { loggedIn, token, userRole, user, isAuthLoading };
};

export default useAuth;
