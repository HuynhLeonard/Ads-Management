import { name } from "ejs";
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
        
        } else {

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
    
};

const remove = async (req,res) => {

};

const modify = async (req,res) => {

};