<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>

document.addEventListener("DOMContentLoaded", () => {
  // 🎨 Lottie 애니메이션
  lottie.loadAnimation({
    container: document.getElementById("logo-lottie"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "animations/Yogalotusflower.json"
  });

  // 🎯 드래그 앤 드롭 카드 풀 생성
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

        // 안전하게 카테고리 체크
        const key = pose.category?.trim();
        if (poolMap[key]) {
          poolMap[key].appendChild(card);
        } else {
          console.warn("카테고리 불일치:", pose.category);
        }
      });

      // 🧩 SortableJS 초기화
      const pools = document.querySelectorAll(".card-pool");
      pools.forEach(pool => {
        new Sortable(pool, {
          group: {
            name: "poses",
            pull: "clone",   // 풀 → 루틴 복사
            put: false       // 풀에는 drop 불가
          },
          sort: false,        // 풀에서는 순서 안 바뀜
          animation: 150
        });
      });

      new Sortable(document.getElementById("routine-area"), {
        group: {
          name: "poses",
          pull: false,
          put: true
        },
        sort: true,           // 루틴 안에서 순서 변경 가능
        animation: 150
      });
    });

  // 🌙 다크모드 & 폰트 크기 조절
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

