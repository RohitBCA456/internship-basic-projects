gsap.utils.toArray("section").forEach((section) => {
  gsap.from(section, {
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power2.out",
  });
});

gsap.registerPlugin(ScrollTrigger);

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