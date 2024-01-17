import * as boardService from '../../services/boardService.js';
import { getSingleBoardType } from '../../services/boardTypeService.js';
import * as IDCreate from '../../services/createIDService.js';
import { getSingleRequest } from '../../services/licensingService.js';
import * as spotService from '../../services/locationService.js';
import { editRequestService, licensingRequestService } from '../../services/requestService.js';

const controller = {};

const convertDate = (date) => {
    const dateObject = new Date(date);

    const day = dateObject.getDate().toString().padStart(2, '0');
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = dateObject.getFullYear();

    return `${day}/${month}/${year}`;
}

controller.show = async (req, res) => {
    const category = req.query.category || '';
    let tableHeads = [];
    let tableData = [];
    let title = '';
    if (category === 'license') {
        tableHeads = ['ID Yêu cầu', 'ID Điểm đặt', 'Phường', 'Quận', 'Cán bộ', 'Thời gian quảng cáo', 'Trạng thái'];
        
        tableData = await licensingRequestService.getAll();
        tableData = tableData.map(request => ({
            id: request.requestID,
            point_id: request.locationID,
            ward: request.wardName || 'N/A',
            district: request.districtName || 'N/A',
            officer: request.officer,
            time: `${request.startDate.toLocaleDateString('vi-VN')} - ${request.endDate.toLocaleDateString('vi-VN')}`,
            status: request.status === 0 ? 'Đang chờ duyệt' : request.status === 1 ? 'Đã duyệt' : 'Đã từ chối',
            actions: {
                edit: false,
                remove: false,
                info: true
            }
        }));


        title = 'Sở - Yêu cầu cấp phép';
    } else if (category === 'modify') {
        tableHeads = ['ID Yêu cầu', 'ID Điểm đặt', 'Phường', 'Quận', 'Cán bộ', 'Tóm tắt chỉnh sửa', 'Trạng thái'];
        tableData = await editRequestService.getAll();
        tableData = tableData.map(request => ({
            id: request.requestID,
            point_id: request.objectID,
            ward: request.wardName || 'N/A',
            district: request.districtName || 'N/A',
            officer: request.officer,
            reason: request.editContent,
            status: request.status === 0 ? 'Đang chờ duyệt' : request.status === 1 ? 'Đã duyệt' : 'Đã từ chối',
            actions: {
                edit: false,
                remove: false,
                info: true
            }
        }));
        title = 'Sở - Yêu cầu chỉnh sửa';
    } else {
        res.status(404);
        return res.render('error', { error: { status: 404, message: 'Không tìm thấy trang' } });
    }

    let statusCnt = {
        done: 0,
        waiting: 0,
        decline: 0,
    };

    tableData.forEach(entry => {
        if (entry.status === 'Đang chờ duyệt') {
            statusCnt['waiting']++;
        }

        if (entry.status === 'Đã duyệt') {
            statusCnt['done']++;
        }

        if (entry.status === 'Đã từ chối') {
            statusCnt['decline']++;
        }
    });

    // console.log(statusCnt);
    return res.render('Department/requests', { url: req.originalUrl, title, category, tableHeads, tableData, statusCnt });
}

controller.showDetail = async (req, res) => {
    const id = req.params.id;
    let data = {};
    const title = 'Sở - Chi tiết yêu cầu';
    const category = req.query.category || '';
    if (category !== 'license' && category !== 'modify') {
        res.status(404);
        return res.render('error', { error: { status: 404, message: 'Không tìm thấy trang' } });
    }
    // console.log(req.params);
    switch (category) {
        case 'license':
            // console.log('license');
            data = await getSingleRequest(id);
            let spotDetail = await spotService.getSingleLocation(data.locationID);
            const boardType = await getSingleBoardType(data.boardType);
            console.log(data);
            // console.log(spotDetail);
            data = {
                requestID: data.requestID,
                spotID: data.locationID,
                name: spotDetail.locationName,
                address: `${spotDetail.address}, Phường ${spotDetail.wardName}, Quận ${spotDetail.districtName}`,
                company: data.companyName,
                phone: data.phoneNumber,
                email: data.companyEmail,
                compAddr: data.companyAddress,
                startTime: convertDate(data.startDate),
                endTime: convertDate(data.endDate),
                content: data.content,
                boardTypeID: data.boardType,
                boardType: boardType.typeName,
                height: data.height,
                width: data.width,
                quantity: data.quantity,
                state: data.status,
                imgUrls: data.images,
                officerUsername: data.officer,
                ward: spotDetail.wardName,
                district: spotDetail.districtName,
            }
            return res.render('Department/license-request-detail', { title, data:data });
        case 'modify':
            console.log('modify');
            data = await editRequestService.getSingle(id);
            const type = data.objectID.startsWith('LC') ? 'location' : 'board';
            if (data.requestTime !== undefined) {
                data.requestTime = data.requestTime.toLocaleDateString('vi-VN');
            }
            return res.render('Department/edit-request-detail', { title, toolbars, id: req.params.id, type, ...data });
    }
}

controller.requestProcessing = async (req, res) => {
    try {
        const { requestID, status } = req.body;
        console.log(requestID, status);
        let { message } = await editRequestService.updateStatus(requestID, status);
        //console.log(`Message: ${message}`);

        if (status === 1) {
            const { objectID, newInfo } = await editRequestService.getSingle(requestID);
            if (objectID.startsWith('LC')) {
                const { spotID, address, latitude, longitude, wardID, districtID, spotType, adsForm, planned, spotName, spotImage } = newInfo;
                await spotService.updateLocation(spotID, {
                    address: address,
                    latitude: latitude,
                    longitude: longitude,
                    wardID: wardID,
                    districtID: districtID,
                    locationType: spotType,
                    adsForm: adsForm,
                    planned: planned,
                    locationName: spotName,
                    images: spotImage
                })
            } else {
                const { boardID, boardType, spotID, height, width, quantity, image, licensingNumber } = newInfo;
                await boardService.updateBoard(boardID, {
                    boardModelType: boardType,
                    locationID: spotID,
                    height: height,
                    width: width,
                    quantity: quantity,
                    images: image,
                    licenseNumber: licensingNumber
                });
            }
        }

        req.flash('success', message);
        return res.redirect(req.originalUrl);
    } catch (error) {
        console.log(`Error sending edit request: ${error.message}`);
        req.flash('error', error.message);
        return res.redirect(req.originalUrl);
    }
}

controller.acceptLicense = async (req, res) => {
    const data = req.body;
    if (data.boardID != null) {
        try {
            const response = await boardService.updateBoard(data.boardID, { licenseNumber: data.licenseNumber });
            console.log(response.message.trim());
            if (response.message.trim() == 'Board updated successfully') {
                const response1 = await licensingRequestService.updateById(data.licenseNumber, { status: 1 });
                console.log(response1);
            }
            res.redirect('requests?category=license');
        } catch (error) {
            console.log(`Error sending edit request: ${error.message}`);
            req.flash('error', error.message);
            res.redirect('requests?category=license');
        }
    } else {
        // console.log(data);
        data.boardID = await IDCreate.getNewID('Board');
        try {
            const response = await boardService.createNewBoard(data);
            if (response.message.trim() == 'Board created successfully') {
                const response1 = await licensingRequestService.updateById(data.licenseNumber, { status: 1 });
                // console.log(response1);
            }
            res.redirect('requests?category=license');
        } catch (error) {
            console.log(`Error sending edit request: ${error.message}`);
            req.flash('error', error.message);
            res.redirect('requests?category=license');
        }
    }

}

controller.rejectLicense = async (req, res) => {
    const requestID = req.params.id;
    try {
        const response = await licensingRequestService.updateById(requestID, { status: -1 });
        res.redirect('/department/requests?category=license');
    } catch (error) {
        console.log(`Error sending edit request: ${error.message}`);
        req.flash('error', error.message);
        res.redirect('/department/requests?category=license');
    }
}

export default controller;