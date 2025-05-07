document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  // Navbar animation (fade in from the top)
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

  // Animation for section titles (fade in from the top)
  gsap.from("h2", {
    scrollTrigger: {
      trigger: "h2",
      start: "top 80%", // Trigger when the h2 comes into view
      toggleActions: "play none none reverse",
    },
    duration: 1,
    opacity: 0,
    y: -50,
    stagger: 0.2,
    delay: 0.5,
    ease: "power3.out",
  });

  // Animation for skill cards (fade in with a slight delay for better alignment)
  gsap.from(".skill-card", {
    scrollTrigger: {
      trigger: ".skills-section", // Trigger when the skill section comes into view
      start: "top 80%", // Trigger when the skill cards section comes into view
      toggleActions: "play none none reverse",
    },
    duration: 1.2,
    opacity: 0,
    y: 50,
    stagger: 0.3,
    ease: "power3.out",
    delay: 0.5,
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
