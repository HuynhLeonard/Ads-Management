/* eslint-disable no-undef */
MAPBOX_TOKEN = 'pk.eyJ1IjoibGVvbmFyZGh1eW5oIiwiYSI6ImNscDNxdzNmZzB6dG0ya3M1MGt2MTVreHEifQ.WiaFF1ZoklZy7vMDLcPJ5g';
const reverseGeoCodingApiKey = 'WLHjLJexBZyyYwUy1PpSIrR4BTmXb5Dd048PM9oa50I';

const mapboxVersion = 'v2.9.1';
const mapboxScript = document.createElement('script');
mapboxScript.setAttribute('src', `https://api.mapbox.com/mapbox-gl-js/${mapboxVersion}/mapbox-gl.js`);
document.head.appendChild(mapboxScript);

const COLORS = {
  yellow: '#C7BA30',
  red: '#FF3C3C',
  blue: '#3C77FF'
};

const userData = document.getElementById('user-data').innerText;

const formatMapFeature = (feature) => {
  const { properties, text } = feature
  let address = properties.address ? properties.address.split(',')[0] : feature.place_name.split(',')[0]
  const coordinates = feature.geometry.coordinates.slice()

  address = address.replace(/"/g, '')
  address += `, ${feature.context[0].text || ''}, ${feature.context[2].text || ''}, ${feature.context[3].text || ''}`
  if (address.includes(text)) {
    address = address.replace(`${text}, `, '')
  }

  return {
    text,
    address,
    coordinates
  }
}

function generateSpotHTML(spot) {
  // console.log(spot.spotID);
  let href = ``;
  if(position == -1) {
    return `<div class="card">
            <img src="${spot.images[0]}" class="card-img-top img-fluid" alt="...">
            <div class="card-body">
              <h6 class="card-title fw-bold">${spot.locationName}</h6>
              <p class="card-text">${spot.locationTypeName}</p>
              <p class="card-text">${spot.address}</p>
              <p class="card-text fw-bold fst-italic text-uppercase">${spot.planned}</p>
              <div class="btn btn-primary btn-sm mt-2" data-bs-spot-id ="${spot.locationID}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSpotDetail" aria-controls="offcanvasSpotDetail">Xem chi tiết</div>
            </div>
          </div>`;
  }
  if(position == 1) href = `/district/license/create?spotID=${spot.spotID}`
  if(position == 2) href = `/ward/license/create?spotID=${spot.spotID}`
  
  return `<div class="card">
            <img src="${spot.spotImage[0]}" class="card-img-top img-fluid" alt="...">
            <div class="card-body">
              <h6 class="card-title fw-bold">${spot.spotName}</h6>
              <p class="card-text">${spot.spotTypeName}</p>
              <p class="card-text">${spot.address}</p>
              <p class="card-text fw-bold fst-italic text-uppercase">${spot.planned}</p>
              <div class="btn btn-primary btn-sm mt-2" data-bs-spot-id ="${spot.spotID}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSpotDetail" aria-controls="offcanvasSpotDetail">Xem chi tiết</div>
              <button class="btn btn-success btn-sm text-white mt-2"><a href="${href}" style="text-decoration: none; color: #FFFFFF;">Thêm bảng quảng cáo</a></button>
            </div>
          </div>`;
}

async function getSpotsData() {
  try {
    // const districtID = userData.split(',')[0];
    // const wardID = userData.split(',')[1];
    // rewrite the data in backend
    const spots = await fetch(`http://localhost:3000/api/map/locations`, {
        method: 'GET',
        headers: new Headers(),
        mode: 'cors'
    }).then((res) => res.json());
    const spotsGeojson = {
      type: 'FeatureCollection',
      features: []
    };
    // const spots = spots1.locations

    // console.log(spots);
    Object.values(spots).forEach((spot) => {
      console.log(spot.longitude);
      spotsGeojson.features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [spot.longitude, spot.latitude]
        },
        properties: {
          ...spot,
          description: generateSpotHTML(spot)
        }
      });
    });

    return spotsGeojson;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get spots data');
  }
}

function createMap() {
  mapboxgl.accessToken = MAPBOX_TOKEN;
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12', // stylesheet location
    center: [106.695249, 10.777009],
    zoom: 12,
    hash: true,
    locale: 'vi-VN',
    language: 'vi-VN'
  });
  map.dragRotate.disable();
  map.touchZoomRotate.disableRotation();

  const geolocation = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true,
    showAccuracyCircle: true,
    showUserLocation: true
  });
  map.addControl(geolocation, 'bottom-right');
  map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
  map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');
  // map.addControl(
  //   new MapboxGeocoder({
  //     accessToken: mapboxgl.accessToken,
  //     mapboxgl: mapboxgl,
  //     marker: false,
  //     placeholder: 'Tìm kiếm địa điểm',
  //     language: 'vi-VN',
  //     countries: 'vn'
  //   }),
  //   'top-left'
  // );

  return map;
}

async function addSpotLayer(map, spotsGeojson) {
  map.addSource('spots', {
    type: 'geojson',
    data: spotsGeojson,
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
    clusterProperties: {
      hasReport: ['any', ['get', 'hasReport']],
      planned: ['any', ['==', ['get', 'planned'], 'Đã quy hoạch']]
    }
  });

  // convert circleColor to rgb
  // const rgbColor = hexToRgb(circleColor);

  map.addLayer({
    id: 'cluster-spots',
    type: 'circle',
    source: 'spots',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'case',
        ['==', ['get', 'hasReport'], true],
        COLORS.red,
        ['==', ['get', 'planned'], false],
        COLORS.yellow,
        COLORS.blue
      ],
      'circle-radius': ['step', ['get', 'point_count'], 20, 5, 30, 7, 40]
    }
  });

  map.addLayer({
    id: 'cluster-count-spots',
    type: 'symbol',
    source: 'spots',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': ['get', 'point_count_abbreviated'],
      'text-font': ['Montserrat SemiBold', 'Arial Unicode MS Bold'],
      'text-size': 12
    }
  });

  map.addLayer({
    id: 'unclustered-point-spots',
    type: 'circle',
    source: 'spots',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': [
        'case',
        ['==', ['get', 'hasReport'], true],
        COLORS.red,
        ['==', ['get', 'hasAds'], true],
        COLORS.blue,
        ['==', ['get', 'planned'], 'Chưa quy hoạch'],
        COLORS.yellow,
        COLORS.blue
      ],
      'circle-radius': 12,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  });

  map.addLayer({
    id: 'unclustered-point-label-spots',
    type: 'symbol',
    source: 'spots',
    filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'hasAds'], true]],
    layout: {
      'text-field': 'QC',
      'text-font': ['Montserrat SemiBold', 'Arial Unicode MS Bold'],
      'text-size': 8
    },
    paint: {
      'text-color': 'white'
    }
  });

  map.on('click', 'cluster-spots', function(e) {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['cluster-spots']
    });
    const clusterId = features[0].properties.cluster_id;
    map.getSource('spots').getClusterExpansionZoom(clusterId, function(err, zoom) {
      if (err) return;

      map.easeTo({
        center: features[0].geometry.coordinates,
        zoom: zoom
      });
    });
  });

  map.on('click', 'unclustered-point-spots', function(e) {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.description;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    new mapboxgl.Popup().setLngLat(coordinates).setHTML(description).addTo(map);

    map.flyTo({
      center: e.features[0].geometry.coordinates,
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      zoom: 16
    });
  });

  map.on('mouseenter', 'unclustered-point-spots', function() {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'unclustered-point-spots', function() {
    map.getCanvas().style.cursor = '';
  });

  map.on('mouseenter', 'cluster-spots', function() {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'cluster-spots', function() {
    map.getCanvas().style.cursor = '';
  });
}

const closeBtn = document.getElementById('close-search-btn');
const searchInput = document.getElementById('search-input');
const resultBox = document.querySelector('.result-box');
let lastSearch = '';
// searchInput.addEventListener('keyup', (e) => {
//   let searchValue = searchInput.value;
//   searchValue = searchValue.trim();
//   if (searchValue === '' || searchValue === lastSearch) {
//     return;
//   }
//   const api = `https://revgeocode.search.hereapi.com/v1/geocode?q=${searchValue}&apiKey=${reverseGeoCodingApiKey}&lang=vi&in=countryCode:VNM&limit=5`;

//   lastSearch = searchValue;

//     fetch(api)
//         .then((res) => res.json())
//         .then((res) => {
//             if (res && res.items && res.items.length > 0) {
//             const result = res.items.map((item) => {
//                 return {
//                 title: item.address.label,
//                 lat: item.position.lat,
//                 lng: item.position.lng,
//                 };
//             });
//             displaySearchResult(result);
//             }
//         });
// });

const displaySearchResult = (result) => {
  const content = result.map((item) => {
    return `
    <a  href='#'
        class='list-group-item list-group-item-action border-0 rounded-0 list-search-item'
        data-bs-lat='${item.lat}' 
        data-bs-lng='${item.lng}'
        data-bs-title='${item.title}'
        style='cursor: pointer; display: inline-block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 23.5rem; font-size:0.875rem; line-height: 1.25rem'>${item.title}    
    </a>`;
  });
  resultBox.innerHTML = `<div class='list-group'>${content.join('')}</div>`;
};

mapboxScript.onload = async function() {
  const map = createMap();
  const spotsGeojson = await getSpotsData();
  const marker = new mapboxgl.Marker({
    color: '#F84C4C'
  });
  let filteredSpotsGeojson = spotsGeojson;
  map.on('load', async () => {
    await addSpotLayer(map, filteredSpotsGeojson);
    applyFilter();
  });

  const toggles = document.querySelectorAll('#toggle-container input[type="checkbox"]');
  const filterOptions = {
    report: false,
    planned: false,
    ads: false,
    all: true
  };

  const applyFilter = () => {
    filteredSpotsGeojson = {
      type: 'FeatureCollection',
      features: spotsGeojson.features.filter((spot) => {
        if (filterOptions['all']) {
          return true;
        }
        if (!filterOptions['report'] && spot.properties.hasReport) {
          return false;
        }
        if (!filterOptions['planned'] && spot.properties.planned === 'Đã quy hoạch') {
          return false;
        } else if (filterOptions['planned'] && spot.properties.planned === 'Chưa quy hoạch') {
          return false;
        }
        if (!filterOptions['ads'] && spot.properties.hasAds) {
          return false;
        }
        return true;
      })
    };
    console.log('filtered');
    map.getSource('spots').setData(filteredSpotsGeojson);
  };
  console.log(filteredSpotsGeojson);
  toggles.forEach((toggle) => {
    // set default value
    toggle.checked = filterOptions[toggle.id.split('-')[0]];

    toggle.addEventListener('change', async (e) => {
      console.log(e.target.id);
      const key = e.target.id.split('-')[0];

      if (key === 'all' && e.target.checked) {
        toggles.forEach((toggle) => {
          toggle.checked = false;
          filterOptions[toggle.id.split('-')[0]] = false;
        });
        toggle.checked = true;
      } else if (key !== 'all') {
        // uncheck the all toggle
        toggles[toggles.length - 1].checked = false;
        filterOptions['all'] = false;
      }

      filterOptions[key] = e.target.checked;
      console.log(filterOptions);

      applyFilter();
    });
  });

  // Hien thong tin diem bat ki
  map.on('click', (e) => {
    if (map.getCanvas().style.cursor === 'pointer') {
      return;
    }
    marker.setLngLat(e.lngLat).addTo(map);

    const api = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${e.lngLat.lat},${e.lngLat.lng}&apiKey=${reverseGeoCodingApiKey}&lang=vi`;

    fetch(api)
      .then((res) => res.json())
      .then((res) => {
        let address = res.items[0].address.label;
        address = address.replace(', Hồ Chí Minh, Việt Nam', '');
        const innerHtmlContent = `<h6 class="fw-bolder"><i class="bi bi-geo-alt"></i> Thông tin địa điểm</h6>
                                  <p class="fw-light" style="font-size: 15px;">${address}</p>`;
        const divElement = document.createElement('div');
        
        divElement.innerHTML = innerHtmlContent;
        divElement.setAttribute('class', 'px-4 py-3 rounded-2 bg-success text-success-emphasis bg-opacity-25');
        
        if (window.location.pathname.startsWith('/so')) {
          const assignBtn = document.createElement('div');

          assignBtn.innerHTML = `<a href="/so/ads/new?category=spot&lng=${e.lngLat.lng}&lat=${e.lngLat.lat}"><button class="p-2 btn btn-success btn-simple text-white mt-2" style="font-size: 13px">Thêm điểm đặt mới</button></a>`;
          divElement.appendChild(assignBtn);
          divElement.setAttribute('class', 'p-2');
        }
        new mapboxgl.Popup({ offset: [0, -30] })
        .setLngLat({lng: e.lngLat.lng, lat: e.lngLat.lat})
        .setDOMContent(divElement)
        .addTo(map);
      });

  });

  // Change the cursor to grab when user drag the map
  map.on('dragstart', () => {
    map.getCanvas().style.cursor = 'move';
  });
  map.on('dragend', () => {
    map.getCanvas().style.cursor = '';
  });
};
