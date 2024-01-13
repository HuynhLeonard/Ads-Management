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
			actions: {edit: true, remove: true, info: true}
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

    return {tableHeads: tableHeads[category], tableData};
};

const createForm = async (service, formName, type, desc) => {

}

// ?category='ads || report'
const show = async (req,res) => {
    const category = req.query.category || '';
    let tableHeads = [];
    let tableData = [];
    let title = '';

    try {
        if(category === 'ads' || category === 'report') {
            const {tableHeads: tbHead, tableData: tbData} = await handleCategory(
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
            req.flash('error', error.message);
            return res.render('error', {
                title: '404',
                message: error.message
            })
        }
        res.render('/department/types', {
            title: title,
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

const showDetail = async (req,res) => {

};

// ?category='ads || report'
const add = async (req,res) => {
    const category = req.params.category;
    const newData = req.body;

    try {
        if(category === 'ads' || category === 'report'){
            switch(category){
                case 'ads':
                    const newAds = {
                        CategoriesName: newData.CategoriesName,
                        description: newData.description
                    }
                    const messageAds = await adsCategoriesService.createCategories(newAds);

                    req.flash('success', messageAds);

                case 'report':
                    const newReport = {
                        reportTypeName: newData.reportTypeName,
                        reportTypeDes: newData.reportTypeDes
                    }
                    const messageReport = await reportTypeService.createReportType(newReport);

                    req.flash('success', messageReport);
            }
            res.redirect('/department/typesController');
        }
    } catch (error) {
        req.flash('error', error.message);
        return res.status(500).json({ message: error.message });
    }

};

const remove = async (req,res) => {

};

const modify = async (req,res) => {

};