/* eslint-disable no-undef */
import request from "./request.js";
import { formatMapFeature } from "./formatMapFeature.js";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiY29rYXZuMTEiLCJhIjoiY2xuenJ6Nm02MHZvajJpcGVreXpmZm8wNCJ9.a3zQ4KrnD9YRRco8l4o-Pg";
const reverseGeoCodingApiKey = "WLHjLJexBZyyYwUy1PpSIrR4BTmXb5Dd048PM9oa50I";
const mapboxVersion = "v2.9.1";
const mapboxScript = document.createElement("script");
mapboxScript.setAttribute(
  "src",
  `https://api.mapbox.com/mapbox-gl-js/${mapboxVersion}/mapbox-gl.js`
);
document.head.appendChild(mapboxScript);

const COLORS = {
  yellow: "#C7BA30",
  red: "#FF3C3C",
  blue: "#3C77FF",
  orange: "#FFA03C",
};

function generateSpotHTML(spot) {
  return `<div class="card">
            <img src="${spot.images[0]}" class="card-img-top img-fluid" alt="...">
            <div class="card-body">
              <h6 class="card-title fw-bold">${spot.locationName}</h6>
              <p class="card-text">${spot.locationTypeName}</p>
              <p class="card-text">${spot.address}</p>
              <p class="card-text fw-bold fst-italic text-uppercase">${spot.planned}</p>
              <div class="btn btn-primary btn-sm" data-bs-spot-id ="${spot.locationID}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSpotDetail" aria-controls="offcanvasSpotDetail">Xem chi tiết</div>
            </div>
          </div>`;
}

async function generateReportHTML(report, lat, lng) {
  const res = await getFreeSpot(lat, lng);
  const place = res.items.find((item) => item.resultType == "place");
  let address = place.address.label.split(", ").splice(1).join(", ");
  address = address.replace(", Hồ Chí Minh, Việt Nam", "");

  let reportHTML = "";
  if (report.length > 1) {
    const innnerHTML = report.map((report) => {
      return `
              <div class="d-flex justify-content-between align-items-center">
              <p class="card-text">${report.reportID}: <span class="fw-bold">${report.status == 0 ? "Chưa xử lý" : "Đã xử lý"}</span></p>
              <a href="report-detail.html?id=${report.reportID}" class="btn btn-sm text-primary">
                <i class="fas fa-info-circle"></i>
              </a>
              </div>`;
    }).join("");
    reportHTML = `<div class="card mb-2">
                    <div class="card-body bg-info text-info-emphasis bg-opacity-25">
                    <h6 class="card-title fw-bold">Danh sách báo cáo</h6>
                      ${innnerHTML}
                    </div>
                  </div>`
  } else if (report.length === 1) {
    console.log(report);
    let report1 = report[0];
    reportHTML = `<div class="card mb-2">
                    <div class="card-body bg-info text-info-emphasis bg-opacity-25">
                      <h6 class="card-title fw-bold">${report1.reportID}</h6>
                      <p class="card-text">${report1.reporterName}</p>
                      <p class="card-text"><span class="fw-bold">Tình trạng:</span> ${report1.status == 0 ? "Chưa xử lý" : "Đã xử lý"}</p>
                      <a href="report-detail.html?id=${report1.reportID}" class="btn btn-primary btn-sm">
                        Xem chi tiết
                      </a>
                    </div>
                  </div>`
  }

  return `${reportHTML}
          <div class="card">
            <div class="card-body bg-success text-success-emphasis bg-opacity-25 d-flex flex-column">
              <h6 class="card-title fw-bold"><i class="bi bi-geo-alt"></i> Thông tin địa điểm</h6>
              <p class="card-text fw-bold" style="font-size: 1.125rem;">${place.title}</p>
              <p class="card-text fw-light" style="font-size: 15px;">${address}</p>
              
              <a href="report-create.html?id=AD${lng}:${lat}" class="btn btn-outline-danger btn-sm align-self-end">
                <i class="fas fa-exclamation-triangle"></i>
                Báo cáo vi phạm
              </a>
            </div>
          </div>`;
}


let reportIDs = localStorage.getItem("reportIDs");
reportIDs = reportIDs ? reportIDs.split(",") : [];
console.log(reportIDs)
async function getSpotsData() {
  try {
    // const spots = await request.getAllSpots();
    // let reports = await request.getReportList(reportIDs);

    let [spots, reports] = await Promise.all([
      request.getAllSpots(),
      request.getReportList(reportIDs),
    ]);
    console.log(spots);

    reports = reports.filter((report) => report.objectID.startsWith("AD"));
    reports = reports.map((report) => {
      const [lng, lat] = report.objectID.substring(2).split(":");
      return {
        ...report,
        lng: parseFloat(lng),
        lat: parseFloat(lat),
      };
    });
    console.log(reports)
    const mergedReports = [];
    reports.forEach((report) => {
      const index = mergedReports.findIndex((mergedReport) => {
        return mergedReport.objectID === report.objectID;
      });

      if (index !== -1) {
        mergedReports[index].reports.push({
          reportID: report.reportID,
          reporterName: report.reporterName,
          sendTime: report.sendTime,
          status: report.status,
        });
      } else {
        mergedReports.push({
          objectID: report.objectID,
          lng: report.lng,
          lat: report.lat,
          reports: [{
            reportID: report.reportID,
            reporterName: report.reporterName,
            sendTime: report.sendTime,
            status: report.status,
          }]
        });
      }
    });
    console.log(mergedReports);

    const spotsGeojson = {
      type: "FeatureCollection",
      features: [],
    };

    Object.values(spots).forEach((spot) => {
      spotsGeojson.features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [spot.longitude, spot.latitude],
        },
        properties: {
          ...spot,
          userReport: reportIDs.some((reportIDs) => {
            const flattenReportIDs = spot.reportIDs.flat(Infinity);
            return flattenReportIDs.includes(reportIDs);
          }),
          description: generateSpotHTML(spot),
        },
      });
    });

    mergedReports.forEach(async (report) => {
      spotsGeojson.features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [report.lng, report.lat],
        },
        properties: {
          ...report,
          userReport: true,
          description: await generateReportHTML(report.reports, report.lat, report.lng),
        },
      });
    });

    console.log(spotsGeojson);

    return spotsGeojson;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get spots data");
  }
}

function createMap() {
  mapboxgl.accessToken = MAPBOX_TOKEN;
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12", // stylesheet location
    center: [106.695249, 10.777009],
    zoom: 12,
    hash: true,
    locale: "vi-VN",
    language: "vi-VN",
  });
  map.dragRotate.disable();
  map.touchZoomRotate.disableRotation();

  const geolocation = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
    showAccuracyCircle: true,
    showUserLocation: true,
  });
  map.addControl(geolocation, "bottom-right");
  map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
  map.addControl(new mapboxgl.FullscreenControl(), "bottom-right");
  // map.addControl(new MapboxGeocoder({
  //   accessToken: mapboxgl.accessToken,
  //   mapboxgl: mapboxgl,
  //   marker: false,
  //   placeholder: 'Tìm kiếm địa điểm',
  //   language: 'vi-VN',
  //   countries: 'vn',
  // }), 'top-left');

  return map;
}

const getFreeSpot = async (lat, lng) => {
  const api = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${lng}&apiKey=${reverseGeoCodingApiKey}&lang=vi&limit=5`;
  // fetch(api)
  //   .then((res) => res.json())
  //   .then((res) => {
  //     return res;
  //   });
  try {
    const res = await fetch(api);
    return await res.json();
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get free spot");
  }
}

async function addSpotLayer(map, marker, spotsGeojson) {
  map.addSource("spots", {
    type: "geojson",
    data: spotsGeojson,
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
    clusterProperties: {
      hasReport: ["any", ["get", "hasReport"]],
      planned: ["any", ["==", ["get", "planned"], "Đã quy hoạch"]],
      userReport: ["any", ["get", "userReport"]],
    },
  });

  map.addLayer({
    id: "cluster-spots",
    type: "circle",
    source: "spots",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": [
        "case",
        ["==", ["get", "userReport"], true],
        COLORS.orange,
        ["==", ["get", "hasReport"], true],
        COLORS.red,
        ["==", ["get", "planned"], false],
        COLORS.yellow,
        COLORS.blue,
      ],
      "circle-radius": ["step", ["get", "point_count"], 20, 5, 30, 7, 40],
    },
  });

  map.addLayer({
    id: "cluster-count-spots",
    type: "symbol",
    source: "spots",
    filter: ["has", "point_count"],
    layout: {
      "text-field": ["get", "point_count_abbreviated"],
      "text-font": ["Montserrat SemiBold", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
  });

  map.addLayer({
    id: "unclustered-point-spots",
    type: "circle",
    source: "spots",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": [
        "case",
        ["==", ["get", "userReport"], true],
        COLORS.orange,
        ["==", ["get", "hasReport"], true],
        COLORS.red,
        ["==", ["get", "hasAds"], true],
        COLORS.blue,
        ["==", ["get", "planned"], "Chưa quy hoạch"],
        COLORS.yellow,
        COLORS.blue,
      ],
      "circle-radius": 12,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff",
    },
  });

  map.addLayer({
    id: "unclustered-point-label-spots",
    type: "symbol",
    source: "spots",
    filter: [
      "all",
      ["!", ["has", "point_count"]],
      ["==", ["get", "hasAds"], true],
    ],
    layout: {
      "text-field": "QC",
      "text-font": ["Montserrat SemiBold", "Arial Unicode MS Bold"],
      "text-size": 8,
    },
    paint: {
      "text-color": "white",
    },
  });

  map.on("click", "cluster-spots", function (e) {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["cluster-spots"],
    });
    const clusterId = features[0].properties.cluster_id;
    map
      .getSource("spots")
      .getClusterExpansionZoom(clusterId, function (err, zoom) {
        if (err) return;

        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom,
        });
      });
  });

  map.on("click", "unclustered-point-spots", function (e) {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.description;
    const objectID = e.features[0].properties.objectID || null;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    // if (objectID) {
    //   getFreeSpot(map, coordinates[1], coordinates[0], marker);
    // } else {
    // }
    new mapboxgl.Popup().setLngLat(coordinates).setHTML(description).addTo(map);

    map.flyTo({
      center: e.features[0].geometry.coordinates,
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      zoom: 16,
    });
  });

  map.on("mouseenter", "unclustered-point-spots", function () {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "unclustered-point-spots", function () {
    map.getCanvas().style.cursor = "";
  });

  map.on("mouseenter", "cluster-spots", function () {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "cluster-spots", function () {
    map.getCanvas().style.cursor = "";
  });
  map.on("dragstart", () => {
    map.getCanvas().style.cursor = "move";
  });
  map.on("dragend", () => {
    map.getCanvas().style.cursor = "";
  });
}
const closeBtn = document.getElementById("close-search-btn");
const searchInput = document.getElementById("search-input");
const resultBox = document.querySelector(".result-box");
let lastSearch = "";
searchInput.addEventListener("keyup", (e) => {
  let searchValue = searchInput.value;
  searchValue = searchValue.trim();
  if (searchValue === "" || searchValue === lastSearch) {
    return;
  }
  const autoCompleteApi = `https://revgeocode.search.hereapi.com/v1/autocomplete?q=${searchValue}&apiKey=${reverseGeoCodingApiKey}&lang=vi&in=countryCode:VNM&limit=5`;

  lastSearch = searchValue;

  // fetch after 500ms
  setTimeout(() => {
    if (searchValue === lastSearch) {
      fetch(autoCompleteApi)
        .then((res) => res.json())
        .then((res) => {
          if (res && res.items && res.items.length > 0) {
            const result = res.items.map((item) => {
              return {
                title: item.title,
                label: item.address.label,
              };
            });
            displaySearchResult(result);
          }
        });
    }
  }, 500);
});
const displaySearchResult = (result) => {
  const content = result.map((item) => {
    return `
    <a  href="#"
        class="list-group-item list-group-item-action border-0 rounded-0 list-search-item"
        data-bs-title="${item.title}" 
        data-bs-label="${item.label}"
        style="cursor: pointer; display: inline-block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 23.5rem; font-size:0.875rem; line-height: 1.25rem">${item.label}    
    </a>`;
  });
  resultBox.innerHTML = `<div class="list-group">${content.join("")}</div>`;
};

mapboxScript.onload = async function () {
  const map = createMap();
  const spotsGeojson = await getSpotsData();
  const marker = new mapboxgl.Marker({
    color: "#F84C4C",
  });
  let filteredSpotsGeojson = spotsGeojson;
  map.on("load", async () => {
    await addSpotLayer(map, marker, filteredSpotsGeojson);
    applyFilter();
  });

  const toggles = document.querySelectorAll(
    '#toggle-container input[type="checkbox"]'
  );
  const filterOptions = {
    report: false,
    planned: false,
    ads: false,
    all: true,
  };

  const applyFilter = () => {
    filteredSpotsGeojson = {
      type: "FeatureCollection",
      features: spotsGeojson.features.filter((spot) => {
        if (filterOptions["all"]) {
          return true;
        }
        if (!filterOptions["report"] && spot.properties.hasReport) {
          return false;
        }
        if (
          !filterOptions["planned"] &&
          spot.properties.planned === "Đã quy hoạch"
        ) {
          return false;
        } else if (
          filterOptions["planned"] &&
          spot.properties.planned === "Chưa quy hoạch"
        ) {
          return false;
        }
        if (!filterOptions["ads"] && spot.properties.hasAds) {
          return false;
        }
        return true;
      }),
    };
    // console.log("filtered");
    map.getSource("spots").setData(filteredSpotsGeojson);
  };

  toggles.forEach((toggle) => {
    // set default value
    toggle.checked = filterOptions[toggle.id.split("-")[0]];

    toggle.addEventListener("change", async (e) => {
      // console.log(e.target.id);
      const key = e.target.id.split("-")[0];

      if (key === "all" && e.target.checked) {
        toggles.forEach((toggle) => {
          toggle.checked = false;
          filterOptions[toggle.id.split("-")[0]] = false;
        });
        toggle.checked = true;
      } else if (key !== "all") {
        // uncheck the all toggle
        toggles[toggles.length - 1].checked = false;
        filterOptions["all"] = false;
      }

      filterOptions[key] = e.target.checked;
      // console.log(filterOptions);

      applyFilter();
    });
  });

  


  // Hien thong tin diem bat ki
  map.on("click", async (e) => {
    if (map.getCanvas().style.cursor === "pointer") {
      return;
    }

    try {
      const res = await getFreeSpot(e.lngLat.lat, e.lngLat.lng);
      const place = res.items.find((item) => item.resultType == "place");
      // console.log(place);
      let address = place.address.label.split(", ").splice(1).join(", ");
      address = address.replace(", Hồ Chí Minh, Việt Nam", "");
      const innerHtmlContent = `<h6 class="fw-bolder"><i class="bi bi-geo-alt"></i> Thông tin địa điểm</h6>
                                <p class="fw-bold" style="font-size: 1.125rem;">${place.title}</p>
                                <p class="fw-light" style="font-size: 15px;">${address}</p>
                                <a href="report-create.html?id=AD${place.position.lng}:${place.position.lat}" class="btn btn-outline-danger align-self-end">
                                <i class="fas fa-exclamation-triangle"></i>
                                Báo cáo vi phạm
                                </a>`;
      const divElement = document.createElement("div");

      divElement.innerHTML = innerHtmlContent;
      divElement.setAttribute(
        "class",
        "px-4 py-3 rounded-2 bg-success text-success-emphasis bg-opacity-25 d-flex flex-column"
      );

      new mapboxgl.Popup({ offset: [0, -30] })
        .setLngLat({ lng: place.position.lng, lat: place.position.lat })
        .setDOMContent(divElement)
        .addTo(map);

      if (marker) marker.setLngLat(place.position).addTo(map);
    } catch (error) {
      console.log(error);
    }
  });

  resultBox.addEventListener("click", (e) => {
    const listSearchItem = e.target.closest(".list-search-item");
    if (!listSearchItem) return;
    const label = listSearchItem.dataset.bsLabel;
    const api = `https://revgeocode.search.hereapi.com/v1/geocode?q=${label}&apiKey=${reverseGeoCodingApiKey}&lang=vi&in=countryCode:VNM&limit=1`;

    fetch(api)
      .then((res) => res.json())
      .then((res) => {
        if (res && res.items && res.items.length > 0) {
          map.flyTo({
            center: [res.items[0].position.lng, res.items[0].position.lat],
            essential: true, // this animation is considered essential with respect to prefers-reduced-motion
            zoom: 16,
          });
        }
      });
  });

  closeBtn.addEventListener("click", () => {
    searchInput.value = "";
    resultBox.innerHTML = "";
  });
};
