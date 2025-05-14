'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/nextjs';

interface Subscription {
  plan_limit: number;
  plan_name: string;
  credits: number;
}

interface AuthContextType {
  user: any;
  isLoading: boolean;
  subscription: Subscription;
  getAuthToken: () => Promise<string | null>;
}

const defaultSubscription: Subscription = {
  plan_limit: 3,
  plan_name: 'Free',
  credits: 10
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { getToken, isSignedIn } = useClerkAuth();
  const { user, isLoaded } = useUser();
  const [subscription, setSubscription] = useState<Subscription>(defaultSubscription);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      if (isLoaded && isSignedIn && user) {
        try {
          // Here you would typically fetch the user's subscription data from your API
          // For now, we'll use the default subscription
          setSubscription(defaultSubscription);
        } catch (error) {
          console.error('Error loading user data:', error);
        } finally {
          setIsLoading(false);
        }
      } else if (isLoaded) {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, [isLoaded, isSignedIn, user]);

  const getAuthToken = async () => {
    if (!isSignedIn) return null;
    return getToken();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        subscription,
        getAuthToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

