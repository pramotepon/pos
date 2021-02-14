const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = Schema({
    staff: { type: Schema.Types.ObjectId, ref: 'Staff' },
    product_id: { type: Array, required: true},
    product_num: { type: Array, required: true},
    product_price: { type: Array, required: true}
},{
    collection: 'receipts',
    timestamps: true,
    toJSON: { virtuals: true }
})

schema.virtual('total').get(function() {
    return this.product_price.reduce(function(currentValue, previousValue){
        return (currentValue + previousValue);
    });
});

const receipt = mongoose.model('Receipt', schema);
module.exports = receipt;