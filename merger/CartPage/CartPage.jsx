function CartProduct({ item }) {
  const { increment, decrement, removeItem } = useCart();
  const [localQty, setLocalQty] = useState(item.qty ?? 1);

  useEffect(() => {
    setLocalQty(Number(item.qty ?? item.quantity ?? 1));
  }, [item.qty, item.quantity]);

  const onInc = () => {
    setLocalQty((q) => (Number.isFinite(q) ? q + 1 : 1));
    increment(item.id);
  };

  const onDec = () => {
    const currentQty = item.qty ?? localQty;
    if (currentQty <= 1) {
      removeItem(item.id);
      return;
    }
    setLocalQty((q) => (Number.isFinite(q) ? q - 1 : currentQty - 1));
    decrement(item.id);
  };

  return (
    <div className={cartPageStyles.cartItemCard}>
      <div className={cartPageStyles.cartItemImageContainer}>
        <img
          src={item.img}
          alt={item.name}
          className={cartPageStyles.cartItemImage}
        />
      </div>
      <div className={cartPageStyles.cartItemContent}>
        <h3 className={cartPageStyles.cartItemName}>
          {item.name}
        </h3>
        <p className={cartPageStyles.cartItemPrice}>{item.price}</p>

        <div className={cartPageStyles.quantityContainer}>
          <div className={cartPageStyles.quantityControls}>
            <button
              onClick={onDec}
              className={cartPageStyles.quantityButton}
              aria-label={`Decrease ${item.name} quantity`}
            >
              <Minus size={16} />
            </button>

            <span className={cartPageStyles.quantityText}>
              {localQty}
            </span>

            <button
              onClick={onInc}
              className={cartPageStyles.quantityButton}
              aria-label={`Increase ${item.name} quantity`}
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            onClick={() => removeItem(item.id)}
            className={cartPageStyles.removeButton}
            aria-label={`Remove ${item.name}`}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error("Please fill all required fields correctly.", {
        position: "top-right",
      });
      return;
    }
    if (!cart.length) {
      toast.error("Your cart is empty.", { position: "top-right" });
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please log in to place the order.", {
        position: "top-right",
      });
      return;
    }

    const itemsPayload = cart.map((it) => ({
      productId: it.productId ?? it.id,
      name: it.name,
      img: it.img,
      price: Number(it.price ?? 0),
      qty: Number(it.qty ?? it.quantity ?? 1),
    }));

    const body = {
      name,
      email,
      phoneNumber: mobile,
      address,
      notes: note,
      paymentMethod,
      items: itemsPayload,
    };

    setSubmitting(true);
    try {
      const res = await axios.post(`${API_BASE}/api/orders`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res?.data?.success) {
        const checkoutUrl = res.data.checkoutUrl ?? null;
        clearCart();
        if (checkoutUrl) {
          toast.info("Redirecting to payment...", { position: "top-right" });
          window.location.href = checkoutUrl;
          return;
        }
        setName("");
        setEmail("");
        setAddress("");
        setMobile("");
        setNote("");
        setPaymentMethod("");
        toast.success("Order placed successfully.", { position: "top-right" });
        return;
      }

      toast.error(res?.data?.message ?? "Failed to create order", {
        position: "top-right",
      });
    } catch (err) {
      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.message;
      if (status === 401) {
        toast.error("Authentication error — please log in again.", {
          position: "top-right",
        });
      } else {
        toast.error(serverMsg ?? "Failed to create order. Try again later.", {
          position: "top-right",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };