import { cn, handleApiError } from '../utils';
import { toast } from 'sonner';

// Mock the toast module
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      const result = cn('class1', 'class2');
      expect(result).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      const result = cn('base-class', true && 'conditional-class', false && 'should-not-appear');
      expect(result).toBe('base-class conditional-class');
    });

    it('should handle array of classes', () => {
      const result = cn(['class1', 'class2'], 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('should handle object syntax', () => {
      const result = cn({
        'active-class': true,
        'inactive-class': false,
        'always-present': true,
      });
      expect(result).toBe('active-class always-present');
    });

    it('should handle mixed inputs', () => {
      const result = cn(
        'string-class',
        ['array-class1', 'array-class2'],
        { 'object-class': true },
        null,
        undefined,
        0,
        false
      );
      expect(result).toBe('string-class array-class1 array-class2 object-class');
    });

    it('should handle empty inputs', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('should deduplicate classes', () => {
      const result = cn('class1', 'class1', 'class2');
      expect(result).toBe('class1 class2');
    });
  });

  describe('handleApiError', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      console.error = jest.fn();
    });

    it('should handle Edge Function network errors', () => {
      const networkError = new Error('Failed to fetch');
      handleApiError(networkError);

      expect(console.error).toHaveBeenCalledWith('API Error:', networkError);
      expect(toast.error).toHaveBeenCalledWith('Edge Function Error', {
        description: expect.stringContaining('Unable to connect to backend services'),
      });
    });

    it('should handle NetworkError', () => {
      const networkError = new Error('NetworkError when attempting to fetch resource');
      handleApiError(networkError);

      expect(toast.error).toHaveBeenCalledWith('Edge Function Error', {
        description: expect.stringContaining('Unable to connect to backend services'),
      });
    });

    it('should handle Supabase specific errors', () => {
      const supabaseError = {
        code: 'PGRST116',
        message: 'JWT expired',
        status: 401,
      };
      handleApiError(supabaseError);

      expect(toast.error).toHaveBeenCalledWith('Error PGRST116', {
        description: 'JWT expired',
      });
    });

    it('should handle generic Error objects', () => {
      const genericError = new Error('Something went wrong');
      handleApiError(genericError, 'Custom error message');

      expect(toast.error).toHaveBeenCalledWith('Custom error message', {
        description: 'Something went wrong',
      });
    });

    it('should handle string errors', () => {
      const stringError = 'String error message';
      handleApiError(stringError);

      expect(toast.error).toHaveBeenCalledWith('An unexpected error occurred.', {
        description: '"String error message"',
      });
    });

    it('should handle object errors', () => {
      const objectError = { type: 'validation', field: 'email' };
      handleApiError(objectError);

      expect(toast.error).toHaveBeenCalledWith('An unexpected error occurred.', {
        description: '{"type":"validation","field":"email"}',
      });
    });

    it('should handle null errors', () => {
      handleApiError(null);

      expect(toast.error).toHaveBeenCalledWith('An unexpected error occurred.', {
        description: 'null',
      });
    });

    it('should handle undefined errors', () => {
      handleApiError(undefined);

      expect(toast.error).toHaveBeenCalledWith('An unexpected error occurred.', {
        description: undefined,
      });
    });

    it('should use default message when no custom message provided', () => {
      const error = new Error('Test error');
      handleApiError(error);

      expect(toast.error).toHaveBeenCalledWith('An unexpected error occurred.', {
        description: 'Test error',
      });
    });

    it('should use custom message when provided', () => {
      const error = new Error('Test error');
      handleApiError(error, 'Custom message');

      expect(toast.error).toHaveBeenCalledWith('Custom message', {
        description: 'Test error',
      });
    });

    it('should handle complex Supabase error objects', () => {
      const complexError = {
        code: '23505',
        message: 'duplicate key value violates unique constraint',
        status: 400,
        error: 'Bad Request',
      };
      handleApiError(complexError);

      expect(toast.error).toHaveBeenCalledWith('Error 23505', {
        description: 'duplicate key value violates unique constraint',
      });
    });
  });
});