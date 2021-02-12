// เรียกใช้งาน config จาก .env
require('dotenv').config();

// Exports ข้อมูลที่เราต้องการส่งออกจากใน .env
module.exports = {
    PORT: process.env.PORT
}