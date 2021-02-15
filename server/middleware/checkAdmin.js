module.exports.isAdmin = (req, res, next) => {
    const { role } = req.staff;

    if(role === staff){
        next();
    }else{
        return res.status(403).json({
            error: {
                message: 'เฉพาะผู้ดูแลระบบเท่านั้น'
            }
        });
    }
}