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
  y: -60,
  duration: 1,
  opacity: 0,
  ease: "bounce.out",
});