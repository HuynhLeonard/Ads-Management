import * as IDGenerator from '../../services/IDGenerator.js';
import * as boardService from '../../services/boardService.js';
import { getBoardTypeByID } from '../../services/boardTypeService.js';
import { getByID, updateByID } from '../../services/licensingRequestService.js';
import { editRequestService, licensingRequestService } from '../../services/requestService.js';
import * as spotService from '../../services/spotService.js';

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
            point_id: request.spotID,
            ward: request.wardName || 'N/A',
            district: request.districtName || 'N/A',
            officer: request.officerUsername,
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
            officer: request.officerUsername,
            reason: request.reason,
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
    return res.render('./so/requests', { url: req.originalUrl, title, category, tableHeads, tableData, toolbars, statusCnt });
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
            data = await getByID(id);
            let spotDetail = await spotService.getSpotByID(data.spotID);
            const boardType = await getBoardTypeByID(data.boardType);

            // console.log(spotDetail);
            data = {
                requestID: data.requestID,
                spotID: data.spotID,
                name: spotDetail.spotName,
                address: `${spotDetail.address}, Phường ${spotDetail.wardName}, Quận ${spotDetail.districtName}`,
                company: data.companyName,
                phone: data.companyPhone,
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
                imgUrls: data.adsImages,
                officerUsername: data.officerUsername,
                ward: spotDetail.wardName,
                district: spotDetail.districtName,
                extendForBoard: data.extendForBoard,
            }
            return res.render('./so/license-request-detail', { title, toolbars, ...data });
        case 'modify':
            console.log('modify');
            data = await editRequestService.getByID(id);
            const type = data.objectID.startsWith('DD') ? 'spot' : 'board';
            if (data.requestTime !== undefined) {
                data.requestTime = data.requestTime.toLocaleDateString('vi-VN');
            }
            return res.render('./so/edit-request-detail', { title, toolbars, id: req.params.id, type, ...data });
    }
}

controller.requestProcessing = async (req, res) => {
    try {
        const { requestID, status } = req.body;
        console.log(requestID, status);
        let { message } = await editRequestService.updateStatus(requestID, status);
        console.log(`Message: ${message}`);

        if (status === 1) {
            const { objectID, newInfo } = await editRequestService.getByID(requestID);
            if (objectID.startsWith('DD')) {
                const { spotID, address, latitude, longitude, wardID, districtID, spotType, adsForm, planned, spotName, spotImage } = newInfo;
                await spotService.updateSpotByID(spotID, {
                    address,
                    latitude,
                    longitude,
                    wardID,
                    districtID,
                    spotType,
                    adsForm,
                    planned,
                    spotName,
                    spotImage
                })
            } else {
                const { boardID, boardType, spotID, height, width, quantity, image, licensingID } = newInfo;
                await boardService.updateBoardByID(boardID, {
                    boardType,
                    spotID,
                    height,
                    width,
                    quantity,
                    image,
                    licensingID
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
            const response = await boardService.updateBoardByID(data.boardID, { licensingID: data.licensingID });
            if (response.message.trim() == 'Board updated successfully') {
                const response1 = await updateByID(data.licensingID, { status: 1 });
                // console.log(response1);
            }
            res.redirect('/so/requests?category=license');
        } catch (error) {
            console.log(`Error sending edit request: ${error.message}`);
            req.flash('error', error.message);
            res.redirect('/so/requests?category=license');
        }
    } else {
        data.boardID = await IDGenerator.getNewID('Board');
        // console.log(data);

        try {
            const response = await boardService.createBoard(data);
            if (response.message.trim() == 'Board created successfully') {
                const response1 = await updateByID(data.licensingID, { status: 1 });
                // console.log(response1);
            }
            res.redirect('/so/requests?category=license');
        } catch (error) {
            console.log(`Error sending edit request: ${error.message}`);
            req.flash('error', error.message);
            res.redirect('/so/requests?category=license');
        }
    }

}

controller.rejectLicense = async (req, res) => {
    const requestID = req.params.id;
    try {
        const response = await updateByID(requestID, { status: -1 });
        res.redirect('/so/requests?category=license');
    } catch (error) {
        console.log(`Error sending edit request: ${error.message}`);
        req.flash('error', error.message);
        res.redirect('/so/requests?category=license');
    }
}

export default controller;