import { useEffect } from "react";

/**
 * Hook for handling clickability fixes with performance optimization
 * Uses CSS-based approach instead of DOM manipulation where possible
 */
export const useClickabilityFixes = () => {
  useEffect(() => {
    // Add CSS class to body to enable CSS-based fixes
    document.body.classList.add('clickability-fixes-enabled');

    // Handle dynamic content with intersection observer for performance
    const handleDynamicContent = () => {
      // Only handle elements that need special treatment
      const clickableCards = document.querySelectorAll('[data-clickable="true"]:not([data-processed="true"])');
      
      clickableCards.forEach((card) => {
        card.setAttribute('data-processed', 'true');
        
        // Add keyboard support for clickable cards
        if (!card.hasAttribute('tabindex')) {
          card.setAttribute('tabindex', '0');
        }
        
        // Add keyboard event handlers
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            (card as HTMLElement).click();
          }
        });
      });
    };

    // Initial processing
    handleDynamicContent();

    // Use mutation observer for dynamic content with debouncing
    let mutationTimeout: NodeJS.Timeout;
    const observer = new MutationObserver((mutations) => {
      // Debounce mutations to avoid excessive processing
      clearTimeout(mutationTimeout);
      mutationTimeout = setTimeout(() => {
        const hasRelevantChanges = mutations.some(mutation => 
          Array.from(mutation.addedNodes).some(node => 
            node.nodeType === Node.ELEMENT_NODE && 
            (node as Element).matches && (
              (node as Element).matches('[data-clickable="true"]') ||
              (node as Element).querySelector('[data-clickable="true"]')
            )
          )
        );
        
        if (hasRelevantChanges) {
          handleDynamicContent();
        }
      }, 100); // 100ms debounce
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup function
    return () => {
      document.body.classList.remove('clickability-fixes-enabled');
      observer.disconnect();
      clearTimeout(mutationTimeout);
    };
  }, []); // Empty dependency array ensures this runs only once
};