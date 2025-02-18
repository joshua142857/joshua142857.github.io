document.addEventListener("DOMContentLoaded", () => {
    const projectTexts = document.querySelectorAll(".project-text");

    function fadeInProjects() {
        projectTexts.forEach(text => {
            const rect = text.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
                text.classList.add("visible"); // Fade in
            } else {
                text.classList.remove("visible"); // Fade out
            }
        });
    }

    // Run on scroll
    window.addEventListener("scroll", fadeInProjects);
    fadeInProjects(); // Run once on page load
});