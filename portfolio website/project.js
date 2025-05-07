window.addEventListener("DOMContentLoaded", () => {
  // Animate navbar items
  gsap.from(".navbar", {
    y: -100,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
  });

  gsap.from(".nav-links li", {
    y: -20,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    stagger: 0.2,
    delay: 0.3,
  });

  // Animate section title
  gsap.from(".section-title", {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    delay: 0.5,
  });

  // Animate project cards with stagger
  gsap.from(".project-card", {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    stagger: 0.3,
    delay: 0.8,
  });
});

// Get the elements
const hamburger = document.querySelector('.hamburger');
const navLinksMobile = document.querySelector('.nav-links-mobile');

// Add click event to the hamburger icon
hamburger.addEventListener('click', () => {
  // Toggle the 'open' class on both hamburger and mobile nav links
  hamburger.classList.toggle('open');
  navLinksMobile.classList.toggle('open');
});
