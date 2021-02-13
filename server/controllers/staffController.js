const Staff = require('../models/staff');
// select Staff
exports.getStaff = async (req, res, next) => {
        const staff = await Staff.find();
        res.status(200).json({
            data: staff
        });
}
// insert Staff
exports.insertStaff = async (req, res, next) => {
    const { email, images, price, stock } = req.body;
    res.status(200).json({
        email: email,
        images: images,
        price: price,
        stock, stock
    });
}