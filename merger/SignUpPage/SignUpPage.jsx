catch (err) {
      // Prefer server-provided message if available
      const serverMsg = err?.response?.data?.message;
      const status = err?.response?.status;

      if (status === 409) {
        toast.error(serverMsg || "User already exists.", {
          position: "top-right",
          autoClose: 4000,
          theme: "light",
        });
      } else if (serverMsg) {
        toast.error(serverMsg, {
          position: "top-right",
          autoClose: 4000,
          theme: "light",
        });
      } else {
        toast.error("Server error. Please try again later.", {
          position: "top-right",
          autoClose: 4000,
          theme: "light",
        });
      }
      console.error("Signup error:", err?.response ?? err);
    } 