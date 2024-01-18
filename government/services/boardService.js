import Board from '../models/boardSchema.js';

// check loi vi tri diem dat
// Done
export const createNewBoard = async (boardData) => {
    try {
        const newBoard = new Board(boardData);
        const saveData = await newBoard.save();
        return { message: 'Board created successfully' };
    } catch (error) {
        throw new Error(`Error creating board: ${error.message}`);
    }
};

// Done
export const getSingleBoard = async (boardID) => {
    try {
        const option = [
            {
                $match: {
                    boardID: boardID,
                }
            },
            {
                $lookup: {
                    from: 'locations',
                    localField: 'locationID',
                    foreignField: 'locationID',
                    as: 'spot',
                }
            },
            {
                $lookup: {
                    from: 'licensingrequests',
                    localField: 'licenseNumber',
                    foreignField: 'requestID',
                    as: 'licensereq',
                }
            },
            {
                $lookup: {
                    from: 'boardtypes',
                    localField: 'boardModelType',
                    foreignField: 'boardTypeID',
                    as: 'boardtype',
                }
            },
            {
                $lookup: {
                    from: 'locationtypes',
                    localField: 'spot.locationType',
                    foreignField: 'locationTypeID',
                    as: 'spottype',
                }
            },
            {
                $lookup: {
                    from: 'adscategories',
                    localField: 'spot.adsForm',
                    foreignField: 'CategoriesID',
                    as: 'adsform',
                }
            },
            {
                $lookup: {
                    from: 'districts',
                    localField: 'spot.districtID',
                    foreignField: 'districtID',
                    as: 'district'
                }
            },
            {
                $unwind: {
                    path: '$district',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'wards',
                    localField: 'spot.wardID',
                    foreignField: 'wardID',
                    as: 'ward'
                }
            },
            {
                $unwind: {
                    path: '$ward',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$spot',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$licensereq',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$boardtype',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$spottype',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$adsform',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    boardID: 1,
                    locationID: 1,
                    spotName: '$spot.locationName',
                    spotAddress: '$spot.address',
                    districtName: '$district.districtName',
                    wardName: '$ward.wardName',
                    authCompany: '$licensereq.companyName',
                    authCompanyPhone: '$licensereq.phoneNumber',
                    authCompanyEmail: '$licensereq.companyEmail',
                    authCompanyAddress: '$licensereq.companyAddress',
                    startDate: '$licensereq.startDate',
                    endDate: '$licensereq.endDate',
                    boardModelType: 1,
                    boardTypeName: '$boardtype.typeName',
                    quantity: 1,
                    height: 1,
                    width: 1,
                    spotType: '$spot.locationType',
                    spotTypeName: '$spottype.locationTypeName',
                    adsForm: '$adsform.CategoriesID',
                    adsFormName: '$adsform.CategoriesName',
                    images: 1,
                    licenseNumber: 1,
                    content: '$licensereq.content'
                }
            }
        ]
        const board = await Board.aggregate(option);
        return board[0];
    } catch (error) {
        throw new Error(`Error getting board by ID: ${error.message}`);
    }
};

// Done
export const getAllBoards = async () => {
    const option = [
        {
            $lookup: {
                from: 'boardtypes',
                localField: 'boardModelType',
                foreignField: 'boardTypeID',
                as: 'boardtypes'
            }
        },
        {
            $unwind: {
                path: '$boardtypes',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'locations',
                localField: 'locationID',
                foreignField: 'locationID',
                as: 'location'
            }
        },
        {
            $unwind: {
                path: '$location',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'districts',
                localField: 'location.districtID',
                foreignField: 'districtID',
                as: 'district'
            }
        },
        {
            $unwind: {
                path: '$district',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'wards',
                localField: 'location.wardID',
                foreignField: 'wardID',
                as: 'ward'
            }
        },
        {
            $unwind: {
                path: '$ward',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 0,
                boardID: 1,
                locationID: 1,
                locationName: '$location.locationName',
                districtID: '$district.districtID',
                districtName: '$district.districtName',
                wardID: '$ward.wardID',
                wardName: '$ward.wardName',
                boardModelType: 1,
                boardTypeName: '$boardtypes.typeName',
                height: 1,
                width: 1,
                quantity: 1,
            }
        },
        {
            $sort: {
                boardID: 1
            }
        }
    ]
    try {
        const boards = await Board.aggregate(option);
        return boards
    } catch (error) {
        throw new Error(`Error getting all boards: ${error.message}`);
    }
};

// done
export const getAllBoardsOfSpot = async (spotID) => {
    const option = [
        {
            $match: {
                locationID: spotID
            }
        },
        {
            $lookup: {
                from: 'boardtypes',
                localField: 'boardModelType',
                foreignField: 'boardTypeID',
                as: 'boardtypes'
            }
        },
        {
            $unwind: {
                path: '$boardtypes',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 0,
                boardID: 1,
                locationID: 1,
                boardModelType: 1,
                boardTypeName: '$boardtypes.typeName',
                height: 1,
                width: 1,
                quantity: 1
            }
        }
    ]

    try {
        const boards = await Board.aggregate(option);
        return boards;
    } catch (error) {
        throw new Error(`Error getting all boards: ${error.message}`);
    }
};

export const getAllBoardsOfDistrict = async (districtID) => {
    try {
        const option = [
            {
                $lookup: {
                    from: 'boardtypes',
                    localField: 'boardModelType',
                    foreignField: 'boardTypeID',
                    as: 'boardtypes'
                }
            },
            {
                $unwind: {
                    path: '$boardtypes',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'locations',
                    localField: 'locationID',
                    foreignField: 'locationID',
                    as: 'location'
                }
            },
            {
                $unwind: {
                    path: '$location',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    'location.districtID': districtID,
                }
            },
            {
                $lookup: {
                    from: 'wards',
                    localField: 'location.wardID',
                    foreignField: 'wardID',
                    as: 'ward'
                }
            },
            {
                $unwind: {
                    path: '$ward',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    boardID: 1,
                    locationID: 1,
                    locationName: '$location.locationName',
                    districtID: '$location.districtID',
                    wardID: '$ward.wardID',
                    wardName: '$ward.wardName',
                    boardModelType: 1,
                    boardTypeName: '$boardtypes.typeName',
                    height: 1,
                    width: 1,
                    quantity: 1
                }
            }
        ];

        return await Board.aggregate(option);
    } catch (error) {
        throw new Error('Error getting all files.');
    }
};

export const getAllBoardsOfWard = async (wardID) => {
    try {
        const option = [
            {
                $lookup: {
                    from: 'boardtypes',
                    localField: 'boardModelType',
                    foreignField: 'boardTypeID',
                    as: 'boardtypes'
                }
            },
            {
                $unwind: {
                    path: '$boardtypes',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'locations',
                    localField: 'locationID',
                    foreignField: 'locationID',
                    as: 'location'
                }
            },
            {
                $unwind: {
                    path: '$location',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    'location.wardID': wardID,
                }
            },
            {
                $lookup: {
                    from: 'wards',
                    localField: 'location.wardID',
                    foreignField: 'wardID',
                    as: 'ward'
                }
            },
            {
                $unwind: {
                    path: '$ward',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    boardID: 1,
                    locationID: 1,
                    locationName: '$location.locationName',
                    districtID: '$location.districtID',
                    wardID: '$ward.wardID',
                    wardName: '$ward.wardName',
                    boardModelType: 1,
                    boardTypeName: '$boardtypes.typeName',
                    height: 1,
                    width: 1,
                    quantity: 1
                }
            }
        ];

        return await Board.aggregate(option);
    } catch (error) {
        throw new Error('Error getting all files.');
    }
}

// done
export const updateBoard = async (boardID, updatedData) => {
    try {
        console.log('in board Service', updatedData);
        const updatedBoard = await Board.findOneAndUpdate(
            { boardID: boardID },
            { $set: updatedData },
        );

        return { message: 'Board updated successfully' }
    } catch (error) {
        throw new Error(`Error updating board by ID: ${error.message}`);
    }
};

// done
export const deleteBoardByID = async (boardID) => {
    try {
        await Board.findOneAndDelete({ boardID: boardID });
        return { message: 'Board deleted successfully.' }
    } catch (error) {
        throw new Error(`Error deleting board by ID: ${error.message}`);
    }
};

// count function

export const countAll = async () => {
    try {
        const docs = Board.countDocuments();
        return docs
    } catch (error) {
        throw new Error(`Error couting boards of spot: ${error.message}`);
    }
};

export const countDistrict = async (districtID) => {
    try {
        const docs = Board.countDocuments({ districtID: districtID });

        return docs
    } catch (error) {
        throw new Error(`Error get wards of count documents: ${error.message}`)
    }
};

export const countByLocation = async (locationID) => {
    try {
        return Board.countDocuments({ locationID: locationID });
    } catch (error) {
        throw new Error("Error getting information!");
    }
};

export const countByWard = async (wardID) => {
    try {
        return Board.countDocuments({ wardID: wardID });
    } catch (error) {
        throw new Error('Error happen when getting information.');
    }
}