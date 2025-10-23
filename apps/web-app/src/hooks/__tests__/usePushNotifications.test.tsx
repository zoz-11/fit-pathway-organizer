import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { toast } from '@/components/ui/use-toast';
import {
  useNotificationPermission,
  useNotificationToasts,
  usePushNotifications,
  useNotificationPreferences,
} from '../usePushNotifications';
import { useAuth } from '../useAuthProvider';

// Mock dependencies
jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}));

jest.mock('../useAuthProvider', () => ({
  useAuth: jest.fn(),
}));

// Mock Notification API
global.Notification = {
  permission: 'default',
  requestPermission: jest.fn(),
} as any;

describe('useNotificationPermission', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset Notification API
    (global.Notification as any).permission = 'default';
    (global.Notification as any).requestPermission = jest.fn();
  });

  it('should detect notification support', () => {
    const { result } = renderHook(() => useNotificationPermission());

    expect(result.current.isSupported).toBe(true);
    expect(result.current.permission).toBe('default');
    expect(result.current.isGranted).toBe(false);
    expect(result.current.isDenied).toBe(false);
    expect(result.current.isDefault).toBe(true);
  });

  it('should handle browsers without notification support', () => {
    // Temporarily remove Notification from window
    const originalNotification = (global as any).Notification;
    delete (global as any).Notification;

    const { result } = renderHook(() => useNotificationPermission());

    expect(result.current.isSupported).toBe(false);
    expect(result.current.permission).toBe(null);

    // Restore Notification
    (global as any).Notification = originalNotification;
  });

  it('should request permission successfully', async () => {
    (global.Notification as any).requestPermission.mockResolvedValue('granted');

    const { result } = renderHook(() => useNotificationPermission());

    let permissionResult: boolean;
    await act(async () => {
      permissionResult = await result.current.requestPermission();
    });

    expect(permissionResult!).toBe(true);
    expect(result.current.permission).toBe('granted');
    expect(result.current.isGranted).toBe(true);
    expect(result.current.isDenied).toBe(false);
    expect(result.current.isDefault).toBe(false);
  });

  it('should handle permission denial', async () => {
    (global.Notification as any).requestPermission.mockResolvedValue('denied');

    const { result } = renderHook(() => useNotificationPermission());

    let permissionResult: boolean;
    await act(async () => {
      permissionResult = await result.current.requestPermission();
    });

    expect(permissionResult!).toBe(false);
    expect(result.current.permission).toBe('denied');
    expect(result.current.isGranted).toBe(false);
    expect(result.current.isDenied).toBe(true);
    expect(result.current.isDefault).toBe(false);
  });

  it('should handle permission request errors', async () => {
    (global.Notification as any).requestPermission.mockRejectedValue(new Error('Permission error'));

    const { result } = renderHook(() => useNotificationPermission());

    let permissionResult: boolean;
    await act(async () => {
      permissionResult = await result.current.requestPermission();
    });

    expect(permissionResult!).toBe(false);
  });

  it('should not request permission if not supported', async () => {
    // Temporarily remove Notification from window
    const originalNotification = (global as any).Notification;
    delete (global as any).Notification;

    const { result } = renderHook(() => useNotificationPermission());

    let permissionResult: boolean;
    await act(async () => {
      permissionResult = await result.current.requestPermission();
    });

    expect(permissionResult!).toBe(false);

    // Restore Notification
    (global as any).Notification = originalNotification;
  });
});

describe('useNotificationToasts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
  beforeEach(() => {
    jest.clearAllMocks();
    (global.Notification as any).permission = 'default';
    (global.Notification as any).requestPermission = jest.fn();
  });

  it('should not request permission if user is not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null });

    renderHook(() => usePushNotifications());

    expect((global.Notification as any).requestPermission).not.toHaveBeenCalled();
  });

  it('should not request permission if already requested', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: '123' } });

    // Render hook twice to simulate multiple calls
    const { result } = renderHook(() => usePushNotifications());
    renderHook(() => usePushNotifications());

    expect((global.Notification as any).requestPermission).not.toHaveBeenCalled();
  });

  it('should not request permission if not supported', () => {
    // Temporarily remove Notification from window
    const originalNotification = (global as any).Notification;
    delete (global as any).Notification;

    (useAuth as jest.Mock).mockReturnValue({ user: { id: '123' } });

    renderHook(() => usePushNotifications());

    expect(toast).not.toHaveBeenCalled();

    // Restore Notification
    (global as any).Notification = originalNotification;
  });

  it('should request permission successfully when user is authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: '123' } });
    (global.Notification as any).requestPermission.mockResolvedValue('granted');

    renderHook(() => usePushNotifications());

    await waitFor(() => {
      expect((global.Notification as any).requestPermission).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Notifications Enabled',
        description: 'You will now receive push notifications.',
        variant: 'default',
      });
    });
  });

  it('should handle permission denial', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: '123' } });
    (global.Notification as any).requestPermission.mockResolvedValue('denied');

    renderHook(() => usePushNotifications());

    await waitFor(() => {
      expect((global.Notification as any).requestPermission).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Permission Denied',
        description: 'Notification permission was denied. You will not receive push notifications.',
        variant: 'destructive',
      });
    });
  });

  it('should handle permission request errors', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: '123' } });
    (global.Notification as any).requestPermission.mockRejectedValue(new Error('Permission error'));

    renderHook(() => usePushNotifications());

    await waitFor(() => {
      expect((global.Notification as any).requestPermission).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'An error occurred while setting up notifications.',
        variant: 'destructive',
      });
    });
  });

  it('should return correct permission state', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null });

    const { result } = renderHook(() => usePushNotifications());

    expect(result.current.isSupported).toBe(true);
    expect(result.current.permission).toBe('default');
    expect(result.current.isGranted).toBe(false);
    expect(result.current.isDenied).toBe(false);
    expect(result.current.isDefault).toBe(true);
    expect(typeof result.current.requestPermission).toBe('function');
  });
});

describe('useNotificationPreferences', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default preferences', () => {
    const { result } = renderHook(() => useNotificationPreferences());

    expect(result.current.preferences).toEqual({
      workoutReminders: true,
      dietReminders: true,
      achievementNotifications: true,
      messageNotifications: true,
    });
  });

  it('should update preference', () => {
    const { result } = renderHook(() => useNotificationPreferences());

    act(() => {
      result.current.updatePreference('workoutReminders', false);
    });

    expect(result.current.preferences.workoutReminders).toBe(false);
    expect(result.current.preferences.dietReminders).toBe(true);
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

    const enabledPreferences = result.current.getEnabledPreferences();

    expect(enabledPreferences).toEqual(['messageNotifications']);
  });
});

describe('Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.Notification as any).permission = 'default';
    (global.Notification as any).requestPermission = jest.fn();
  });

  it('should handle complete permission flow', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: '123' } });
    (global.Notification as any).requestPermission.mockResolvedValue('granted');

    const { result: permissionResult } = renderHook(() => useNotificationPermission());
    const { result: toastResult } = renderHook(() => useNotificationToasts());
    const { result: pushResult } = renderHook(() => usePushNotifications());

    // Check initial state
    expect(permissionResult.current.permission).toBe('default');
    expect(pushResult.current.isGranted).toBe(false);

    // Request permission
    let permissionGranted: boolean;
    await act(async () => {
      permissionGranted = await permissionResult.current.requestPermission();
    });

    expect(permissionGranted!).toBe(true);
    expect(permissionResult.current.isGranted).toBe(true);

    // Show success toast
    act(() => {
      toastResult.current.showPermissionGrantedToast();
    });

    expect(toast).toHaveBeenCalledWith({
      title: 'Notifications Enabled',
      description: 'You will now receive push notifications.',
      variant: 'default',
    });
  });

  it('should handle permission denial flow', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: '123' } });
    (global.Notification as any).requestPermission.mockResolvedValue('denied');

    const { result: permissionResult } = renderHook(() => useNotificationPermission());
    const { result: toastResult } = renderHook(() => useNotificationToasts());

    // Request permission
    let permissionGranted: boolean;
    await act(async () => {
      permissionGranted = await permissionResult.current.requestPermission();
    });

    expect(permissionGranted!).toBe(false);
    expect(permissionResult.current.isDenied).toBe(true);

    // Show denied toast
    act(() => {
      toastResult.current.showPermissionDeniedToast();
    });

    expect(toast).toHaveBeenCalledWith({
      title: 'Permission Denied',
      description: 'Notification permission was denied. You will not receive push notifications.',
      variant: 'destructive',
    });
  });
});