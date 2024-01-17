import apiService from '../../services/apiService.js';
import * as locationService from '../../services/location-detailService.js';

export const getReport = async (spotID) => {
  try {
    return await apiService.getSingleReport(spotID);
  } catch (error) {
    console.log(error);
    throw new Error(`Error getting spot: ${error.message}`);
  }
}

const verifyCaptcha = async (captcha) => {
  const secretKey = '6LeREjYpAAAAANtf2r4cBpqHqn9TuTe5yJ4JORtO';
  if (!captcha) throw new Error('No captcha');
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;
  try {
    const response = await fetch(verifyUrl);
    const body = await response.json();
    if (!body.success || body.score < 0.4) throw new Error('Captcha failed');
  } catch (error) {
    throw new Error(`Error verifying captcha: ${error.message}`);
  }
}

export const createReport = async (data) => {
  try {
    const secretKey = '6LeRPU0pAAAAAEWCzWcYcBZ86hWCBm4-lvFuX35T';
    if (!data.captcha) throw new Error('No captcha');
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${data.captcha}`;
    const response = await fetch(verifyUrl);
    const body = await response.json();
    if (!body.success || body.score < 0.4) throw new Error('Captcha failed');


    return await apiService.createReport(data.report);
  } catch (error) {
    console.log(error);
    throw new Error(`Error creating report: ${error.message}`);
  }
}

export const getAllReportTypes = async () => {
  try {
    return await apiService.getAllReportType();
  } catch (error) {
    console.log(error);
    throw new Error(`Error getting all report type: ${error.message}`);
  }
}

export const getListReport = async (reportIDs) => {
  try {
    return await apiService.getListReport(reportIDs);
  } catch (error) {
    console.log(error);
    throw new Error(`Error getting list report: ${error.message}`);
  }
}

export const getDistrictWardName = async (lat, lng) => {
  try {
    return await locationService.getDistrictWardName(lat, lng);
  } catch (error) {
    console.log(error);
    throw new Error(`Error getting district ward name: ${error.message}`);
  }
}
