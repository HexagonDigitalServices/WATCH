useEffect(() => {
    if (!brandName) return setBrandWatches([]);

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${API_BASE}/api/watches/brands/${encodeURIComponent(
          brandName
        )}`;
        const resp = await axios.get(url);
        const items = resp?.data?.items ?? resp?.data ?? [];
        const mapped = (items || []).map((it) => {
          const id = it._id ?? it.id;
          const rawPrice =
            typeof it.price === "number"
              ? it.price
              : Number(String(it.price ?? "").replace(/[^0-9.-]+/g, "")) || 0;
          let img = it.image ?? "";
          if (typeof img === "string" && img.startsWith("/"))
            img = `${API_BASE}${img}`;
          return {
            id: String(id),
            image: img || null,
            name: it.name ?? "",
            desc: it.description ?? "",
            priceDisplay: `₹${Number(rawPrice).toFixed(2)}`,
            price: rawPrice,
          };
        });
        if (!cancelled) setBrandWatches(mapped);
      } catch (err) {
        console.error("Failed to fetch brand watches:", err);
        if (!cancelled) setError("Failed to load watches. Try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [brandName]);

  const findInCart = (id) =>
    cart.find(
      (p) => String(p.id) === String(id) || String(p.productId) === String(id)
    );

  if (loading) {
    return (
      <div className={brandPageStyles.loadingContainer}>
        <div className="text-center">
          <div className={brandPageStyles.loadingText}>
            Loading watches...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={brandPageStyles.notFoundContainer}>
        <div className={brandPageStyles.notFoundCard}>
          <h2 className={brandPageStyles.notFoundTitle}>Error</h2>
          <p className={brandPageStyles.notFoundText}>{error}</p>
          <button
            onClick={() => navigate(-1)}
            className={brandPageStyles.goBackButton}
          >
            <ArrowLeft className={brandPageStyles.goBackIcon} /> Go back
          </button>
        </div>
      </div>
    );
  }

  if (!brandWatches.length) {
    return (
      <div className={brandPageStyles.notFoundContainer}>
        <div className={brandPageStyles.notFoundCard}>
          <h2 className={brandPageStyles.notFoundTitle}>
            No watches found
          </h2>
          <p className={brandPageStyles.notFoundText}>
            This brand has no watches listed in our collection yet.
          </p>
          <button
            onClick={() => navigate(-1)}
            className={brandPageStyles.goBackButton}
          >
            <ArrowLeft className={brandPageStyles.goBackIcon} /> Go back
          </button>
        </div>
      </div>
    );
  }