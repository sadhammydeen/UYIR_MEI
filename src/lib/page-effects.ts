/**
 * Page Effects - Adds 3D effects to page headers and sections
 */

export const initializePageEffects = () => {
  // Run once DOM is loaded
  if (typeof window === 'undefined') return;

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupEffects);
  } else {
    setupEffects();
  }
  
  // Setup resize and scroll listeners
  window.addEventListener('resize', debounce(updateEffects, 100));
  window.addEventListener('scroll', debounce(updateEffects, 100));
};

// Main setup function
function setupEffects() {
  // Find all headers and section titles
  const headers = document.querySelectorAll('.page-header, section h1, section h2');
  
  // Add decoration elements to headers
  headers.forEach(header => {
    if (!header.classList.contains('effect-enhanced')) {
      addDecorativeElements(header);
      header.classList.add('effect-enhanced');
    }
  });
  
  // Initial update
  updateEffects();
  
  // Add mouse move effect to whole document
  document.addEventListener('mousemove', handleMouseMove);
}

// Add floating decorative elements
function addDecorativeElements(element: Element) {
  // Only add to parent elements, not text nodes
  if (!(element instanceof HTMLElement)) return;
  
  // Don't add to elements that explicitly opt out
  if (element.hasAttribute('data-no-effects')) return;
  
  // Create random decorations
  const decorations = [
    createDecoration('circle', 'floating-element-slow'),
    createDecoration('square', 'floating-element'),
    createDecoration('circle', 'floating-element-fast')
  ];
  
  // Position decorations randomly
  decorations.forEach(decoration => {
    // Only append if parent is a valid container
    if (element.parentElement) {
      if (!element.parentElement.classList.contains('page-header')) {
        element.parentElement.style.position = 'relative';
        element.parentElement.style.overflow = 'hidden';
      }
      element.parentElement.appendChild(decoration);
    }
  });
}

// Create a single decorative element
function createDecoration(type: 'circle' | 'square', animationClass: string): HTMLElement {
  const element = document.createElement('div');
  
  // Common properties
  element.classList.add('decoration-element', animationClass);
  element.style.position = 'absolute';
  element.style.pointerEvents = 'none';
  element.style.zIndex = '-1';
  element.style.opacity = '0.15';
  
  // Random size between 20px and 80px
  const size = Math.floor(Math.random() * 60) + 20;
  element.style.width = `${size}px`;
  element.style.height = `${size}px`;
  
  // Random position within parent
  element.style.top = `${Math.floor(Math.random() * 80)}%`;
  element.style.left = `${Math.floor(Math.random() * 80)}%`;
  
  // Type-specific styles
  if (type === 'circle') {
    element.style.borderRadius = '50%';
    element.style.background = 'radial-gradient(circle at center, rgba(239, 68, 68, 0.1), rgba(240, 180, 41, 0.1))';
    element.style.filter = 'blur(10px)';
  } else {
    element.style.borderRadius = '12px';
    element.style.border = '1px solid rgba(239, 68, 68, 0.1)';
    element.style.transform = `rotate(${Math.floor(Math.random() * 45)}deg)`;
  }
  
  return element;
}

// Handle mouse movement for parallax effect
function handleMouseMove(e: MouseEvent) {
  // Get mouse position relative to viewport
  const mouseX = e.clientX / window.innerWidth;
  const mouseY = e.clientY / window.innerHeight;
  
  // Move elements with mouse for subtle 3D effect
  document.querySelectorAll('.decoration-element').forEach((element) => {
    if (!(element instanceof HTMLElement)) return;
    
    // Create inverse movement based on mouse position
    const moveFactor = element.classList.contains('floating-element-slow') ? 10 : 
                       element.classList.contains('floating-element-fast') ? 20 : 15;
    
    const moveX = (mouseX - 0.5) * moveFactor;
    const moveY = (mouseY - 0.5) * moveFactor;
    
    // Apply transform with original animation intact
    const origTransform = getComputedStyle(element).transform;
    element.style.transform = origTransform === 'none' 
      ? `translate(${moveX}px, ${moveY}px)` 
      : `${origTransform} translate(${moveX}px, ${moveY}px)`;
  });
}

// Update effects based on scroll position
function updateEffects() {
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  
  // Find all headers and animate based on scroll
  document.querySelectorAll('.page-header').forEach(header => {
    if (!(header instanceof HTMLElement)) return;
    
    const rect = header.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < viewportHeight) {
      // Element is in view
      const scrollProgress = 1 - (rect.bottom / (viewportHeight + rect.height));
      const parallaxAmount = Math.min(scrollProgress * 100, 50);
      
      // Move background with scroll for parallax effect
      const bgImage = header.querySelector('img');
      if (bgImage instanceof HTMLElement) {
        bgImage.style.transform = `translateY(${parallaxAmount}px)`;
      }
    }
  });
}

// Utility function to limit rapid calls
function debounce(func: Function, wait: number) {
  let timeout: number | null = null;
  
  return function(...args: any[]) {
    const context = this;
    if (timeout !== null) clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      func.apply(context, args);
      timeout = null;
    }, wait);
  };
} 