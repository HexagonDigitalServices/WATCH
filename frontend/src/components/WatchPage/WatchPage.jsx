const ICON_MAP = { Grid, User, Users };
const FILTERS = RAW_FILTERS?.length
  ? RAW_FILTERS.map((f) => ({ ...f, icon: ICON_MAP[f.iconName] ?? Grid }))
  : [
      { key: "all", label: "All", icon: Grid },
      { key: "men", label: "Men", icon: User },
      { key: "women", label: "Women", icon: Users },
    ];


    

     

                <div className={watchPageStyles.cartControlsContainer}>
                  {qty > 0 ? (
                    // show minus, qty, plus
                    <div className={watchPageStyles.cartQuantityControls}>
                      <button
                        onClick={() => {
                          if (qty > 1) decrement(sid);
                          else removeItem(sid); // remove when qty is 1
                        }}
                        className={watchPageStyles.cartButton}
                      >
                        <Minus className={watchPageStyles.filterIcon} />
                      </button>

                      <div className={watchPageStyles.cartQuantity}>{qty}</div>

                      <button
                        onClick={() => increment(sid)}
                        className={watchPageStyles.cartButton}
                      >
                        <Plus className={watchPageStyles.filterIcon} />
                      </button>
                    </div>
                  ) : (
                    // show Add button when not in cart
                    <button
                      onClick={() =>
                        addItem({
                          id: sid,
                          name: w.name,
                          price: w.price,
                          img: w.img,
                        })
                      }
                      className={watchPageStyles.addToCartButton}
                    >
                      <ShoppingCart className={watchPageStyles.addToCartIcon} />
                      Add
                    </button>
                  )}
                </div>
             