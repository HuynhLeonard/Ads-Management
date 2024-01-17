// using ajax to get data from server
const testHostname = "http://localhost:3000/";
const deployHostname = "https://ads-manager-1aai.onrender.com/";
const hostname = window.location.hostname;
let requestHostname = "";


const getHostname = () => {
  if (hostname.includes("onrender")) {
    requestHostname = deployHostname;
  } else {
    requestHostname = testHostname;
  }
}

// auto run get hostname
getHostname();

export const getAllSpots = async () => {
  const headers = new Headers();
  const res = await fetch(`http://localhost:3000/api/map/locations`, {
    method: 'GET',
    headers: headers,
    mode: 'cors',
  });
  return await res.json();
}

export const getDetailSpot = async (spotID) => {
  const res = await fetch(`${requestHostname}api/locations/${spotID}?role=citizen`, {
    method: 'GET',
    mode: 'cors',
  });
  return await res.json();
}

export const getDetailBoard = async (boardID) => {
  const res = await fetch(`${requestHostname}api/boards/${boardID}`, {
    method: 'GET',
    mode: 'cors',
  });
  return await res.json();

}

let accessToken = "";

export const getAccessToken = async () => {
  const res = await fetch(`${requestHostname}imgur`, {
    method: 'GET',
    mode: 'cors',
  });
  return await res.json();
}

const uploadOneImgur = async (file) => {
  if (accessToken === "") {
    accessToken = await getAccessToken();
    accessToken = accessToken.accessToken;
    console.log(accessToken);
  }
  const formData = new FormData();
  formData.append('image', file);
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${accessToken}`);

  const res = await fetch('https://api.imgur.com/3/image', {
    headers: headers,
    method: 'POST',
    body: formData,
    redirect: 'follow',
  });
  const data = await res.json();
  return data.data.link;
}

export const upload2Imgur = async (files) => {
  const links = [];
  console.log(files);
  for (let i = 0; i < files.length; i++) {
    const link = await uploadOneImgur(files[i]);
    links.push(link);
  };
  return links;
}

export const uploadReport = async (report, captcha) => {
  try {
    const res = await fetch(`${requestHostname}api/reports`, {
      method: 'POST',
      headers: [
        ['Content-Type', 'application/json'],
      ],
      mode: 'cors',
      body: JSON.stringify({report, captcha}),
    });
    if (res.status !== 200) throw new Error();
    return await res.json();
  } catch (err) {
    console.log(err);
    throw err;
  }

}

export const getReport = async (reportID) => {
  const res = await fetch(`${requestHostname}api/reports/${reportID}`, {
    method: 'GET',
    mode: 'cors',
  });
  return await res.json();
}

export const getReportTypes = async () => {
  const res = await fetch(`${requestHostname}api/report-types`, {
    method: 'GET',
    mode: 'cors',
  });
  return await res.json();
}

export const getReportList = async (reportIDs) => {
  const res = await fetch(`${requestHostname}api/reports?reportIDs=${reportIDs}`, {
    method: 'GET',
    mode: 'cors',
  });
  return await res.json();
}

export const getDistrictWardName = async (lng, lat) => {
  const res = await fetch(`${requestHostname}api/district-ward-name?lng=${lng}&lat=${lat}`, {
    method: 'GET',
    mode: 'cors',
  });
  return await res.json();
}


export default {
  getAllSpots,
  getDetailSpot,
  upload2Imgur,
  uploadReport,
  getReport,
  getReportTypes,
  getReportList,
  getDistrictWardName,
}
