 const mapServerToUI = (item) => {
    let img = item.image ?? item.img ?? "";
    if (typeof img === "string" && img.startsWith("/")) {
      img = `${API_BASE}${img}`;
    }
    const rawGender =
      (item.gender && String(item.gender).toLowerCase()) ||
      (item.category && String(item.category).toLowerCase()) ||
      "";

    const gender =
      rawGender === "men" || rawGender === "male"
        ? "men"
        : rawGender === "women" || rawGender === "female"
        ? "women"
        : "unisex";

    return {
      id:
        item._id ??
        item.id ??
        String(item.sku ?? item.name ?? Math.random()).slice(2, 12),
      name: item.name,
      price: item.price ?? 0,
      category: item.category ?? "",
      brand: item.brandName ?? "",
      description: item.description,
      img,
      gender,
      raw: item,
    };
  };

  useEffect(() => {
    let mounted = true;
    const fetchWatches = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(`${API_BASE}/api/watches?limit=10000`);
        const data = resp.data;
        const items = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.watches)
          ? data.watches
          : null;

        if (!items) {
          if (mounted) {
            if (Array.isArray(DUMMY_WATCHES) && DUMMY_WATCHES.length) {
              setWatches(DUMMY_WATCHES.map(mapServerToUI));
              toast.info("Using local dummy watches.");
            } else {
              setWatches([]);
              toast.info("No watches returned from server.");
            }
          }
        } else if (mounted) {
          setWatches(items.map(mapServerToUI));
        }
      } catch (err) {
        console.error("Failed to fetch watches:", err);
        if (mounted) {
          if (Array.isArray(DUMMY_WATCHES) && DUMMY_WATCHES.length) {
            setWatches(DUMMY_WATCHES.map(mapServerToUI));
            toast.warn("Could not reach server — using local dummy watches.");
          } else {
            setWatches([]);
            toast.error("Could not fetch watches from server.");
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchWatches();
    return () => {
      mounted = false;
    };
  }, []);

  const getQty = (id) => {
    const items = Array.isArray(cart) ? cart : cart?.items ?? [];
    const match = items.find((c) => {
      const candidates = [c.productId, c.id, c._id];
      return candidates.some((field) => String(field ?? "") === String(id));
    });
    if (!match) return 0;
    const qty = match.qty ?? match.quantity ?? 0;
    return Number(qty) || 0;
  };

  const filtered = useMemo(
    () =>
      watches.filter((w) =>
        filter === "all"
          ? true
          : filter === "men"
          ? w.gender === "men"
          : filter === "women"
          ? w.gender === "women"
          : true
      ),
    [filter, watches]
  );