// Clickability fixes for fitness app
export const initializeClickabilityFixes = () => {
  // Fix button click events
  const fixButtonClicks = () => {
    document.querySelectorAll('button, [role="button"]').forEach(button => {
      const htmlButton = button as HTMLElement;
      if (!(button as HTMLButtonElement).onclick && !button.getAttribute('data-click-fixed')) {
        htmlButton.style.cursor = 'pointer';
        button.setAttribute('data-click-fixed', 'true');
        
        // Add proper touch/click handling
        button.addEventListener('touchstart', (e) => {
          (e.currentTarget as HTMLElement).style.opacity = '0.7';
        });
        
        button.addEventListener('touchend', (e) => {
          (e.currentTarget as HTMLElement).style.opacity = '1';
        });
        
        button.addEventListener('mousedown', (e) => {
          (e.currentTarget as HTMLElement).style.opacity = '0.7';
        });
        
        button.addEventListener('mouseup', (e) => {
          (e.currentTarget as HTMLElement).style.opacity = '1';
        });
        
        button.addEventListener('mouseleave', (e) => {
          (e.currentTarget as HTMLElement).style.opacity = '1';
        });
      }
    });
  };
  
  // Fix navigation link issues
  const fixNavigationLinks = () => {
    document.querySelectorAll('a[href]').forEach(link => {
      const htmlLink = link as HTMLElement;
      if (!link.getAttribute('data-click-fixed')) {
        link.setAttribute('data-click-fixed', 'true');
        htmlLink.style.cursor = 'pointer';
      }
    });
  };
  
  // Fix card click issues
  const fixCardClicks = () => {
    document.querySelectorAll('[data-clickable="true"]').forEach(card => {
      const htmlCard = card as HTMLElement;
      if (!card.getAttribute('data-click-fixed')) {
        card.setAttribute('data-click-fixed', 'true');
        htmlCard.style.cursor = 'pointer';
        
        // Add touch effects
        card.addEventListener('touchstart', (e) => {
          (e.currentTarget as HTMLElement).style.opacity = '0.8';
        });
        
        card.addEventListener('touchend', (e) => {
          (e.currentTarget as HTMLElement).style.opacity = '1';
        });
      }
    });
  };
  
  // Run all fixes
  fixButtonClicks();
  fixNavigationLinks();
  fixCardClicks();
  
  // Re-run fixes when DOM changes
  const observer = new MutationObserver(() => {
    fixButtonClicks();
    fixNavigationLinks();
    fixCardClicks();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeClickabilityFixes);
} else {
  initializeClickabilityFixes();
}