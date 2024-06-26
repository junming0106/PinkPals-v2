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

function formatDate(timestamp) {
  if (!timestamp) {
    return "05/28 10:00"; // 设置默认时间
  }
  let date;
  if (timestamp.seconds) {
    date = new Date(timestamp.seconds * 1000); // Firestore Timestamp
  } else if (timestamp._seconds) {
    date = new Date(timestamp._seconds * 1000); // Firestore Timestamp in nested object
  } else {
    date = new Date(timestamp); // Direct date string or number
  }
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${month}/${day} ${hours}:${minutes}`;
}

function displayMessages(messages) {
  const container = document.getElementById("posts-container");
  container.innerHTML = "";
  messages.forEach((msg) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-content">
        <p class="card-hint">${msg.hint || "為善不欲人知的好人！"}</p>
        <p class="card-message">${msg.message}</p>
        <p class="card-timestamp">${formatDate(msg.timestamp)}</p>
      </div>
    `;
    container.appendChild(card);
  });
  initializeScroll();
}

function scrollLeft_f() {
  const container = document.getElementById("posts-container");
  container.scrollBy({ left: -300, behavior: "smooth" });
}

function scrollRight_f() {
  const container = document.getElementById("posts-container");
  container.scrollBy({ left: 300, behavior: "smooth" });
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
