import express from 'express';

const router = express.Router();

router.get("*", (req,res,next) => {
    res.locals.user = req.user || null;
    res.locals.role = 'district';
    next();
});

// route trang chu
// lay thong tin officer (:username)
//nhóm report
// show các report
// xem chi tiết 1 report (:reportID)
// update 1 report (:reportID)


// nhóm bảng quảng cáo
// hàm show tất cả quảng cáo
// hàm lấy 1 quảng cáo (:id)
// hàm yêu cầu xử lý quảng cáo (:id)


// nhóm giấy phép (license)

export default router;