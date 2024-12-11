// src/hooks/useAuth.ts

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type UserRole = 'arbeidstaker' | 'arbeidsgiver' | null;

interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure Authorization header is set
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('User data fetched:', data.user);
        return data.user;
      } else {
        console.error('Failed to fetch user data:', response.status, response.statusText);
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
            // Optionally, set userRole based on userData
            setUserRole('arbeidstaker'); // Adjust based on your logic
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

  return { loggedIn, token, userRole, user, loading };
};

export default useAuth;
