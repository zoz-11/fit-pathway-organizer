
// Clickability fixes for fitness app
export const initializeClickabilityFixes = () => {
  // Fix button click events
  const fixButtonClicks = () => {
    document.querySelectorAll('button, [role="button"]').forEach(button => {
      if (!button.onclick && !button.getAttribute('data-click-fixed')) {
        button.style.cursor = 'pointer';
        button.setAttribute('data-click-fixed', 'true');
        
        // Add proper touch/click handling
        button.addEventListener('touchstart', (e) => {
          e.currentTarget.style.opacity = '0.7';
        });
        
        button.addEventListener('touchend', (e) => {
          e.currentTarget.style.opacity = '1';
        });
        
        button.addEventListener('mousedown', (e) => {
          e.currentTarget.style.opacity = '0.7';
        });
        
        button.addEventListener('mouseup', (e) => {
          e.currentTarget.style.opacity = '1';
        });
      }
    });
  };

  // Fix navigation links
  const fixNavigationLinks = () => {
    document.querySelectorAll('a, [data-nav]').forEach(link => {
      if (!link.getAttribute('data-nav-fixed')) {
        link.style.cursor = 'pointer';
        link.setAttribute('data-nav-fixed', 'true');
        
        link.addEventListener('click', (e) => {
          if (link.getAttribute('href') === '#' || !link.getAttribute('href')) {
            e.preventDefault();
          }
        });
      }
    });
  };

  // Fix card interactions
  const fixCardClicks = () => {
    document.querySelectorAll('[class*="card"], .workout-card, .diet-card').forEach(card => {
      if (!card.getAttribute('data-card-fixed')) {
        card.style.cursor = 'pointer';
        card.setAttribute('data-card-fixed', 'true');
        
        card.addEventListener('click', (e) => {
          if (!e.target.closest('button')) {
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
              card.style.transform = 'scale(1)';
            }, 150);
          }
        });
      }
    });
  };

  // Initialize all fixes
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
