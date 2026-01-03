
// create watch
    const doc = new Watch({
      _id: new mongoose.Types.ObjectId(),
      name,
      description,
      price,
      category,
      brandName,
      image,
    });

// getWatches
    if (typeof category === "string") {
      const cat = category.trim().toLowerCase();
      if (cat === "men" || cat === "women") filter.category = cat;
    }

    const pg = Math.max(1, parseInt(page, 10) || 1);
    const lim = Math.min(200, parseInt(limit, 10) || 12);
    const skip = (pg - 1) * lim;


// deleteWatch
    if (w.image && typeof w.image === "string") {
      const normalized = w.image.startsWith("/") ? w.image.slice(1) : w.image;
      if (normalized.startsWith("uploads/")) {
        const filename = normalized.replace(/^uploads\//, "");
        const filepath = path.join(process.cwd(), "uploads", filename);
        fs.unlink(filepath, (err) => {
          if (err) console.warn("Failed to unlink image file", filepath, err?.message || err);
        });
      }
    }