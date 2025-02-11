document.addEventListener("DOMContentLoaded", () => {
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("afterbegin", data);
        })
        .catch(error => console.error("Error loading header:", error));

    const scene = document.createElement("div");
    scene.classList.add("scene");

    const cube = document.createElement("div");
    cube.classList.add("cube");

    for (let i = 0; i < 6; i++) {
        const face = document.createElement("div");
        face.classList.add("face", `face${i}`);
        cube.appendChild(face);
    }

    scene.appendChild(cube);
    document.body.appendChild(scene);

    let angleX = 0, angleY = 0;

    function rotateCube() {
        angleX += 1;
        angleY += 1;
        cube.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        requestAnimationFrame(rotateCube);
    }

    rotateCube();
});
