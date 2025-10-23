// Clickability fixes for fitness app
export const initializeClickabilityFixes = () => {
  // Fix button click events
  const fixButtonClicks = () => {
    document.querySelectorAll('button, [role="button"]').forEach((button) => {
      if (!button.onclick && !button.getAttribute("data-click-fixed")) {
        button.style.cursor = "pointer";
        button.setAttribute("data-click-fixed", "true");

        // Add proper touch/click handling
        button.addEventListener("touchstart", (e) => {
          e.currentTarget.style.opacity = "0.7";
        });

        button.addEventListener("touchend", (e) => {
          e.currentTarget.style.opacity = "1";
        });

        button.addEventListener("mousedown", (e) => {
          e.currentTarget.style.opacity = "0.7";
        });

        button.addEventListener("mouseup", (e) => {
          e.currentTarget.style.opacity = "1";
        });

        button.addEventListener("mouseleave", (e) => {
          e.currentTarget.style.opacity = "1";
        });
      }
    });
  };

  // Fix navigation link issues
  const fixNavigationLinks = () => {
    document.querySelectorAll("a[href]").forEach((link) => {
      if (!link.getAttribute("data-click-fixed")) {
        link.setAttribute("data-click-fixed", "true");
        link.style.cursor = "pointer";
      }
    });
  };

  // Fix card click issues
  const fixCardClicks = () => {
    document.querySelectorAll('[data-clickable="true"]').forEach((card) => {
      if (!card.getAttribute("data-click-fixed")) {
        card.setAttribute("data-click-fixed", "true");
        card.style.cursor = "pointer";

        // Add touch effects
        card.addEventListener("touchstart", (e) => {
          e.currentTarget.style.opacity = "0.8";
        });

        card.addEventListener("touchend", (e) => {
          e.currentTarget.style.opacity = "1";
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
    subtree: true,
  });

  // Return cleanup function to prevent memory leaks
  return () => observer.disconnect();
};

// Removed auto-initialization - this is now handled by App.tsx to prevent double initialization
