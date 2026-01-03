export default function CartPage() {
  const {
    cart,
    increment,
    decrement,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  // checkout form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleMobileChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10); // limit to 10 digits
    setMobile(digitsOnly);
  };

  const isFormValid = () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !address.trim() ||
      !mobile.trim() ||
      !paymentMethod.trim()
    ) {
      return false;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const phoneOk = /^[0-9]{10}$/.test(mobile.replace(/\s+/g, "")); // STRICT 10 digits
    return emailOk && phoneOk;
  };

  const processPayment = (method) => {
    if (method === "Cash on Delivery") return true;
    if (method === "Online") {
      return Math.random() < 0.75;
    }
    return false;
  };

  const handleSubmit = (e) => {
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

    const paymentOk = processPayment(paymentMethod);

    if (paymentOk) {
      clearCart();

      setName("");
      setEmail("");
      setAddress("");
      setMobile("");
      setNote("");
      setPaymentMethod("");

      toast.success("Payment successful — order completed.", {
        position: "top-right",
      });
      return;
    } else {
      toast.error("Payment failed. Please try again.", {
        position: "top-right",
      });
      return;
    }
  };


              {/* Cart Items */}
              <div className={cartPageStyles.cartItemsGrid}>
                {cart.map((item) => (
                  <div key={item.id} className={cartPageStyles.cartItemCard}>
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
                      <p className={cartPageStyles.cartItemPrice}>
                        {item.price}
                      </p>

                      <div className={cartPageStyles.quantityContainer}>
                        <div className={cartPageStyles.quantityControls}>
                          <button
                            onClick={() => decrement(item.id)}
                            className={cartPageStyles.quantityButton}
                            aria-label={`Decrease ${item.name} quantity`}
                          >
                            <Minus size={16} />
                          </button>
                          <span className={cartPageStyles.quantityText}>
                            {item.qty}
                          </span>
                          <button
                            onClick={() => increment(item.id)}
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
                ))}
              </div>


    {/* Right column */}
            <div className={cartPageStyles.orderSummaryContainer}>
              <h2 className={cartPageStyles.orderSummaryTitle}>
                Order Summary
              </h2>

              <div className={cartPageStyles.orderSummaryContent}>
                <div className={cartPageStyles.summaryRow}>
                  <span className={cartPageStyles.summaryLabel}>
                    Subtotal ({totalItems} items)
                  </span>
                  <span className={cartPageStyles.summaryValue}>
                    ₹{totalPrice.toFixed(2)}
                  </span>
                </div>

                <div className={cartPageStyles.summaryRow}>
                  <span className={cartPageStyles.summaryLabel}>Shipping</span>
                  <span className={cartPageStyles.summaryValue}>Free</span>
                </div>

                <div className={cartPageStyles.summaryRow}>
                  <span className={cartPageStyles.summaryLabel}>Tax (8%)</span>
                  <span className={cartPageStyles.summaryValue}>
                    ₹{(totalPrice * 0.08).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className={cartPageStyles.totalContainer}>
                <span>Total</span>
                <span>₹{(totalPrice * 1.08).toFixed(2)}</span>
              </div>
            </div>
   
