import * as locationService from '../../services/locationService.js';
import * as boardService from '../../services/boardService.js';
import * as wardService from '../../services/wardService.js';
import * as districtService from '../../services/districtService.js';
import * as adsFormService from '../../services/adsCategoriesService.js';
import * as locationTypeService from '../../services/locationTypeService.js';
import * as boardTypeService from '../../services/boardTypeService.js';
// not add
// import { editRequestService } from '../../services/requestService.js';
// import * as IDGenerator from '../../services/IDGenerator.js';

// test later

const show = async (req, res) => {
    const role = String(req.originalUrl.split('/')[1]);
    console.log(role)
    const category = req.query.category || ''
    let tableHeads = []
    let tableData = []
    let title = role === 'district' ? 'Quận' : 'Phường'
    let checkboxHeader = ''

    if (role === 'district') {
        checkboxHeader = await districtService.getDistrictByID(req.user.districtID)
        if (checkboxHeader) checkboxHeader = 'Quận ' + checkboxHeader.districtName
        else checkboxHeader = 'Không có thông tin quận'
    }
    else if (role === 'ward') {
        checkboxHeader = await wardService.getWard(req.user.wardID)
        if (checkboxHeader) checkboxHeader = 'Phường ' + checkboxHeader.wardName
        else checkboxHeader = 'Không có thông tin phường'
    }

    switch (category) {
        case 'location':
        title += ' - Điểm đặt quảng cáo'
        if (role === 'quan')
            tableHeads = ['ID', 'Phường', 'Điểm đặt', 'Loại vị trí', 'Hình thức quảng cáo', 'Thông tin quy hoạch']
        else if (role === 'phuong')
            tableHeads = ['ID', 'Điểm đặt', 'Loại vị trí', 'Hình thức quảng cáo', 'Thông tin quy hoạch']
        break
        case 'board':
        title += ' - Bảng quảng cáo'
        if (role === 'quan') tableHeads = ['ID', 'Phường', 'Điểm đặt', 'Loại bảng quảng cáo', 'Kích thước', 'Số lượng']
        else if (role === 'phuong') tableHeads = ['ID', 'Điểm đặt', 'Loại bảng quảng cáo', 'Kích thước', 'Số lượng']
        break
        default:
        res.status(404)
        return res.render('error', { error: { status: 404, message: 'Không tìm thấy trang' } })
    }

    const getSpotTableData = async (spots, role) => {
        return spots.map((spot) => ({
        id: spot.locationID,
        ward: role === 'ward' ? spot.wardName : undefined,
        spot: spot.locationName,
        locationType: spot.locationtypeName,
        type: spot.adsFormName,
        plan: spot.planned === 1 ? 'Đã quy hoạch' : 'Chưa quy hoạch',
        actions: {
            edit: false,
            remove: true,
            info: true
        }
        }))
    }

    const getBoardTableData = async (boards, role) => {
        return boards.map((board) => ({
        id: board.boardID,
        ward: role === 'quan' ? board.wardName : undefined,
        spot: board.locationName,
        type: board.boardTypeName,
        size: `${board.height}x${board.width}m`,
        quantity: `${board.quantity} trụ/bảng`,
        actions: {
            edit: false,
            remove: true,
            info: true
        }
        }))
    }

    if (category === 'location') {
        if (role === 'district') {
        tableData = await getSpotTableData(await locationService.getLocationFromDistricts(req.user.districtID), role)
        // test
        console.log(tableData);
        } else if (role === 'ward') {
        tableData = await getSpotTableData(await locationService.getLocationFromWard(req.user.wardID), role);
        console.log(tableData);
        }
    } else {
        if (role === 'district') {
        tableData = await getBoardTableData(await boardService.getAllBoardsOfDistrict(req.user.districtID), role)
        } else if (role === 'ward') {
        tableData = await getBoardTableData(await boardService.getAllBoardsOfWard(req.user.wardID), role)
        }
    }

    let checkboxData = []
    if (role === 'district') {
        checkboxData = await wardService.getAllWard(req.user.districtID)
        checkboxData = checkboxData.map((ward) =>{
        return {
            name: `Phường ${ward.wardName}`,
            status: tableData.some(item => item.ward === ward.wardName)
        }
        });
    }

    // render later
    res.render('ads', {
        url: req.originalUrl,
        title,
        category,
        checkboxHeader,
        checkboxData,
        tableHeads,
        tableData,
    })
}

// '/:id?category='
const showDetail = async (req, res, isEdit) => {
  const ID = req.params.id;
  const role = String(req.originalUrl.split('/')[1]);
  const category = req.query.category || '';
  const isSpotCategory = category === 'location';
  let title = '';
  if (isEdit)
    title = `${role === 'district' ? 'Quận ' : role === 'ward' ? 'Phường ' : '-'} Chỉnh sửa ${isSpotCategory ? 'điểm đặt' : 'bảng quảng cáo'}`;
  else
    title = `${role === 'district' ? 'Quận ' : role === 'ward' ? 'Phường ' : '-'} Chi tiết ${isSpotCategory ? 'điểm đặt' : 'bảng quảng cáo'}`;

  const getData = isSpotCategory ? locationService.getSingleLocation : boardService.getSingleBoard;
  const detailData = await getData(ID);

  // console.log(detailData);

  const commonData = {
    url: req.originalUrl,
    title,
    toolbars: createToolbar(role),
  };

    if (isSpotCategory) {
        const data = {
        spotTitle: detailData.locationName,
        spotId: detailData.locationID,
        spotAddress: detailData.address,
        ward: detailData.wardID,
        district: detailData.districtID,
        wardName: detailData.wardName,
        districtName: detailData.districtName,
        spotType: detailData.locationType,
        spotTypeName: detailData.locationtypeName,
        adsForm: detailData.adsForm,
        adsFormName: detailData.adsFormName,
        planned: detailData.planned === 1 ? 'Đã quy hoạch' : 'Chưa quy hoạch',
        imgUrls: detailData.images,
        longitude: detailData.longitude,
        latitude: detailData.latitude,
        };

    const boardsTableHeads = ['ID', 'Loại bảng quảng cáo', 'Kích thước', 'Số lượng'];
    // check function
    const boardsTableData = (!isEdit)? await boardService.getAllBoardsOfSpot(ID) : [];
    const transformedBoardsTableData = boardsTableData.map((board) => ({
      id: board.boardID,
      type: board.boardTypeName,
      size: `${board.height}x${board.width}m`,
      quantity: `${board.quantity} trụ/bảng`,
      actions: { edit: false, remove: false, info: true },
    }));

    if (isEdit) {
      let other = {}
      other.spottypes = await locationTypeService.getAllLocationType() || [];
      other.adsforms = await adsFormService.getAllCategories() || [];
      other.districts = await districtService.getAllDistricts() || [];
      other.wards = await wardService.getAllWard() || [];
      res.render('location-modify', { ...commonData, ...data, other });
    } else {
      res.render('location-detail', { ...commonData, ...data, boardsTableHeads, boardsTableData: transformedBoardsTableData });
    }
  } else {
    const data = {
      id: detailData.boardID,
      spotID: detailData.locationID,
      spotName: detailData.spotName,
      spotAddress: detailData.spotAddress,
      authCompany: detailData.authCompany,
      authCompanyAddress: detailData.authCompanyAddress,
      authCompanyPhone: detailData.authCompanyPhone,
      authCompanyEmail: detailData.authCompanyEmail,
      startDate: detailData.startDate.toLocaleDateString('vi-VN'),
      endDate: detailData.endDate.toLocaleDateString('vi-VN'),
      boardTypeName: detailData.boardTypeName,
      quantity: detailData.quantity,
      height: detailData.height,
      width: detailData.width,
      spotTypeName: detailData.spotTypeName,
      adsFormName: detailData.adsFormName,
      imgUrls: detailData.images,
      boardType: detailData.boardType,
      adsForm: detailData.adsForm,
      spotType: detailData.spotType,
      licensingID: detailData.licenseNumber,
      content: detailData.content
    };

    if (isEdit) {
      let other = {}
      if (role === 'quan') {
        other.spots = await spotService.getSpotsByDistrictID(req.user.districtID);
      } else if (role === 'phuong') {
        other.spots = await spotService.getSpotsByWardID(req.user.wardID);
      }
      other.boardtypes = await boardTypeService.getAllBoardType() || [];
      other.adsforms = await adsFormService.getAllCategories() || [];
      other.spottypes = await locationTypeService.getLocationType() || [];
      // console.log('====================================');
      // console.log(other.boardtypes);
      // console.log('====================================');
      res.render('board-modify', { ...commonData, ...data, other });
    } else {
      res.render('board-detail', { ...commonData, ...data });
    }
  }
};

//?category=Location
//?category=Board
const showAdd = (req, res) => {
  // http://localhost:3000/district
	const role = String(req.originalUrl.split('/')[1]);
	const category = req.query.category || '';
	let title = '- Thêm ' + (category === 'Location' ? 'điểm đặt' : 'bảng quảng cáo');
	if (role === 'district') {
		title = 'Quận ' + title;
	}
	if (role === 'ward') {
		title = 'Phường ' + title;
	}
	res.render(`add${category}`, {url: req.originalUrl, title});
}


// check later
// ?category=Location
const showModify = (req, res) => {
	const role = String(req.originalUrl.split('/')[1]);
	const category = req.query.category || '';
	let title = 'Chỉnh sửa ' + (category === 'Location' ? 'điểm đặt' : 'bảng quảng cáo');
	if (role === 'district') {
		title = 'Quận ' + title;
	}
	if (role === 'ward') {
		title = 'Phường ' + title;
	}
	res.render(`modify${category}`, {url: req.originalUrl, title});
}
// ..................

const request = async (req, res) => {
  try {
		let data = req.body;
    const type = req.query.category;
    const { reason, officerUsername, ...rest } = data;
    data = {
      requestID: await IDGenerator.getNewID('EditRequest'),
      requestTime: new Date(),
      objectID: (type === 'location') ? rest.spotID : rest.boardID,
      reason: reason,
      newInfo: rest,
      status: 0,
      officerUsername: officerUsername,
    }
    // console.log('Ads controller: ', data);
		let { message } = await editRequestService.create(data);
		console.log(`Message: ${message}`);
		req.flash('success', message);
		return res.redirect(req.originalUrl);
	} catch (error) {
		console.log(`Error sending edit request: ${error.message}`);
		req.flash('error', error.message);
		return res.redirect(req.originalUrl);
	}
}

export default {
	show,
	showAdd,
	showDetail,
	showModify,
  request,
};
