document.getElementById("year").textContent = new Date().getFullYear();

const menu = document.querySelector(".menu");
const nav = document.querySelector("header nav");
if (menu && nav) {
  menu.addEventListener("click", () => {
    nav.style.display = nav.style.display === "grid" ? "none" : "grid";
  });
}

const likeButton = document.getElementById("likeBook");
const likeCount = document.getElementById("likeCount");
const bookStatus = document.getElementById("bookStatus");
const voteKey = "romanroman_book_interest_v1";

async function loadBookCount() {
  if (!likeButton || !likeCount) return;
  try {
    const response = await fetch("/book-interest", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    likeCount.textContent = String(data.count ?? 0);

    if (localStorage.getItem(voteKey) === "1") {
      likeButton.classList.add("liked");
      likeButton.disabled = true;
      likeButton.querySelector("span").textContent = "Враховано";
    }
  } catch {}
}

if (likeButton) {
  likeButton.addEventListener("click", async () => {
    if (localStorage.getItem(voteKey) === "1") return;

    likeButton.disabled = true;
    if (bookStatus) bookStatus.textContent = "";

    try {
      const response = await fetch("/book-interest", { method: "POST" });
      if (!response.ok) throw new Error("Vote failed");

      const data = await response.json();
      localStorage.setItem(voteKey, "1");
      likeCount.textContent = String(data.count ?? likeCount.textContent);
      likeButton.classList.add("liked");
      likeButton.querySelector("span").textContent = "Враховано";
      if (bookStatus) bookStatus.textContent = "Дякую — ваш інтерес враховано.";
    } catch {
      likeButton.disabled = false;
      if (bookStatus) bookStatus.textContent = "Не вдалося зберегти. Спробуйте ще раз.";
    }
  });
}

loadBookCount();
