/* eslint-disable no-undef */
MAPBOX_TOKEN = 'pk.eyJ1IjoibGVvbmFyZGh1eW5oIiwiYSI6ImNscDNxdzNmZzB6dG0ya3M1MGt2MTVreHEifQ.WiaFF1ZoklZy7vMDLcPJ5g';

const mapboxVersion = 'v2.9.1';
const mapboxScript = document.createElement('script');
mapboxScript.setAttribute('src', `https://api.mapbox.com/mapbox-gl-js/${mapboxVersion}/mapbox-gl.js`);
document.head.appendChild(mapboxScript);

const COLORS = {
  yellow: '#C7BA30',
  red: '#FF3C3C',
  blue: '#3C77FF'
};

// const userData = document.getElementById('user-data').innerText;

function generateSpotHTML(spot) {
  // console.log(spot.spotID);
  return `<div class="card">
            <img src="${spot.spotImage[0]}" class="card-img-top img-fluid" alt="...">
            <div class="card-body">
              <h6 class="card-title fw-bold">${spot.spotName}</h6>
              <p class="card-text">${spot.spotTypeName}</p>
              <p class="card-text">${spot.address}</p>
              <p class="card-text fw-bold fst-italic text-uppercase">${spot.planned}</p>
              <div class="btn btn-primary btn-sm mt-2" data-bs-spot-id ="${spot.spotID}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSpotDetail" aria-controls="offcanvasSpotDetail">Xem chi tiết</div>
              <a href="/so/ads/new?category=board&spotID=${spot.spotID}"><button class="p-2 btn btn-success btn-simple text-white mt-2" style="font-size: 13px">Thêm bảng quảng cáo</button></a>
            </div>
          </div>`;
}

async function getSpotsData() {
  try {
    // const districtID = userData.split(',')[0];
    // const wardID = userData.split(',')[1];
    // rewrite the data in backend
    const spots1 = await fetch(`http://localhost:3000/api/location`, {
        method: 'GET',
        headers: new Headers(),
        mode: 'cors'
    }).then((res) => res.json());
    const spotsGeojson = {
      type: 'FeatureCollection',
      features: []
    };
    const spots = spots1.locations;
    console.log(spots);
    Object.values(spots).forEach((spot) => {
      spotsGeojson.features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [spot.longitude, spot.latitude]
        },
        properties: {
          ...spot,
        //   description: generateSpotHTML(spot)
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
  map.addControl(
    new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
      placeholder: 'Tìm kiếm địa điểm',
      language: 'vi-VN',
      countries: 'vn'
    }),
    'top-left'
  );

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

    const api = `https://api.mapbox.com/geocoding/v5/mapbox.places/${e.lngLat.lng},${e.lngLat.lat}.json?access_token=${MAPBOX_TOKEN}`;

    fetch(api)
      .then((res) => res.json())
      .then((res) => {
        console.log(res.features);
        const coordinates = res.features[0].geometry.coordinates.slice();
        let description = res.features[0].place_name
          .replace(/,\s*\d+,\s*Vietnam/, '')
          .replace(/, Ho Chi Minh City|, Quận|, Phường|, Q|, F|, P.*/g, '')
          .replace(/,.*Dist\.|,.*Ward\./, '');

        description += (', ' + res.features[0].context[0].text || '') + (', ' + res.features[0].context[2].text || '');

        const innerHtmlContent = `<div style="font-weight: bold; font-size: 15px">${description}</div>`;
        const divElement = document.createElement('div');

        divElement.innerHTML = innerHtmlContent;

          const assignBtn = document.createElement('div');

          // fix this links
          assignBtn.innerHTML = `<a href="/department/advertisements/new?category=spot&lng=${e.lngLat.lng}&lat=${e.lngLat.lat}"><button class="p-2 btn btn-success btn-simple text-white mt-2" style="font-size: 13px">Thêm điểm đặt mới</button></a>`;
          divElement.appendChild(assignBtn);
          divElement.setAttribute('class', 'p-2');

        new mapboxgl.Popup({ offset: [0, -30] }).setLngLat(coordinates).setDOMContent(divElement).addTo(map);
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
