const express = require('express');

const { body } = require('express-validator');
const router = express.Router();
const staffController = require('../controllers/staffController');
const passportJWT = require('../middleware/passportJWT');

// select Staff
router.get('/', staffController.getStaff);
// login Staff
router.post('/login', staffController.loginStaff);
// insert Staff
router.post('/register', [
    body('email').not().isEmpty().withMessage('กรุณาใส่อีเมล').isEmail().withMessage('รูปแบบอีเมลไม่ถูกต้อง'),
    body('first_name').not().isEmpty().withMessage('กรุณาใส่ชื่อจริง'),
    body('last_name').not().isEmpty().withMessage('กรุณาใส่นามสกุล'),
    body('password').not().isEmpty().withMessage('กรุณาใส่รหัสผ่าน').isLength({min:6}).withMessage('รหัสผ่าน 6 ตัวอักษรขึ้นไป')
    
], staffController.insertStaff);
// profile Staff
router.get('/me', [passportJWT.isLogin], staffController.me);
// select staff by id
router.get('/:id', staffController.findStaff);
// update staff by id
router.put('/:id', staffController.updateStaff);
// delete staff by id
router.delete('/:id', staffController.deleteStaff);

module.exports = router;