
const API_BASE = "http://localhost:4000/api";

const axiosInstance = axios.create({ baseURL: API_BASE });
axiosInstance.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("authtoken");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/orders");
      const orders = Array.isArray(res?.data?.orders)
        ? res.data.orders
        : Array.isArray(res?.data)
        ? res.data
        : [];
      setBookings(orders.map(mapOrderToBooking));
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  }

  const mapOrderToBooking = (o) => {
    const items = (o.items || []).map((it) => ({
      productId: it.productId ?? null,
      name: String(it.name ?? ""),
      img: it.img ?? null,
      price: Number(it.price ?? 0),
      qty: Number(it.qty ?? 1),
      description: it.description,
    }));

    return {
      id: o._id,
      orderId: o.orderId,
      userId: o.user ?? null,
      paymentStatus: o.paymentStatus ?? "Unpaid",
      paymentMethod: o.paymentMethod ?? "Online",
      customerName: o.name ?? "Customer",
      email: o.email,
      phone: o.phoneNumber,
      address: o.address,
      notes: o.notes,
      shippingCharge: Number(o.shippingCharge ?? 0),
      totalAmount: Number(o.totalAmount ?? 0),
      taxAmount: Number(o.taxAmount ?? 0),
      finalAmount: Number(o.finalAmount ?? 0),
      watches: items,
      date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "—",
      status: o.orderStatus ?? "Pending",
      raw: o,
    };
  };

  async function deleteBooking(id) {
    if (!window.confirm("Delete this booking?")) return;
    try {
      await axiosInstance.delete(`/orders/${id}`);
      setBookings((p) => p.filter((b) => b.id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete booking");
    }
  }

  async function updateStatus(id, newStatus) {
    const current = bookings.find((b) => b.id === id);
    if (String(current?.status ?? "").toLowerCase() === "cancelled") {
      alert("Cannot update status of a cancelled booking.");
      return;
    }

    const prev = bookings;
    setBookings((p) =>
      p.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    try {
      await axiosInstance.put(`/orders/${id}`, { orderStatus: newStatus });
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update status");
      fetchOrders();
    }
  }

  const toggle = (id) =>
    setExpanded((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );

  const q = searchTerm.trim().toLowerCase();
  const filtered = bookings.filter((b) => {
    const matchesSearch =
      !q ||
      b.customerName.toLowerCase().includes(q) ||
      (b.email || "").toLowerCase().includes(q) ||
      b.watches.some((w) => (w.name || "").toLowerCase().includes(q));
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const StatusBadge = ({ status }) => {
    const styleClass = statusBadgeStyles[status] || statusBadgeStyles.default;
    return (
      <span className={`${badgeBaseStyles} ${styleClass}`}>
        {status}
      </span>
    );
  };

  const PaymentBadge = ({ status }) => {
    const styleClass = paymentBadgeStyles[status] || paymentBadgeStyles.default;
    return (
      <span className={`${paymentBadgeBaseStyles} ${styleClass}`}>
        <CreditCard className="w-3 h-3" />
        {status}
      </span>
    );
  };

                      <div>
                        <h4 className={bookingStyles.sectionTitle}>
                          <Watch className={bookingStyles.sectionIcon} /> Watch Details
                        </h4>
                        <div className={bookingStyles.watchContainer}>
                          {b.watches.map((w, i) => (
                            <div
                              key={i}
                              className={bookingStyles.watchItem}
                            >
                              <div className={bookingStyles.watchImageContainer}>
                                <div className={bookingStyles.watchImageWrapper}>
                                  {w.img ? (
                                    <img
                                      src={w.img}
                                      alt={w.name}
                                      className={bookingStyles.watchImage}
                                    />
                                  ) : (
                                    <div className={bookingStyles.watchNoImage}>
                                      No image
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className={bookingStyles.watchDetails}>
                                <h5 className={bookingStyles.watchTitle}>
                                  {w.name}
                                </h5>
                                <div className={bookingStyles.watchInfoContainer}>
                                  <div>
                                    <span className={bookingStyles.watchInfoLabel}>
                                      Price:
                                    </span>
                                    ₹{Number(w.price).toLocaleString()}
                                  </div>
                                  <div>
                                    <span className={bookingStyles.watchInfoLabel}>
                                      Qty:
                                    </span>
                                    {w.qty}
                                  </div>
                                  <div>
                                    <span className={bookingStyles.watchInfoLabel}>
                                      ProductId:
                                    </span>
                                    {w.productId ?? "—"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className={bookingStyles.priceSummary}>
                          <div>
                            <span className={bookingStyles.priceRow}>
                              Subtotal:{" "}
                            </span>
                            ₹{Number(b.totalAmount).toLocaleString()}
                          </div>
                          <div>
                            <span className={bookingStyles.priceRow}>
                              Tax:{" "}
                            </span>
                            ₹{Number(b.taxAmount).toLocaleString()}
                          </div>
                          <div>
                            <span className={bookingStyles.priceRow}>
                              Shipping:{" "}
                            </span>
                            ₹{Number(b.shippingCharge).toLocaleString()}
                          </div>
                          <div className={bookingStyles.finalPrice}>
                            <span className={bookingStyles.priceRow}>
                              Final:{" "}
                            </span>
                            ₹{Number(b.finalAmount).toLocaleString()}
                          </div>
                        </div>
                      </div>