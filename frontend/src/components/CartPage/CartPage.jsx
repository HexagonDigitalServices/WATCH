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

  // ensure mobile contains only digits and maximum 10 characters while typing
  const handleMobileChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10); // limit to 10 digits
    setMobile(digitsOnly);
  };

  // simple validation
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

  // Simulate payment processing:
  // - Cash on Delivery => success
  // - Online => 75% chance success
  const processPayment = (method) => {
    if (method === "Cash on Delivery") return true;
    if (method === "Online") {
      return Math.random() < 0.75;
    }
    return false;
  };

  // HANDLE SUBMIT: attempt payment; on success clear cart + clear form and show empty page
  // on failure, do not clear anything
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
      // clear cart so page becomes the empty-cart UI
      clearCart();

      // clear form fields
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
      // payment failed: keep everything as-is for retry
      toast.error("Payment failed. Please try again.", {
        position: "top-right",
      });
      return;
    }
  };

  
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
