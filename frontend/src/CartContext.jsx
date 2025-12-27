  // helper: robust price parser
  const parsePrice = (price) => {
    if (typeof price === "number" && isFinite(price)) return price;
    if (!price) return 0;
    // convert to string and strip currency symbols, spaces, and letters,
    // keep digits, minus and dot. remove commas.
    let s = String(price).trim();
    // remove all characters except digits, dot, minus
    s = s.replace(/[^0-9.\-]/g, "");
    // if multiple dots, keep first dot only
    const parts = s.split(".");
    if (parts.length > 2) {
      const first = parts.shift();
      s = first + "." + parts.join("");
    }
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
  };
