
  const [timeLeft, setTimeLeft] = useState({
    Days: 2,
    Hours: 12,
    Minutes: 45,
    Seconds: 18,
  });

  useEffect(() => {
    // Convert current state to total seconds helper
    const toTotalSeconds = (t) =>
      t.Days * 86400 + t.Hours * 3600 + t.Minutes * 60 + t.Seconds;

    // Create interval
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const total = toTotalSeconds(prev);

        // If already zero, clear and return zeros
        if (total <= 0) {
          clearInterval(timer);
          return { Days: 0, Hours: 0, Minutes: 0, Seconds: 0 };
        }

        const nextTotal = total - 1;

        const Days = Math.floor(nextTotal / 86400);
        const Hours = Math.floor((nextTotal % 86400) / 3600);
        const Minutes = Math.floor((nextTotal % 3600) / 60);
        const Seconds = Math.floor(nextTotal % 60);

        return { Days, Hours, Minutes, Seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

 