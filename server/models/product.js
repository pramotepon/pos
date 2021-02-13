const mongoose = require('mongoose');
const config = require('../config/index');

const schema = mongoose.Schema({
    name: { type: String, required: true, trim: true, unique: true },
    image: { type: String, default: "nopic.png", trim: true},
    price: { type: Number, required: true, trim: true },
    stock: { type: Number, default: 0, trim: true }
},{
    collection: 'products',
    timestamps: true,
    toJSON: { virtuals: true }
});

schema.virtual('image_with_path').get(function() {
    return config.DOMAIN + this.image;
});

const product = mongoose.model('Product', schema);
module.exports = product;