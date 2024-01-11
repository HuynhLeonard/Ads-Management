import editRequest from "../models/editRequestSchema.js";
import licensingRequest from "../models/licensingSchema.js";

class RequestService {
    constructor(model) {
        if(!model) {
            throw new Error('Model not defined.');
        }
        if(model !== licensingRequest && model !== editRequest) {
            throw new Error('Model is not valid.');
        }
        
        this.model = model;

        this.options= [
            {
                $lookup: {
                    from: 'wards',
                    localField: 'spot.wardID',
                    foreignField: 'wardID',
                    as: 'ward'
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
                    path: '$ward',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$district',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,
                    districtID: 1,
                    wardID: 1,
                    wardName: '$ward.wardName',
                    districtName: '$district.districtName'
                }
            }
        ]
    }

    buildQueryOption() {
        const commonOption = [
            {
                $lookup: {
                    from: 'wards',
                    localField: 'spot.wardID',
                    foreignField: 'wardID',
                    as: 'ward'
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
                    path: '$ward',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$district',
                    preserveNullAndEmptyArrays: true
                }
            }
        ]
        switch(this.model) {
            case licensingRequest:
                return [
                    {
                        $lookup: {
                            from: 'locations',
                            localField: 'locationID',
                            foreignField: 'locationID',
                            as: 'spot'
                        }
                    },
                    {
                        $unwind: {
                            path: '$spot',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    ...commonOption,
                    {
                        $project: this.buildResult()
                    }
                ]
            case editRequest:
                return [
                    {
                        $lookup: {
                            from: 'boards',
                            localField: 'objectID',
                            foreignField: 'boardID',
                            as: 'board'
                        }
                    },
                    {
                        $unwind: {
                            path: '$board',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $lookup: {
                            from: 'locations',
                            localField: 'board.locationID',
                            foreignField: 'locationID',
                            as: 'spot'
                        }
                    },
                    {
                        $unwind: {
                            path: '$spot',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    ...commonOption,
                    {
                        $project: this.buildResult()
                    }
                ]
        }
    }


    buildResult() {
        const commonProject = {
            _id: 0,
            wardID: 1,
            districtID: 1,
            wardName: '$ward.wardName',
            districtName: '$district.districtName',
            officer: 1,
            status: 1
        }
        switch(this.model) {
            case licensingRequest:
                return {
                    ...commonProject,
                    requestID: 1,
                    locationID: 1,
                    startDate: 1,
                    endDate: 1
                }
            case editRequest:
                return {
                    ...commonProject,
                    requestID: 1,
                    objectID: 1,
                    editContent: 1,
                    requestTime: 1,

                }
        }
    }
}

export default new RequestService();