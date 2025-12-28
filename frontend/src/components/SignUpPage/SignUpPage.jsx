  const handleSubmit = (e) => {
    e.preventDefault();

    // enforce all fields
    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill in all fields.", {
        position: "top-right",
        autoClose: 4000,
        theme: "light",
      });
      return;
    }

    // simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.", {
        position: "top-right",
        autoClose: 4000,
        theme: "light",
      });
      return;
    }

    // require remember me explicitly
    if (!rememberMe) {
      toast.error("Please tick 'Remember me' to continue.", {
        position: "top-right",
        autoClose: 4000,
        theme: "light",
      });
      return;
    }

    // === NEW: log all form data ===
    console.log("Signup form submitted — form data:", {
      name,
      email,
      password, // ⚠️ for dev only, don't log raw passwords in production
      rememberMe,
      showPassword,
      timestamp: new Date().toISOString(),
    });

    // success
    toast.success("Signup successful", {
      position: "top-right",
      autoClose: 1200,
      theme: "light",
    });

    setTimeout(() => {
      navigate("/login");
    }, 1250);
  };