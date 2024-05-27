document.addEventListener("DOMContentLoaded", function () {
  fetchMessages();
});

function fetchMessages() {
  fetch("/get_messages", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data)) {
        displayMessages(data);
      } else {
        console.error("Failed to fetch messages:", data.error);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function displayMessages(messages) {
  const container = document.getElementById("posts-container");
  container.innerHTML = "";
  messages.forEach((msg) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
            <div class="card-content">
                <p class="card-hint">${msg.hint || "為善不欲人知的善人"}</p>
                <p class="card-message">${msg.message}</p>
            </div>
        `;
    container.appendChild(card);
  });
  initializeScroll();
}

function initializeScroll() {
  const container = document.querySelector(".posts-container");
  let isDown = false;
  let startX;
  let scrollLeft;

  container.addEventListener("mousedown", (e) => {
    isDown = true;
    container.classList.add("active");
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener("mouseleave", () => {
    isDown = false;
    container.classList.remove("active");
  });

  container.addEventListener("mouseup", () => {
    isDown = false;
    container.classList.remove("active");
  });

  container.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 3; // scroll-fast
    container.scrollLeft = scrollLeft - walk;
  });

  // For touch devices
  container.addEventListener("touchstart", (e) => {
    isDown = true;
    startX = e.touches[0].pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener("touchend", () => {
    isDown = false;
  });

  container.addEventListener("touchmove", (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX) * 3; // scroll-fast
    container.scrollLeft = scrollLeft - walk;
  });
}
