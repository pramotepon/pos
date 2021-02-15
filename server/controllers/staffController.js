const Staff = require('../models/staff');
// import express validator
const { validationResult } = require('express-validator');

// import json web token
const jwt = require('jsonwebtoken');
// import env config
const config = require('../config/index');

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


// login Staff
exports.loginStaff = async (req, res, next) => {
    // ครอบ Try catch
    try {
        // destruct email และ password
        const { email, password } = req.body;
        // ตรวจสอบ email ในระบบ
        const staff = await Staff.findOne({ email: email });
        // ถ้าไม่เจอให้ catch next error
        if(!staff){
            const error = new Error('ไม่มีผู้ใช้งานนี้');
            error.statusCode = 404;
            throw error;
        }
        // ตรวจสอบ รหัสผ่าน เรียกใช้ฟังก์ชั่นที่เราสร้างใน model
        const isValid = await staff.checkPassword(password);
        // ถ้าเป็น false ให้ catch next error
        if(!isValid){
            const error = new Error('รหัสผ่านไม่ถูกต้อง');
            // 401 คือ un autho
            error.statusCode = 401;
            throw error;
        }

        // res.status(200).json({
        //     message: "Login Success"
        // });
        
        // เข้าสู่ระบบ
        // สร้าง token
        const token = await jwt.sign({
            id: staff._id,
            role: staff.role
        }, config.JWT_SECRET, {
            expiresIn: '5 days'
        });

        // decode exp
        const expires_in = jwt.decode(token);
        // ส่งข้อมูลออกไป
        res.status(200).json({
            // token ข้อมูล
            access_token: token,
            // วันหมดอายุของ token
            expires_id: expires_in.exp,
            // ประเภทของ token
            token_type: 'Bearer'
        });
        
    } catch (error) {
        next(error);
    }
}

exports.profileStaff = async (req, res, next) => {
    // destruct data
    const { _id, first_name, email, role } = req.staff;
    // เรียกใช้แค่ข้อมูลที่ต้องการ
    return res.status(200).json({
        staff: {
            id: _id,
            first_name: first_name,
            email: email,
            role: role
        }
    });
}