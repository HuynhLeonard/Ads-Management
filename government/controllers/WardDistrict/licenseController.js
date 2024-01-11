import { createLicense, deleteLicenseRequest } from "../../services/licensingService.js";
import {} from "../../services/locationService.js";
import {} from "../../services/userService.js";
import {} from "../../services/boardTypeService.js";
import {} from "../../services/boardService.js";
import {} from "../../services/districtService.js";
import {} from "../../services/wardService.js";

const show = (req, res) => {};

const showDetail = (req, res) => {};

const add = async (req, res) => {
    try {
        const license = req.body;
        license.status = 0;
        await createLicense(license);
        res.status(200).json({
            license,
        });
    } catch (error) {
        res.status(500).json("Getting error when add new license request");
    }
};

const deleteRequest = async (req, res) => {
    try {
        const id = req.param.id;
        await deleteLicenseRequest(id);
        res.status(200).json("Delete license request success");
    } catch (error) {
        res.status(500).json("Getting error when delete license request");
    }
};
