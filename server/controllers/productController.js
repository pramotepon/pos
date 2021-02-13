const Product = require('../models/product');
// import express validator
const { validationResult } = require('express-validator');
const fs = require('fs'); //ระบบ file systems ของ node js
const path = require('path'); // จัดการ path ในระบบ
const uuidv4 = require('uuid'); // สำหรับ gen ชื่อไฟล์แบบสุ่มใหม่
const { promisify } = require('util'); // แปลง base64 กลับเป็นรูปภาพ
const writeFileAsync = promisify(fs.writeFile); // แปลง writeFile เป็น promis เพื่อใช้กับ async await
//หา path จริงของโปรเจค
const projectPath = path.resolve('./') ;
//โฟลเดอร์และ path ของการอัปโหลด
const uploadPath = `${projectPath}/public/images/`;

const config = require('../config/index');

// select Product
exports.getProduct = async (req, res, next) => {
        const products = await Product.find();
        const productWithDomain = await products.map( (product, index) => {
            return {
                id: product._id,
                name: product.name,
                image: config.DOMAIN + 'images/' + product.image,
                price: product.price,
                stock: product.stock,
                created: product.createdAt,
                update: product.updatedAt
            }
        });
        res.status(200).json({
            data: productWithDomain
        });
}
// insert Product
exports.insertProduct = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = new Error('ข้อมูลที่รับมา ไม่ถูกต้อง');
            error.statusCode = 422;
            error.validation = errors.array();
            throw error;
        }

        const { name, image, price, stock } = req.body;

        const existProduct = await Product.findOne({name: name});
        if(existProduct){
            const error = new Error('มีรายการสินค้านี้แล้ว');
            error.status_code = 400;
            throw error;
        }

        let product = new Product();
        product.name = name;
        product.price = price;
        if(stock){
            product.stock = stock;
        }
        if(image){
            product.image = await saveImageToDisk(image);
        }
        await product.save();

        return res.status(201).json({
            message: "เพิ่มรายการสินค้าสำเร็จ"
        });

    } catch (error) {
        next(error);
    }
}

// select Product by id
exports.findProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if(!product){
            const error = new Error('ไม่พบข้อมูล');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            data: product
        });
    } catch (error) {
        next(error)
    }
}

// update Product
exports.updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, image, price, stock } = req.body;
        
        const product = await Product.findById(id);
        
        const delete_img = uploadPath + product.image;
        if(!product){
            const error = new Error('ไม่พบข้อมูล');
            error.statusCode = 404;
            throw error;
        }
        product.name = name;
        product.price = price;
        product.stock = stock;

        if(image && product.image != "nopic.png"){
            fs.unlinkSync(delete_img);
        }
        if(image){
            product.image = await saveImageToDisk(image);
        }

        await product.save();

        if (product.nModified === 0) {
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
// delete Product
exports.deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const findProduct = await Product.findById(id);
        const delete_img = uploadPath + findProduct.image;
        if(findProduct && findProduct.image != "nopic.png"){
            fs.unlinkSync(delete_img);
        }
        const product = await Product.deleteOne({ _id: id });
        if(product.deleteCount === 0){
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

// Add img Function
async function saveImageToDisk(baseImage) {
    //หา path จริงของโปรเจค
    const projectPath = path.resolve('./') ;
    //โฟลเดอร์และ path ของการอัปโหลด
    const uploadPath = `${projectPath}/public/images/`;

    //หานามสกุลไฟล์
    const ext = baseImage.substring(baseImage.indexOf("/")+1, baseImage.indexOf(";base64"));

    //สุ่มชื่อไฟล์ใหม่ พร้อมนามสกุล
    let filename = '';
    if (ext === 'svg+xml') {
        filename = `${uuidv4.v4()}.svg`;
    } else {
        filename = `${uuidv4.v4()}.${ext}`;
    }

    //Extract base64 data ออกมา
    let image = decodeBase64Image(baseImage);

    //เขียนไฟล์ไปไว้ที่ path
    await writeFileAsync(uploadPath+filename, image.data, 'base64');
    //return ชื่อไฟล์ใหม่ออกไป
    return filename;
}

function decodeBase64Image(base64Str) {
    var matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var image = {};
    if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 string');
    }

    image.type = matches[1];
    image.data = matches[2];

    return image;
}