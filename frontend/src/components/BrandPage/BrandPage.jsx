
useEffect(() => {
    // ensure instant jump to top (no smooth scrolling)
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      // also reset potential scroll on html/body for some browsers
      try {
        document.documentElement && (document.documentElement.scrollTop = 0);
        document.body && (document.body.scrollTop = 0);
      } catch (e) {
        /* ignore */
      }
    }
  }, []);