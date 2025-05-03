document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  // Navbar animation (fade in from the top)
  gsap.from(".navbar", {
    scrollTrigger: {
      trigger: ".navbar",
      start: "top top", // Trigger when the navbar comes into view
      toggleActions: "play none none reverse", // Play when in view, reverse when out of view
    },
    duration: 1.5,
    opacity: 0,
    y: -50,
    ease: "power3.out",
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
