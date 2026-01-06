  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeColor, setActiveColor] = useState("grey");
  const [category, setCategory] = useState("men");
  const [brandName, setBrandName] = useState("");

  const inputRef = useRef(null);
  const API_BASE = "http://localhost:4000";
  const BRANDS = [
    "Rolex",
    "Omega",
    "Audemars Piguet",
    "Cartier",
    "Breitling",
    "IWC",
    "Hublot",
    "Jaeger LeCoultre",
    "Tag Heuer",
    "Patek Philippe",
  ];

  const theme = themes[activeColor];
  const inputClass = getInputClass(theme);

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  useEffect(() => {
    if (category !== "brand") setBrandName("");
  }, [category]);

  const clearFileInput = () => {
    if (inputRef.current) inputRef.current.value = "";
    setImageFile(null);
    setImagePreviewUrl("");
  };

  const handleImageChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/"))
      return toast.error("Please select an image file");
    const maxMB = 5;
    if (f.size > maxMB * 1024 * 1024)
      return toast.error(`Image too large (max ${maxMB} MB)`);
    setImageFile(f);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCategory("men");
    setBrandName("");
    clearFileInput();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile || !name.trim() || !description.trim() || !price.trim())
      return toast.error("Please fill all fields and select an image.");
    if (isNaN(Number(price)) || Number(price) <= 0)
      return toast.error("Enter a valid price greater than 0.");
    if (category === "brand" && !brandName.trim())
      return toast.error("Please select the brand.");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("price", String(Number(price)));
      formData.append("category", category);
      if (category === "brand") {
        formData.append(
          "brandName",
          brandName.trim().toLowerCase().replace(/\s+/g, "-")
        );
      }

      const resp = await axios.post(`${API_BASE}/api/watches`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Saved:", resp?.data);
      toast.success("Watch added successfully!");
      resetForm();
    } catch (err) {
      console.error(err);
      const serverMsg =
        err?.response?.data?.message || err?.response?.data || null;
      toast.error(String(serverMsg || "Failed to add watch. Try again."));
    } finally {
      setLoading(false);
    }
  };

  const prettyCategory = (c) =>
    c === "men" ? "Men" : c === "women" ? "Women" : c === "brand" ? "Brand" : c;




            {["grey", "blue", "purple"].map((c) => (

            ))}
  

                <div className={classes.previewContent}>
                  <h3 className={classes.previewName}>
                    {name || "Watch name"}
                  </h3>
                  <div className={classes.previewCategory}>
                    <strong>Category:</strong> {prettyCategory(category)}
                    {category === "brand" && brandName && (
                      <span className="ml-2 text-slate-500">({brandName})</span>
                    )}
                  </div>
                  <p className={classes.previewDescription}>
                    {description || "Watch description will appear here."}
                  </p>
                  <div className={classes.previewPriceContainer}>
                    <div className={classes.previewPriceLabel}>Price</div>
                    <div className={classes.previewPriceValue}>
                      {price ? `₹${Number(price).toFixed(2)}` : "₹0.00"}
                    </div>
                  </div>
                </div>