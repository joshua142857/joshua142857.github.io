// Theme toggle
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  
  // Change icon based on mode
  if (document.body.classList.contains("dark-mode")) {
    themeIcon.textContent = "☀️";
  } else {
    themeIcon.textContent = "🌙";
  }
});

// Draw pattern on canvas
const canvas = document.getElementById("patternCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

function drawPattern() {
  const patternSize = 40;
  for (let x = 0; x < canvas.width; x += patternSize) {
    for (let y = 0; y < canvas.height; y += patternSize) {
      ctx.fillStyle = (x / patternSize + y / patternSize) % 2 === 0 ? "#000" : "#fff";
      ctx.fillRect(x, y, patternSize, patternSize);
    }
  }
}

drawPattern();
