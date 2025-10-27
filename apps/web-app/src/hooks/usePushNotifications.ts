import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "./useAuthProvider";
import { toast } from "../components/ui/use-toast";

/**
 * Hook for managing browser notification permissions and state.
 * Separated from push notification logic for better separation of concerns.
 */
export const useNotificationPermission = () => {
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    const supported = "Notification" in window;
    setIsSupported(supported);
    
    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      console.log("This browser does not support notifications");
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }, [isSupported]);

  return {
    permission,
    isSupported,
    requestPermission,
    isGranted: permission === "granted",
    isDenied: permission === "denied",
    isDefault: permission === "default",
  };
};

/**
 * Hook for displaying notification-related toasts.
 * Separated from permission logic for better reusability.
 */
export const useNotificationToasts = () => {
  const showPermissionDeniedToast = useCallback(() => {
    toast({
      title: "Permission Denied",
      description: "Notification permission was denied. You will not receive push notifications.",
      variant: "destructive",
    });
  }, []);

  const showPermissionErrorToast = useCallback(() => {
    toast({
      title: "Error",
      description: "An error occurred while setting up notifications.",
      variant: "destructive",
    });
  }, []);

  const showPermissionGrantedToast = useCallback(() => {
    toast({
      title: "Notifications Enabled",
      description: "You will now receive push notifications.",
      variant: "default",
    });
  }, []);

  return {
    showPermissionDeniedToast,
    showPermissionErrorToast,
    showPermissionGrantedToast,
  };
};

/**
 * Main hook for push notifications that combines permission and UI logic.
 * This replaces the original usePushNotifications hook.
 */
export const usePushNotifications = () => {
  const { user } = useAuth();
  const { permission, requestPermission, isSupported, isGranted, isDenied, isDefault } = useNotificationPermission();
  const { showPermissionDeniedToast, showPermissionErrorToast, showPermissionGrantedToast } = useNotificationToasts();
  
  // Use ref to prevent multiple permission requests
  const permissionRequestedRef = useRef(false);

  useEffect(() => {
    // Only request permission if user is authenticated, permission is default (not already granted/denied), 
    // permission hasn't been requested, and notifications are supported
    if (!user || permissionRequestedRef.current || !isSupported || !isDefault) {
      return;
    }

    const requestNotificationPermission = async () => {
      permissionRequestedRef.current = true;
      
      try {
        const granted = await requestPermission();
        
        if (granted) {
          showPermissionGrantedToast();
        } else {
          // Permission was not granted. We need to determine if it was:
          // 1. Denied by the user (permission state is now 'denied')
          // 2. Failed due to an error (permission state is still 'default')
          // We read from Notification.permission directly because the component's
          // permission state won't update until the next render, but we need the
          // current value immediately to show the appropriate toast.
          const currentPermissionState = "Notification" in window ? Notification.permission : null;
          if (currentPermissionState === 'denied') {
            showPermissionDeniedToast();
          } else {
            // Permission is still default, meaning an error occurred during the request
            showPermissionErrorToast();
          }
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
        showPermissionErrorToast();
      }
    };

    requestNotificationPermission();
  }, [user, requestPermission, isSupported, isDefault, showPermissionDeniedToast, showPermissionErrorToast, showPermissionGrantedToast]);

  return {
    permission,
    isSupported,
    isGranted,
    isDenied,
    isDefault,
    requestPermission,
  };
};

/**
 * Hook for managing notification preferences and settings.
 * This can be extended to handle user preferences for different notification types.
 */
export const useNotificationPreferences = () => {
  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    workoutReminders: true,
    dietReminders: true,
    achievementNotifications: true,
    messageNotifications: true,
  });

  const updatePreference = useCallback((key: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    // Here you could also save to localStorage or backend
  }, []);

  const getEnabledPreferences = useCallback(() => {
    return Object.entries(preferences)
      .filter(([, enabled]) => enabled)
      .map(([key]) => key);
  }, [preferences]);

  return {
    preferences,
    updatePreference,
    getEnabledPreferences,
  };
};