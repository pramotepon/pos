const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// เรียกใช้งานแพคเกจ Bcrypt.js
const bcrypt = require('bcryptjs');

const schema = Schema({
    email: { type: String, required: true, trim: true, unique: true, index: true },
    password: { type: String, required: true, trim: true},
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    role: { type: String, default: 'staff' }
},{
    collection: 'staffs',
    timestamps: true 
});

// สร้าง method ฟังก์ชั่น encryptPassword สำหรับเข้ารหัสข้อมูลพาสเวิด
schema.methods.encryptPassword = async function(password){
    // สร้างรหัสสุ่มเพื่อแทรกไปในรหัสของเราเก็บไว้ในตัวแปร salt
    const salt = await bcrypt.genSalt(5);
    // ในพาสเวิดที่ได้จากพารามิเตอร์มารวมกับ salt ที่เราสร้างทำให้เกิดการเข้ารหัส
    const hashPassword = await bcrypt.hash(password, salt);
    // return ค่า Password ที่เข้ารหัสแล้ว
    return hashPassword;
}

// สร้างฟังก์ชั่นเพื่อตรวจสอบ password
schema.methods.checkPassword = async function(password){
    // ใช้งาน bcrypt ใช้คำสั่ง compare(password ที่ login, password ที่ hash)
    const isValid = await bcrypt.compare(password, this.password);
    // คืนค่ากลับไป ถ้าตรงกัน true ถ้าไม่ false
    return isValid;
}

const staff = mongoose.model('Staff', schema);
module.exports = staff;