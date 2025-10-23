import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useClickabilityFixes } from '../useClickabilityFixes';

// Mock MutationObserver
class MockMutationObserver {
  callback: MutationCallback;
  elements: Element[] = [];
  
  constructor(callback: MutationCallback) {
    this.callback = callback;
  }
  
  observe(target: Node, options: MutationObserverInit) {
    // Mock implementation
  }
  
  disconnect() {
    // Mock implementation
  }
  
  triggerMutation(addedNodes: Node[]) {
    const mutations: MutationRecord[] = addedNodes.map(node => ({
      type: 'childList',
      target: document.body,
      addedNodes: [node],
      removedNodes: [],
      previousSibling: null,
      nextSibling: null,
      attributeName: null,
      attributeNamespace: null,
      oldValue: null,
    } as MutationRecord));
    
    this.callback(mutations, this as any);
  }
}

(global as any).MutationObserver = MockMutationObserver;

describe('useClickabilityFixes', () => {
  let mockAddEventListener: jest.Mock;
  let mockRemoveEventListener: jest.Mock;
  let mockClick: jest.Mock;
  
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Mock DOM methods
    mockAddEventListener = jest.fn();
    mockRemoveEventListener = jest.fn();
    mockClick = jest.fn();
    
    // Mock document.body
    Object.defineProperty(document, 'body', {
      value: {
        classList: {
          add: jest.fn(),
          remove: jest.fn(),
        },
        querySelectorAll: jest.fn(),
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      },
      writable: true,
    });
    
    // Mock document.querySelectorAll
    document.querySelectorAll = jest.fn();
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should add clickability-fixes-enabled class to body', () => {
    renderHook(() => useClickabilityFixes());

    expect(document.body.classList.add).toHaveBeenCalledWith('clickability-fixes-enabled');
  });

  it('should process clickable cards with data-clickable attribute', () => {
    // Mock clickable card elements
    const mockCard1 = {
      hasAttribute: jest.fn((attr) => attr === 'data-clickable'),
      getAttribute: jest.fn((attr) => {
        if (attr === 'data-clickable') return 'true';
        if (attr === 'data-processed') return null;
        return null;
      }),
      setAttribute: jest.fn(),
      addEventListener: mockAddEventListener,
      click: mockClick,
    };
    
    const mockCard2 = {
      hasAttribute: jest.fn((attr) => attr === 'data-clickable'),
      getAttribute: jest.fn((attr) => {
        if (attr === 'data-clickable') return 'true';
        if (attr === 'data-processed') return null;
        return null;
      }),
      setAttribute: jest.fn(),
      addEventListener: mockAddEventListener,
      click: mockClick,
    };

    document.querySelectorAll = jest.fn().mockReturnValue([mockCard1, mockCard2]);

    renderHook(() => useClickabilityFixes());

    // Verify cards were processed
    expect(document.querySelectorAll).toHaveBeenCalledWith('[data-clickable="true"]:not([data-processed="true"])');
    expect(mockCard1.setAttribute).toHaveBeenCalledWith('data-processed', 'true');
    expect(mockCard2.setAttribute).toHaveBeenCalledWith('data-processed', 'true');
    expect(mockCard1.setAttribute).toHaveBeenCalledWith('tabindex', '0');
    expect(mockCard2.setAttribute).toHaveBeenCalledWith('tabindex', '0');
  });

  it('should add keyboard event handlers to clickable cards', () => {
    const mockCard = {
      hasAttribute: jest.fn((attr) => attr === 'data-clickable'),
      getAttribute: jest.fn((attr) => {
        if (attr === 'data-clickable') return 'true';
        if (attr === 'data-processed') return null;
        return null;
      }),
      setAttribute: jest.fn(),
      addEventListener: mockAddEventListener,
      click: mockClick,
    };

    document.querySelectorAll = jest.fn().mockReturnValue([mockCard]);

    renderHook(() => useClickabilityFixes());

    // Verify keyboard event handler was added
    expect(mockCard.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    
    // Test keyboard event handler
    const keydownHandler = mockCard.addEventListener.mock.calls.find(
      call => call[0] === 'keydown'
    )[1];
    
    // Test Enter key
    const enterEvent = { key: 'Enter', preventDefault: jest.fn() };
    keydownHandler(enterEvent);
    expect(enterEvent.preventDefault).toHaveBeenCalled();
    expect(mockCard.click).toHaveBeenCalled();
    
    // Reset click mock
    mockCard.click.mockClear();
    
    // Test Space key
    const spaceEvent = { key: ' ', preventDefault: jest.fn() };
    keydownHandler(spaceEvent);
    expect(spaceEvent.preventDefault).toHaveBeenCalled();
    expect(mockCard.click).toHaveBeenCalled();
  });

  it('should not process already processed cards', () => {
    const mockProcessedCard = {
      hasAttribute: jest.fn((attr) => attr === 'data-clickable'),
      getAttribute: jest.fn((attr) => {
        if (attr === 'data-clickable') return 'true';
        if (attr === 'data-processed') return 'true'; // Already processed
        return null;
      }),
      setAttribute: jest.fn(),
      addEventListener: mockAddEventListener,
      click: mockClick,
    };

    document.querySelectorAll = jest.fn().mockReturnValue([mockProcessedCard]);

    renderHook(() => useClickabilityFixes());

    // Verify card was not processed again
    expect(mockProcessedCard.setAttribute).not.toHaveBeenCalledWith('data-processed', 'true');
    expect(mockProcessedCard.setAttribute).not.toHaveBeenCalledWith('tabindex', '0');
  });

  it('should not add tabindex if card already has it', () => {
    const mockCardWithTabindex = {
      hasAttribute: jest.fn((attr) => {
        if (attr === 'data-clickable') return true;
        if (attr === 'tabindex') return true; // Already has tabindex
        return false;
      }),
      getAttribute: jest.fn((attr) => {
        if (attr === 'data-clickable') return 'true';
        if (attr === 'data-processed') return null;
        return null;
      }),
      setAttribute: jest.fn(),
      addEventListener: mockAddEventListener,
      click: mockClick,
    };

    document.querySelectorAll = jest.fn().mockReturnValue([mockCardWithTabindex]);

    renderHook(() => useClickabilityFixes());

    // Verify tabindex was not added again
    expect(mockCardWithTabindex.setAttribute).not.toHaveBeenCalledWith('tabindex', '0');
    expect(mockCardWithTabindex.setAttribute).toHaveBeenCalledWith('data-processed', 'true');
  });

  it('should handle dynamic content with mutation observer', () => {
    const mockObserverInstance = {
      observe: jest.fn(),
      disconnect: jest.fn(),
    };
    
    (MutationObserver as any).mockImplementation(() => mockObserverInstance);

    renderHook(() => useClickabilityFixes());

    // Verify observer was set up
    expect(mockObserverInstance.observe).toHaveBeenCalledWith(document.body, {
      childList: true,
      subtree: true,
    });
  });

  it('should cleanup on unmount', () => {
    const mockObserverInstance = {
      observe: jest.fn(),
      disconnect: jest.fn(),
    };
    
    (MutationObserver as any).mockImplementation(() => mockObserverInstance);

    const { unmount } = renderHook(() => useClickabilityFixes());

    unmount();

    // Verify cleanup
    expect(document.body.classList.remove).toHaveBeenCalledWith('clickability-fixes-enabled');
    expect(mockObserverInstance.disconnect).toHaveBeenCalled();
  });

  it('should handle mutation observer with relevant changes', () => {
    const mockObserverInstance = {
      observe: jest.fn(),
      disconnect: jest.fn(),
    };
    
    (MutationObserver as any).mockImplementation(() => mockObserverInstance);

    renderHook(() => useClickabilityFixes());

    // Get the mutation callback
    const mutationCallback = (MutationObserver as any).mock.calls[0][0];
    
    // Create mock mutation records with relevant changes
    const mockElement = document.createElement('div');
    mockElement.setAttribute('data-clickable', 'true');
    
    const mockMutationRecord = {
      type: 'childList',
      addedNodes: [mockElement],
    };

    // Trigger mutation
    mutationCallback([mockMutationRecord]);

    // Verify the mutation was processed
    expect(document.querySelectorAll).toHaveBeenCalled();
  });

  it('should ignore mutation observer changes without relevant elements', () => {
    const mockObserverInstance = {
      observe: jest.fn(),
      disconnect: jest.fn(),
    };
    
    (MutationObserver as any).mockImplementation(() => mockObserverInstance);

    renderHook(() => useClickabilityFixes());

    // Get the mutation callback
    const mutationCallback = (MutationObserver as any).mock.calls[0][0];
    
    // Create mock mutation records without relevant changes
    const mockElement = document.createElement('div');
    // No data-clickable attribute
    
    const mockMutationRecord = {
      type: 'childList',
      addedNodes: [mockElement],
    };

    // Clear the querySelectorAll mock before triggering mutation
    (document.querySelectorAll as jest.Mock).mockClear();

    // Trigger mutation
    mutationCallback([mockMutationRecord]);

    // Verify the mutation was ignored
    expect(document.querySelectorAll).not.toHaveBeenCalled();
  });

  it('should handle multiple clickable cards efficiently', () => {
    const mockCards = Array.from({ length: 10 }, (_, index) => ({
      hasAttribute: jest.fn((attr) => attr === 'data-clickable'),
      getAttribute: jest.fn((attr) => {
        if (attr === 'data-clickable') return 'true';
        if (attr === 'data-processed') return null;
        return null;
      }),
      setAttribute: jest.fn(),
      addEventListener: jest.fn(),
      click: jest.fn(),
    }));

    document.querySelectorAll = jest.fn().mockReturnValue(mockCards);

    renderHook(() => useClickabilityFixes());

    // Verify all cards were processed
    expect(document.querySelectorAll).toHaveBeenCalledWith('[data-clickable="true"]:not([data-processed="true"])');
    mockCards.forEach(card => {
      expect(card.setAttribute).toHaveBeenCalledWith('data-processed', 'true');
      expect(card.setAttribute).toHaveBeenCalledWith('tabindex', '0');
      expect(card.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });
});