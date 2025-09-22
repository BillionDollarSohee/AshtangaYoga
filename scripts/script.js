document.addEventListener("DOMContentLoaded", () => {
  // Lottie 애니메이션
  lottie.loadAnimation({
    container: document.getElementById("logo-lottie"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "animations/Yogalotusflower.json"
  });

  // 드래그 앤 드롭
  fetch("data/poses.json")
    .then(res => res.json())
    .then(poses => {
      const poolMap = {
        Standing: document.getElementById("card-pool-standing"),
        Seated: document.getElementById("card-pool-seated"),
        Finishing: document.getElementById("card-pool-finishing")
      };

      poses.forEach(pose => {
        const card = document.createElement("div");
        card.className = "yoga-card";
        card.setAttribute("draggable", "true");

        // 🔥 flip 구조로 수정
        card.innerHTML = `
          <div class="card-inner">
            <!-- 앞면 -->
            <div class="card-front">
              <h5>${pose.name}</h5>
              <img src="${pose.image}" alt="${pose.name}">
            </div>
            <!-- 뒷면 -->
            <div class="card-back">
              <p>${pose.desc}</p>
              <p class="pronunciation">[${pose.pronunciation || "발음"}]</p>
            </div>
          </div>
        `;

        card.addEventListener("dragstart", e => {
          e.dataTransfer.setData("text/plain", JSON.stringify(pose));
        });

        if (poolMap[pose.category]) {
          poolMap[pose.category].appendChild(card);
        }
      });
    });

  // 드롭 영역 이벤트
  const routineArea = document.getElementById("routine-area");
  routineArea.addEventListener("dragover", e => e.preventDefault());
  routineArea.addEventListener("drop", e => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    const pose = JSON.parse(data);

    const card = document.createElement("div");
    card.className = "yoga-card";
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <h5>${pose.name}</h5>
          <img src="${pose.image}" alt="${pose.name}">
        </div>
        <div class="card-back">
          <p>${pose.desc}</p>
          <p class="pronunciation">[${pose.pronunciation || "발음"}]</p>
        </div>
      </div>
    `;
    routineArea.appendChild(card);
  });

  // 다크모드 & 폰트 크기 조절
  const fontSizeControl = document.getElementById("font-size-control");
  const darkModeToggle = document.getElementById("darkModeToggle");

  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    if (darkModeToggle) darkModeToggle.textContent = "☀️ 라이트모드";
  }

  fontSizeControl?.addEventListener("input", function () {
    document.body.style.fontSize = this.value + "px";
  });

  darkModeToggle?.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      this.textContent = "☀️ 라이트모드";
      localStorage.setItem("darkMode", "enabled");
    } else {
      this.textContent = "🌙 다크모드";
      localStorage.setItem("darkMode", "disabled");
    }
  });
});
