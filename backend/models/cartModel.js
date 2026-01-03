const cartItemSchema = new Schema(
  {   
    productId: { type: String, required: true },  
    name: { type: String, required: true },
    img: { type: String, required: true }, // URL or dataURL
    price: { type: Number, required: true, min: 0 },   
    qty: { type: Number, required: true, default: 1, min: 1 },
    description : {type: String, }, 
  },
  { _id: false } 
);
