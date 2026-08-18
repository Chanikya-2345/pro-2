// ======================================
// LAYALI LUMINA LOGIN SYSTEM
// login.js
// ======================================

import { auth, signInWithEmailAndPassword } from "./firebase-config.js";

// ======================================
// LOGIN BUTTON
// ======================================

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();

  const password = document.getElementById("password").value;

  const errorBox = document.getElementById("error");

  errorBox.textContent = "";

  console.log("Email:", email);

  console.log("Password Length:", password.length);

  try {
    await signInWithEmailAndPassword(
      auth,

      email,

      password,
    );

    console.log("Login successful");

    window.location.href = "admin.html";
  } catch (error) {
    console.error(error);

    switch (error.code) {
      case "auth/invalid-credential":
        errorBox.textContent = "Invalid email or password.";

        break;

      case "auth/user-not-found":
        errorBox.textContent = "Account not found.";

        break;

      case "auth/wrong-password":
        errorBox.textContent = "Incorrect password.";

        break;

      case "auth/network-request-failed":
        errorBox.textContent = "No internet connection.";

        break;

      default:
        errorBox.textContent = error.message;
    }
  }
});
