document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST", // ✅ TO‘G‘RI METOD
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }), // ✅ body faqat POST/PUT da bo‘ladi
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        if (data.role === "admin") {
          window.location.href = "admin.html";
        } else {
          window.location.href = "user.html";
        }
      } else {
        document.getElementById("error").textContent =
          data.error || "Login xatosi";
      }
    } catch (err) {
      console.error("Xatolik:", err);
      document.getElementById("error").textContent =
        "Server bilan bog‘lanishda xatolik";
    }
  });

// Qidirish funksiyasi
document
  .getElementById("searchInput")
  .addEventListener("input", async function () {
    const query = this.value.trim();
    if (!query) {
      loadFiles();
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/users/files/search?q=${encodeURIComponent(
          query
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      renderFiles(data);
    } catch (err) {
      console.error("Qidirishda xatolik:", err);
    }
  });

// Boshlanishida barcha fayllarni yuklash
loadFiles();
