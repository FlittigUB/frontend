// src/hooks/useAuth.ts
import { useCallback, useEffect, useState, useMemo } from 'react';
import { User, UserRole } from '@/common/types';

const useAuth = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  const retrieveUserData = useCallback(async (token: string): Promise<User | null> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        return data.user;
      } else {
        console.error('Failed to fetch user data:', response.status, response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === 'undefined') return;

      const savedToken = localStorage.getItem('token');
      if (!savedToken) {
        setLoggedIn(false);
        setUser(null);
        setIsAuthLoading(false);
        return;
      }

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

  // Compute the profile completion status
  const profileCompleted = useMemo(() => {
    if (!user) return false;
    // For non-arbeidstaker roles, we consider the profile complete
    if (user.role !== 'arbeidstaker') return true;
    console.log(user);
    // For arbeidstaker, check for required Stripe fields
    return Boolean(user.stripe_account_id && user.stripe_person_id && user.stripe_verified);
  }, [user]);

  return { loggedIn, token, userRole, user, isAuthLoading, profileCompleted };
};

export default useAuth;
