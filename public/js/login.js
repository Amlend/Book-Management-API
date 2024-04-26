const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent default form submission

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await axios.post("/login/validiation", {
      email,
      password,
    });
    console.log(response.data);

    if (response.data.success) {
      localStorage.setItem("token", response.data.token);
      window.location.href = "/books";
    } else {
      alert("Invalid login credentials.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("An error occurred during login. Please try again.");
  }
});
