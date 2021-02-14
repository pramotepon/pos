const Receipt = require('../models/receipt');
const { validationResult } = require('express-validator');

// select Receipt
exports.getReceipt = async (req, res, next) => {
    const receipt = await Receipt.find().populate('staff', '-password -_id');

    res.status(200).json({
        data: receipt
    });
}

// find by id Receipt
exports.findReceipt = async (req, res, next) => {
    try {
        const { id } = req.params;
        const receipt = await Receipt.findById(id).populate('staff', '-password -_id');

        if(!receipt){
            const error = new Error('ไม่พบข้อมูล');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            data: receipt
        });
    } catch (error) {
        next(error)
    }
}

// insert receipt
exports.insertReceipt = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = new Error('ข้อมูลที่รับมา ไม่ถูกต้อง');
            error.statusCode = 422;
            error.validation = errors.array();
            throw error;
        }

        const { staff, product_id, product_num, product_price } = req.body;

        let receipt = new Receipt();
        receipt.staff = staff;
        receipt.product_id = product_id;
        receipt.product_num = product_num;
        receipt.product_price = product_price;

        await receipt.save();

        return res.status(201).json({
            message: "ชำระสินค้าเรียบร้อย"
        });

    } catch (error) {
        next(error);
    }
}

// remove receipt
exports.deleteReceipt = async (req, res, next) => {
    try {
        const { id } = req.params;
        const receipt = await Receipt.deleteOne({ _id: id });
        if(receipt.deleteCount === 0){
            const error = new Error('ไม่สามารถลบข้อมูลได้');
            error.statusCode = 404;
            throw error;
        }else{
            res.status(200).json({
                message: "ลบข้อมูลเรียบร้อย"
            });
        }
    } catch (error) {
        next(error)
    }
}