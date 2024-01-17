import editRequest from "../models/editRequestSchema.js";
import licensingRequest from "../models/licensingSchema.js";
import {request} from 'http'

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

    async create(data) {
        try {
            console.log(data);
            const newRequest = new this.model(data);
            await newRequest.save();
            return { message: `${this.model.modelName} created successfully` }
        } catch (error) {
            throw new Error('Error creating data.')
        }
    }
    
    async updateById(id, newData) {
        try {
            await this.model.findOneAndUpdate({requestID: id}, {$set: newData});
            return { message: `${this.model.modelName} updated successfully` }
        } catch (error) {
            throw new Error('Error creating data.')
        }
    }

    async deleteById(id) {
        try {
            await this.model.findOneAndDelete({requestID: id});
            return { message: `${this.model.modelName} delete successfully` }
        } catch (error) {
            throw new Error('Error creating data.')
        }
    }

    async getAll() {
        try {
            return await this.model.aggregate(this.buildQueryOption());
        } catch (error) {
            throw new Error('Error creating data.')
        }
    }

    async getSingle(id) {
        try {
            const options = this.buildQueryOption();
            options.push({
                $match: {
                    requestID: id
                }
            });

            const data = await this.model.aggregate(options);
            return data[0];
        } catch (error) {
            throw new Error('Error getting data.')
        }
    }

    async getByStatus(status) {
        try {
            const options = this.buildQueryOption();
            options.push({
                $match: {
                    status: status
                }
            });
            return await this.model.aggregate(options);
        } catch (error) {
            throw new Error('Error getting data.')
        }
    }

    async updateStatus(id, status) {
        try {
            await this.model.findOneAndUpdate({requestID: id}, {status: status});
        } catch (error) {
            throw new Error('Error updating status')
        }
    }
}

const licensingRequestService = new RequestService(licensingRequest);
const editRequestService = new RequestService(editRequest);

export {licensingRequestService, editRequestService};