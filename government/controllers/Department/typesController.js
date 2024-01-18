import * as adsCategoriesService from "../../services/adsCategoriesService.js";
import * as reportTypeService from "../../services/reportTypeService.js";

const mapData = (data, idKey, nameKey, descKey) => {
    return data.map((item, index) => {
        const { [idKey]: id, [nameKey]: name, [descKey]: description } = item.toObject();
        return {
            no: index + 1,
            id,
            name,
            description,
            actions: { edit: true, remove: true, info: true }
        };
    });
};

// tạo table
const handleCategory = async (category, service, idKey, nameKey, descKey) => {
    const tableHeads = {
        ads: ['STT', 'ID', 'Tên', 'Mô tả'],
        report: ['STT', 'ID', 'Tên', 'Mô tả']
    }
    let tableData = await service();
    tableData = mapData(tableData, idKey, nameKey, descKey);

    return { tableHeads: tableHeads[category], tableData };
};

// ?category='ads || report'
const show = async (req, res) => {
    const category = req.query.category || '';
    let tableHeads = [];
    let tableData = [];
    let title = '';

    try {
        if (category === 'ads' || category === 'report') {
            const { tableHeads: tbHead, tableData: tbData } = await handleCategory(
                category,
                category === 'ads' ? adsCategoriesService.getAllCategories : reportTypeService.getAllReportType,
                category === 'ads' ? 'CategoriesID' : 'reportTypeID',
                category === 'ads' ? 'CategoriesName' : 'reportTypeName',
                category === 'ads' ? 'description' : 'reportTypeDes'
            )
            tableHeads = tbHead;
            tableData = tbData;
            title = category === 'ads' ? 'Sở - Loại Hình Quảng Cáo' : 'Sở - Loại Hình Báo Cáo';
        } else {
            res.status(404);
            return res.render('error', {
                title: '404',
                message: error.message
            })
        }
        res.render('Department/types', {
            title: title,
            category,
            tableHeads,
            tableData
        })
    } catch (error) {
        return res.render('error', {
            title: '404',
            message: 'Lỗi hệ thống.'
        })
    }
};

const showDetail = async (req, res) => {

};

// ?category='ads || report'
const add = async (req, res) => {
    const category = req.query.category || '';
    const newData = req.body;
    console.log(newData);
    try {
        switch (category) {
            case 'ads':
                const newAds = {
                    CategoriesName: newData.type,
                    description: newData.desc
                }
                const messageAds = await adsCategoriesService.createCategories(newAds);

                req.flash('success', messageAds);
                break;
            case 'report':
                const newReport = {
                    reportTypeName: newData.reportTypeName,
                    reportTypeDes: newData.reportTypeDes
                }
                const messageReport = await reportTypeService.createReportType(newReport);
                req.flash('success', messageReport);
                break;
            default:
                req.flash('error', 'Không tìm thấy trang');
                return res.redirect(req.originalUrl);
        }
        return res.redirect(req.originalUrl);
    } catch (error) {
        req.flash('error', error.message);
        return res.status(500).json({ message: error.message });
    }

};

// ?category = 'ads' || 'report'
// :id
const remove = async (req, res) => {
    const category = req.query.category || '';
    const id = req.params.id;
    let message = '';
    console.log(id);
    try {
        switch (category) {
            case 'ads':
                message = await adsCategoriesService.deleteCategorires(id);
                req.flash('success', message);
                break;
            case 'report':
                message = await reportTypeService.deleteReportType(id);
                req.flash('success', message);
                break;
            default:
                req.flash('error', 'Không tìm thấy trang');
                return res.send({message: 'Không tìm thấy hình thức'});
        }
        return res.status(200).json({message});
    } catch (error) {
        req.flash('error', error.message);
        return res.status(500).json({ message: error.message });
    }
};

// ?category = 'ads' || 'report'
const modify = async (req, res) => {
    const returnUrl = req.originalUrl.replace(`/${req.params.id}`, '');
    const category = req.query.category || '';
    const id = req.params.id;
    const newData = req.body;
    console.log(newData);
    try {
        switch (category) {
            case 'ads':
                const newAds = {
                    CategoriesName: newData.type,
                    description: newData.desc
                }
                const messageAds = await adsCategoriesService.modifyCategories(id, newAds);

                req.flash('success', messageAds);
                break;
            case 'report':
                const newReport = {
                    reportTypeName: newData.reportTypeName,
                    reportTypeDes: newData.reportTypeDes
                }
                const messageReport = await reportTypeService.updateReportType(id, newReport);
                req.flash('success', messageReport);
                break;
            default:
                req.flash('error', 'Không tìm thấy trang');
                return res.redirect(returnUrl);
        }
        return res.redirect(returnUrl);
    } catch (error) {
        req.flash('error', error.message);
        return res.status(500).json({ message: error.message });
    }
};

export default {
    add,
    handleCategory,
    add,
    showDetail,
    modify,
    remove,
    show
}