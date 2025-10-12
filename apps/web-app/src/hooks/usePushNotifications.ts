import { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './useAuthProvider';
import { toast } from '../components/ui/use-toast';

export const usePushNotifications = () => {
  const { user } = useAuth();
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null);

  useEffect(() => {
    const requestPermission = async () => {
      if (!user) return;
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        if (permission !== 'granted') {
          toast({
            title: 'Permission Denied',
            description: 'Notification permission was denied. You will not receive push notifications.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        toast({
          title: 'Error',
          description: 'An error occurred while setting up notifications.',
          variant: 'destructive',
        });
      }
    };
    requestPermission();
  }, [user]);

  // No push notification token logic, as Firebase is removed
  return { notificationPermission };
};
