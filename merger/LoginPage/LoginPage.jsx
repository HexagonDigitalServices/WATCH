catch (err) {
      const serverMsg = err?.response?.data?.message;
      const status = err?.response?.status;

      if (status === 401) {
        toast.error(serverMsg || "Invalid email or password.", {
          position: "top-right",
          autoClose: 4000,
          theme: "light",
        });
      } else if (status === 409) {
        toast.error(serverMsg || "Conflict: user exists.", {
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
      console.error("Login error:", err?.response ?? err);
    } 