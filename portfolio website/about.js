document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // Navbar animation
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

  // Animating each section on scroll
  gsap.utils.toArray("section").forEach((section) => {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none reverse", // Play on scroll into view, reverse when out of view
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power2.out",
    });
  });

  // Toggle certificate images
  document.querySelectorAll(".toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const img = document.getElementById(btn.dataset.target);
      img.classList.toggle("visible");
    });
  });
});

// Get the elements
const hamburger = document.querySelector(".hamburger");
const navLinksMobile = document.querySelector(".nav-links-mobile");

// Add click event to the hamburger icon
hamburger.addEventListener("click", () => {
  // Toggle the 'open' class on both hamburger and mobile nav links
  hamburger.classList.toggle("open");
  navLinksMobile.classList.toggle("open");
});
