/**
 * Unit tests for usePushNotifications and related hooks
 */
import { renderHook, act } from '@testing-library/react';
import { useNotificationPermission, useNotificationToasts, usePushNotifications, useNotificationPreferences } from '../usePushNotifications';
import { useAuth } from '../useAuthProvider';
import { toast } from '@/components/ui/use-toast';

// Mock dependencies
jest.mock('../useAuthProvider');
jest.mock('@/components/ui/use-toast');

// Mock Notification API
const mockNotification = {
  permission: 'default',
  requestPermission: jest.fn(),
};

Object.defineProperty(window, 'Notification', {
  value: mockNotification,
  writable: true,
  configurable: true,
});

describe('useNotificationPermission', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNotification.permission = 'default';
    mockNotification.requestPermission.mockResolvedValue('granted');
  });

  it('should detect notification support', () => {
    const { result } = renderHook(() => useNotificationPermission());

    expect(result.current.isSupported).toBe(true);
  });

  it('should return current permission status', () => {
    mockNotification.permission = 'granted';
    
    const { result } = renderHook(() => useNotificationPermission());

    expect(result.current.permission).toBe('granted');
    expect(result.current.isGranted).toBe(true);
    expect(result.current.isDenied).toBe(false);
    expect(result.current.isDefault).toBe(false);
  });

  it('should handle browsers without notification support', () => {
    // Temporarily remove Notification from window
    const originalNotification = window.Notification;
    delete (window as any).Notification;

    const { result } = renderHook(() => useNotificationPermission());

    expect(result.current.isSupported).toBe(false);
    expect(result.current.permission).toBe(null);

    // Restore Notification
    (window as any).Notification = originalNotification;
  });

  describe('requestPermission', () => {
    it('should request permission successfully', async () => {
      const { result } = renderHook(() => useNotificationPermission());

      let permissionResult;
      await act(async () => {
        permissionResult = await result.current.requestPermission();
      });

      expect(mockNotification.requestPermission).toHaveBeenCalled();
      expect(permissionResult).toBe(true);
      expect(result.current.permission).toBe('granted');
    });

    it('should handle permission denial', async () => {
      mockNotification.requestPermission.mockResolvedValue('denied');
      
      const { result } = renderHook(() => useNotificationPermission());

      let permissionResult;
      await act(async () => {
        permissionResult = await result.current.requestPermission();
      });

      expect(permissionResult).toBe(false);
      expect(result.current.isDenied).toBe(true);
    });

    it('should handle permission request errors', async () => {
      mockNotification.requestPermission.mockRejectedValue(new Error('Permission error'));
      
      const { result } = renderHook(() => useNotificationPermission());

      let permissionResult;
      await act(async () => {
        permissionResult = await result.current.requestPermission();
      });

      expect(permissionResult).toBe(false);
    });

    it('should not request permission if not supported', async () => {
      const originalNotification = window.Notification;
      delete (window as any).Notification;

      const { result } = renderHook(() => useNotificationPermission());

      let permissionResult;
      await act(async () => {
        permissionResult = await result.current.requestPermission();
      });

      expect(permissionResult).toBe(false);
      expect(mockNotification.requestPermission).not.toHaveBeenCalled();

      (window as any).Notification = originalNotification;
    });
  });
});

describe('useNotificationToasts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (toast as jest.MockedFunction<typeof toast>).mockImplementation(() => {});
  });

  it('should show permission denied toast', () => {
    const { result } = renderHook(() => useNotificationToasts());

    act(() => {
      result.current.showPermissionDeniedToast();
    });

    expect(toast).toHaveBeenCalledWith({
      title: 'Permission Denied',
      description: 'Notification permission was denied. You will not receive push notifications.',
      variant: 'destructive',
    });
  });

  it('should show permission error toast', () => {
    const { result } = renderHook(() => useNotificationToasts());

    act(() => {
      result.current.showPermissionErrorToast();
    });

    expect(toast).toHaveBeenCalledWith({
      title: 'Error',
      description: 'An error occurred while setting up notifications.',
      variant: 'destructive',
    });
  });

  it('should show permission granted toast', () => {
    const { result } = renderHook(() => useNotificationToasts());

    act(() => {
      result.current.showPermissionGrantedToast();
    });

    expect(toast).toHaveBeenCalledWith({
      title: 'Notifications Enabled',
      description: 'You will now receive push notifications.',
      variant: 'default',
    });
  });
});

describe('usePushNotifications', () => {
  const mockUser = { id: '123', email: 'test@example.com' };
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ user: mockUser } as any);
    mockNotification.permission = 'default';
    mockNotification.requestPermission.mockResolvedValue('granted');
    (toast as jest.MockedFunction<typeof toast>).mockImplementation(() => {});
  });

  it('should request permission when user is authenticated', async () => {
    renderHook(() => usePushNotifications());

    // Wait for the effect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockNotification.requestPermission).toHaveBeenCalled();
  });

  it('should not request permission if user is not authenticated', () => {
    mockUseAuth.mockReturnValue({ user: null } as any);

    renderHook(() => usePushNotifications());

    expect(mockNotification.requestPermission).not.toHaveBeenCalled();
  });

  it('should not request permission multiple times', async () => {
    const { rerender } = renderHook(() => usePushNotifications());

    // Initial render
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Rerender to trigger effect again
    rerender();

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Should only be called once
    expect(mockNotification.requestPermission).toHaveBeenCalledTimes(1);
  });

  it('should show granted toast when permission is granted', async () => {
    renderHook(() => usePushNotifications());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(toast).toHaveBeenCalledWith({
      title: 'Notifications Enabled',
      description: 'You will now receive push notifications.',
      variant: 'default',
    });
  });

  it('should show denied toast when permission is denied', async () => {
    mockNotification.requestPermission.mockImplementation(async () => {
      mockNotification.permission = 'denied';
      return 'denied';
    });

    renderHook(() => usePushNotifications());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(toast).toHaveBeenCalledWith({
      title: 'Permission Denied',
      description: 'Notification permission was denied. You will not receive push notifications.',
      variant: 'destructive',
    });
  });

  it('should show error toast when permission request fails', async () => {
    mockNotification.requestPermission.mockRejectedValue(new Error('Permission error'));

    renderHook(() => usePushNotifications());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(toast).toHaveBeenCalledWith({
      title: 'Error',
      description: 'An error occurred while setting up notifications.',
      variant: 'destructive',
    });
  });

  it('should not request permission if already granted', () => {
    mockNotification.permission = 'granted';

    renderHook(() => usePushNotifications());

    expect(mockNotification.requestPermission).not.toHaveBeenCalled();
  });

  it('should not request permission if already denied', () => {
    mockNotification.permission = 'denied';

    renderHook(() => usePushNotifications());

    expect(mockNotification.requestPermission).not.toHaveBeenCalled();
  });

  it('should return correct permission status', () => {
    mockNotification.permission = 'granted';

    const { result } = renderHook(() => usePushNotifications());

    expect(result.current.permission).toBe('granted');
    expect(result.current.isGranted).toBe(true);
    expect(result.current.isDenied).toBe(false);
    expect(result.current.isDefault).toBe(false);
  });
});

describe('useNotificationPreferences', () => {
  it('should initialize with default preferences', () => {
    const { result } = renderHook(() => useNotificationPreferences());

    expect(result.current.preferences).toEqual({
      workoutReminders: true,
      dietReminders: true,
      achievementNotifications: true,
      messageNotifications: true,
    });
  });

  it('should update preferences', () => {
    const { result } = renderHook(() => useNotificationPreferences());

    act(() => {
      result.current.updatePreference('workoutReminders', false);
    });

    expect(result.current.preferences.workoutReminders).toBe(false);
  });

  it('should get enabled preferences', () => {
    const { result } = renderHook(() => useNotificationPreferences());

    act(() => {
      result.current.updatePreference('workoutReminders', false);
      result.current.updatePreference('dietReminders', false);
    });

    const enabledPreferences = result.current.getEnabledPreferences();

    expect(enabledPreferences).toEqual(['achievementNotifications', 'messageNotifications']);
  });

  it('should handle multiple preference updates', () => {
    const { result } = renderHook(() => useNotificationPreferences());

    act(() => {
      result.current.updatePreference('workoutReminders', false);
      result.current.updatePreference('dietReminders', false);
      result.current.updatePreference('achievementNotifications', false);
    });

    expect(result.current.preferences).toEqual({
      workoutReminders: false,
      dietReminders: false,
      achievementNotifications: false,
      messageNotifications: true,
    });

    const enabledPreferences = result.current.getEnabledPreferences();
    expect(enabledPreferences).toEqual(['messageNotifications']);
  });
});