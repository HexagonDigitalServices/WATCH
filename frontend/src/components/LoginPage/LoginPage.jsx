  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic form validation
    if (!email || !password) {
      toast.error("Please fill in all fields.", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
      return;
    }

    if (!rememberMe) {
      toast.error("You must agree to remember me.", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
      return;
    }

    // === NEW: log all form data to the console ===
    // NOTE: Logging passwords is fine for development/testing only. Remove before production.
    console.log("Login form submitted — form data:", {
      email,
      password,
      rememberMe,
      showPassword,
      timestamp: new Date().toISOString(),
    });

    // Simulate a successful login: store auth info in localStorage so Navbar can detect it
    try {
      // create a simple fake token for demo (replace with real token from server in production)
      const fakeToken = btoa(`${email}:${Date.now()}`);

      // Persist token & login flag (Navbar checks these keys)
      localStorage.setItem("authToken", fakeToken);
      localStorage.setItem("isLoggedIn", "true");

      try {
        window.dispatchEvent(
          new CustomEvent("authChanged", { detail: { loggedIn: true } })
        );
      } catch (err) {
        // ignore if browser doesn't allow CustomEvent construction in this environment
      }
    } catch (err) {
      // ignore storage errors
    }

    // Show success toast
    toast.success("Login successful!", {
      position: "top-right",
      autoClose: 1200,
      theme: "light",
    });

    // Redirect to home after short delay so user sees the toast
    setTimeout(() => {
      navigate("/");
    }, 1250);
  };


      {/* Add font import */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');`}
      </style>
