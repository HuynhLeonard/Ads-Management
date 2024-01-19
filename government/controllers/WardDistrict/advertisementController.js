import editRequestSchema from '../../models/editRequestSchema.js';
import * as adsFormService from '../../services/adsCategoriesService.js';
import * as boardService from '../../services/boardService.js';
import * as boardTypeService from '../../services/boardTypeService.js';
import * as districtService from '../../services/districtService.js';
import * as spotService from '../../services/locationService.js';
import * as spotTypeService from '../../services/locationTypeService.js';
import { editRequestService } from '../../services/requestService.js';
import * as wardService from '../../services/wardService.js';
const isOutDated = (date) => {
	const curDate = new Date();
	const inDate = new Date(date);

	return inDate < curDate;
}

const show = async (req, res) => {
  const role = String(req.originalUrl.split('/')[1])
  const category = req.query.category || ''
  let tableHeads = []
  let tableData = []
  let title = role === 'district' ? 'Quận' : 'Phường'
  let checkboxHeader = ''

  if (role === 'district') {
    console.log(req.user);
    checkboxHeader = await districtService.getDistrictByID(req.user.districtID)
    if (checkboxHeader) checkboxHeader = checkboxHeader.districtName
    else checkboxHeader = 'Không có thông tin quận'
  }
  else if (role === 'ward') {
    checkboxHeader = await wardService.getWard(req.user.wardID)
    if (checkboxHeader) checkboxHeader =  checkboxHeader.wardName
    else checkboxHeader = 'Không có thông tin phường'
  }

  switch (category) {
    case 'Location':
      title += ' - Điểm đặt quảng cáo'
      if (role === 'district')
        tableHeads = ['ID', 'Phường', 'Điểm đặt', 'Loại vị trí', 'Hình thức quảng cáo', 'Thông tin quy hoạch']
      else if (role === 'ward')
        tableHeads = ['ID', 'Điểm đặt', 'Loại vị trí', 'Hình thức quảng cáo', 'Thông tin quy hoạch']
      break
    case 'Board':
      title += ' - Bảng quảng cáo'
      if (role === 'district') tableHeads = ['ID', 'Phường', 'Điểm đặt', 'Loại bảng quảng cáo', 'Kích thước', 'Số lượng']
      else if (role === 'ward') tableHeads = ['ID', 'Điểm đặt', 'Loại bảng quảng cáo', 'Kích thước', 'Số lượng']
      break
    default:
      res.status(404)
      return res.render('error', { error: { status: 404, message: 'Không tìm thấy trang' } })
  }

  const getSpotTableData = async (spots, role) => {
    return spots.map((spot) => ({
      id: spot.locationID,
      ward: role === 'district' ? spot.wardName : undefined,
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
      ward: role === 'district' ? board.wardName : undefined,
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

  if (category === 'Location') {
    if (role === 'district') {
      tableData = await getSpotTableData(await spotService.getLocationFromDistricts(req.user.districtID), role)
    } else if (role === 'ward') {
      tableData = await getSpotTableData(await spotService.getLocationFromWard(req.user.wardID), role)
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
    checkboxData = await wardService.getWardOfDistrict(req.user.districtID)
    checkboxData = checkboxData.map((ward) =>{
      return {
        name: `${ward.wardName}`,
        status: tableData.some(item => item.ward === ward.wardName)
      }
    });
  }
  console.log(tableHeads);
  console.log(tableData);
  console.log(checkboxData);
  res.render('ads', {
    url: req.originalUrl,
    title,
    category,
    checkboxHeader,
    checkboxData,
    tableHeads,
    tableData,
    role: role
  })
}

const showDetail = async (req, res, isEdit) => {
  console.log(req.user);
  const ID = req.params.id;
  const role = String(req.originalUrl.split('/')[1]);
  const category = req.query.category || '';
  const isSpotCategory = category === 'Location';
  let title = '';
  if (isEdit)
    title = `${role === 'district' ? 'Quận ' : role === 'ward' ? 'Phường ' : '-'} Chỉnh sửa ${isSpotCategory ? 'điểm đặt' : 'bảng quảng cáo'}`;
  else
    title = `${role === 'district' ? 'Quận ' : role === 'ward' ? 'Phường ' : '-'} Chi tiết ${isSpotCategory ? 'điểm đặt' : 'bảng quảng cáo'}`;

  const getData = isSpotCategory ? spotService.getSingleLocation : boardService.getSingleBoard;
  const detailData = await getData(ID);

  // console.log(detailData);

  const commonData = {
    url: req.originalUrl,
    title,
    role: role
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
      locationtypeName: detailData.locationtypeName,
      adsForm: detailData.adsForm,
      adsFormName: detailData.adsFormName,
      planned: detailData.planned === 1 ? 'Đã quy hoạch' : 'Chưa quy hoạch',
      imgUrls: detailData.images,
      longitude: detailData.longitude,
      latitude: detailData.latitude,
    };

    const boardsTableHeads = ['ID', 'Loại bảng quảng cáo', 'Kích thước', 'Số lượng'];
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
      // other.spottypes = await spotTypeService.getAllSpotTypes() || [];
      // other.adsforms = await adsFormService.getAllAdsForms() || [];
      // other.districts = await districtService.getAllDistricts() || [];
      // other.wards = await wardService.getAllWards() || [];
      // promise.all
      const [spottypes, adsforms, districts, wards] = await Promise.all([
        spotTypeService.getAllLocationType(),
        adsFormService.getAllCategories(),
        districtService.getAllDistricts(),
        wardService.getAllWard(),
      ]);
      other.spottypes = spottypes || [];
      other.adsforms = adsforms || [];
      other.districts = districts || [];
      other.wards = wards || [];

      res.render('modifyLocation', { ...commonData, ...data, other});
    } else {
      res.render('detailLocation', { ...commonData, ...data, boardsTableHeads, boardsTableData: transformedBoardsTableData });
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
      content: detailData.content,
      isOutDated: isOutDated(detailData.endDate)
    };

    if (isEdit) {
      let other = {}
      if (role === 'district') {
        other.spots = await spotService.getLocationFromDistricts(req.user.districtID);
      } else if (role === 'ward') {
        other.spots = await spotService.getLocationFromWard(req.user.wardID);
      }
      other.boardtypes = await boardTypeService.getAllBoardType() || [];
      other.adsforms = await adsFormService.getAllCategories() || [];
      other.spottypes = await spotTypeService.getAllLocationType() || [];
      res.render('modifyBoard', { ...commonData, ...data, other });
    } else {
      res.render('detailBoard', { ...commonData, ...data });
    }
  }
};


const showAdd = (req, res) => {
	const role = String(req.originalUrl.split('/')[1]);
	const category = req.query.category || '';
	let title = '- Thêm ' + (category === 'spot' ? 'điểm đặt' : 'bảng quảng cáo');
	if (role === 'quan') {
		title = 'Quận ' + title;
	}
	if (role === 'phuong') {
		title = 'Phường ' + title;
	}
	res.render(`${category}-new`, {url: req.originalUrl, title, toolbars: createToolbar(role)});
}


// ... Khong xai ...
// Gop chung voi show detail
const showModify = (req, res) => {
	const role = String(req.originalUrl.split('/')[1]);
	const category = req.query.category || '';
	let title = 'Chỉnh sửa ' + (category === 'spot' ? 'điểm đặt' : 'bảng quảng cáo');
	if (role === 'quan') {
		title = 'Quận ' + title;
	}
	if (role === 'phuong') {
		title = 'Phường ' + title;
	}
	res.render(`${category}-modify`, {url: req.originalUrl, title, toolbars: createToolbar(role)});
}
// ..................

const generateRequestID = async () => {
  const count = await editRequestSchema.countDocuments();
  const requestID = 'YC-CS' + String(count + 1).padStart(3,'0');
  return requestID;
}
const request = async (req, res) => {
  try {
		let data = req.body;
    console.log(data);
    const type = req.query.category;
    const { reason, officerUsername, ...rest } = data;
    data = {
      requestID: await generateRequestID(),
      requestTime: new Date(),
      objectID: (type === 'Location') ? rest.locationID : rest.boardID,
      reason: reason,
      editContent: rest,
      status: 0,
      officer: officerUsername,
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
