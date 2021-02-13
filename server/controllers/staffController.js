const Staff = require('../models/staff');
// import express validator
const { validationResult } = require('express-validator');

// select Staff
exports.getStaff = async (req, res, next) => {
        const staffs = await Staff.find();
        res.status(200).json({
            data: staffs
        });
}

// insert Staff
exports.insertStaff = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = new Error('ข้อมูลที่รับมา ไม่ถูกต้อง');
            error.statusCode = 422;
            error.validation = errors.array();
            throw error;
        }

        const { email, first_name, last_name, password } = req.body;

        const existEmail = await Staff.findOne({email: email});
        if(existEmail){
            const error = new Error('มีผู้ใช้งานอีเมลนี้แล้ว');
            error.status_code = 400;
            throw error;
        }

        let staff = new Staff();
        staff.email = email;
        staff.first_name = first_name;
        staff.last_name = last_name;
        staff.password = await staff.encryptPassword(password);
        await staff.save();

        return res.status(201).json({
            message: "ลงทะเบียนสำเร็จ"
        });

    } catch (error) {
        next(error);
    }
}

// select staff by id
exports.findStaff = async (req, res, next) => {
    try {
        const { id } = req.params;
        const staff = await Staff.findById(id);
        if(!staff){
            const error = new Error('ไม่พบข้อมูล');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            data: staff
        });
    } catch (error) {
        next(error)
    }
}

// update Staff
exports.updateStaff = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { email, first_name, last_name, password, role } = req.body;
        const staff = await Staff.findById(id);
        if(!staff){
            const error = new Error('ไม่พบข้อมูล');
            error.statusCode = 404;
            throw error;
        }
        staff.email = email;
        staff.first_name = first_name;
        staff.last_name = last_name;
        // staff.password = await staff.encryptPassword(password);
        // staff.role = role;
        
        await staff.save();

        if (staff.nModified === 0) {
            const error = new Error('ไม่สามารถอัพเดตข้อมูลได้');
            error.statusCode = 404;
            throw error;
        } else {
            res.status(200).json({
                message: "แก้ไขข้อมูลสำเร็จ"
            });
        }
    } catch (error) {
        next(error);
    }
}
// delete Staff
exports.deleteStaff = async (req, res, next) => {
    try {
        const { id } = req.params;
        const staff = await Staff.deleteOne({ _id: id });
        if(staff.deleteCount === 0){
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