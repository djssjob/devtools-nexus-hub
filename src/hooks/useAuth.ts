
import { useState, useEffect } from 'react';
import { User } from '@/types/devtools';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate Firebase auth - replace with actual Firebase implementation
    const simulateAuth = () => {
      setTimeout(() => {
        const mockUser: User = {
          uid: `user_${Date.now()}`,
          isAnonymous: true
        };
        setUser(mockUser);
        setIsLoading(false);
      }, 1000);
    };

    simulateAuth();
  }, []);

  return {
    user,
    userId: user?.uid || null,
    isLoading
  };
};
