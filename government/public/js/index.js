MAPBOX_TOKEN = 'pk.eyJ1IjoibGVvbmFyZGh1eW5oIiwiYSI6ImNscDNxdzNmZzB6dG0ya3M1MGt2MTVreHEifQ.WiaFF1ZoklZy7vMDLcPJ5g';


let position = [
	{
		// feature for Mapbox DC
		'type': 'Feature',
		'geometry': {
			'type': 'Point',
			'coordinates': [106.713928, 10.7988461]
		},
		'properties': {
			'title': 'Nhà Bé Lộc'
		}
	},
	{
		'type': 'Feature',
		'properties': {
			'title': 'Nhà Tuấn',
			'description': 'Nhà Tuấn'
		},
		'geometry': {
			'coordinates': [106.68489308846559,10.766791550493586],
			'type': 'Point'
		}
	},
	{
		'type': 'Feature',
		'properties': {
			'title': 'Chung cư The Avila',
			'description': 'Nhà Hữu'
		},
		'geometry': {
			'coordinates': [106.62004188895668, 10.721123602413908],
			'type': 'Point'
		}
	},
	{
		'type': 'Feature',
		'properties': {
			'title': 'Đại học Khoa Học Tự Nhiên CS1',
			'description': 'Đại học Khoa Học Tự Nhiên CS1'
		},
		'geometry': {
			'coordinates': [106.68243903161627,10.762562194949156],
			'type': 'Point'
		}
	},
	{
		'type': 'Feature',
		'properties': {
			'title': 'Đại học Khoa Học Tự Nhiên CS2',
			'description': 'Đại học Khoa Học Tự Nhiên CS2'
		},
		'geometry': {
			'coordinates': [106.79915234433335,10.875831061385941],
			'type': 'Point'
		}
	},
	{
		'type': 'Feature',
		'properties': {
			'title': 'Teky Quận 3',
			'description': 'Teky Center 2 - 19 Cao Thắng'
		},
		'geometry': {
			'coordinates': [106.68293953464702, 10.768996544805725],
			'type': 'Point'
		}
	},
	{
		'type': 'Feature',
		'properties': {
			'title': 'Teky Quận 7',
			'description': 'Teky Center 5 - Nguyễn Thị Thập'
		},
		'geometry': {
			'coordinates': [106.69686421400532, 10.740869087367834],
			'type': 'Point'
		}
	}
];

let locations = [];

// ============================================================================================
// fetch API
const handleAddAdsPanel = (ad) => {
	const formModel = {
		'type': 'Feature',
		'properties': {
			// model ads
			'title': "",
			// model ads
			'description': ad.address
		},
		'geometry': {
			// model ads
			'coordinates': [ad.longitude, ad.latitude],
			'type': 'Point'
		}
	}

	locations.push(formModel);
	console.log(locations);
}

const getLocationData = async () => {
	const response = await fetch("http://localhost:3000/api/location/");
	const locations = await response.json();
	console.log(locations);
	locations.locations.map((location) => {
		handleAddAdsPanel(location);
	})
}

getLocationData();


// ==============================================================================================

var mapboxScript = document.createElement('script');
mapboxScript.setAttribute('src', 'https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.js');
document.head.appendChild(mapboxScript);
function addAdvertisementSource(map) {
	map.loadImage(
			'assets/blue_elip.png',
			(error, image) => {
				if (error) throw error;
				map.addImage('quang-cao', image);
				// Add a GeoJSON source with 2 points
				map.addSource('diem-dat', {
					'type': 'geojson',
					'data': {
						'type': 'FeatureCollection',
						'features': locations
					},
					'cluster': true,
					'clusterMaxZoom': 16,
					'clusterRadius': 60
				});

				map.addLayer({
					'id': 'count-quang-cao',
					'type': 'circle',
					'filter': ['has', 'point_count'],
					'source': 'diem-dat',
					paint: {
						// Use step expressions (https://docs.mapbox.com/style-spec/reference/expressions/#step)
						// with three steps to implement three types of circles:
						//   * Blue, 20px circles when point count is less than 100
						//   * Yellow, 30px circles when point count is between 100 and 750
						//   * Pink, 40px circles when point count is greater than or equal to 750
						'circle-color': [
							'step',
							['get', 'point_count'],
							'#51bbd6',
							5,
							'#f1f075',
							10,
							'#f28cb1'
						],
						'circle-radius': [
							'step',
							['get', 'point_count'],
							20,
							2,
							25,
							5,
							35,
							7,
							40
						]
					}
				});

				map.addLayer({
					id: 'cluster-count',
					type: 'symbol',
					source: 'diem-dat',
					filter: ['has', 'point_count'],
					layout: {
					'text-field': ['get', 'point_count_abbreviated'],
					'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
					'text-size': 12
					}
				});

				// Add a symbol layer
				map.addLayer({
					'id': 'quang-cao',
					'type': 'symbol',
					'source': 'diem-dat',
					'filter': ['!',['has', 'point_count']],
					'layout': {
						'icon-image': 'quang-cao',
						'icon-size': 0.5,
						// get the title name from the source's "title" property
						'text-field': ['get', 'title'],
						'text-font': [
							'Montserrat SemiBold',
							'Arial Unicode MS Bold'
						],
						// 'text-offset': [0, 1.25],
						'text-anchor': 'top',
						'icon-anchor': 'bottom'
					}
				});
			}
	);
	// change the coordinate must change the zoom
	map.on('click', 'quang-cao', function (e) {
		map.flyTo({
			center: [e.features[0].geometry.coordinates[0] + 0.005, e.features[0].geometry.coordinates[1]],
			essential: true, // this animation is considered essential with respect to prefers-reduced-motion
			zoom:16
		});
		// toggle #offcanvas element
		var offcanvas = document.getElementById('offcanvasRight');
		var bsOffcanvas = new bootstrap.Offcanvas(offcanvas);
		bsOffcanvas.toggle();
		const feature = e.feature[0];
	});
		

	// const popup = new mapboxgl.Popup()
	map.on('mouseenter', 'quang-cao', function () {
		map.getCanvas().style.cursor = 'pointer';
	});

	map.on('mouseleave', 'quang-cao', function () {
		map.getCanvas().style.cursor = '';
	});

}

function addReportSource(map) {
	map.loadImage(
			'assets/red_elip.png',
			(error, image) => {
				if (error) throw error;
				map.addImage('bao-cao', image);
				map.addSource('diem-bao-cao', {
					type: 'geojson',
					data: {
						'type': 'FeatureCollection',
						'features': [
							{
								// feature for Mapbox SF
								'type': 'Feature',
								'geometry': {
									'type': 'Point',
									'coordinates': [106.694863, 10.783003]
								},
								'properties': {
									'title': 'Điểm Báo Cáo'
								}
							},
						]
					}
				});

				// Add a symbol layer
				map.addLayer({
					'id': 'bao-cao',
					'type': 'symbol',
					'source': 'diem-bao-cao',
					'layout': {
						'icon-image': 'bao-cao',
						'icon-size': 0.5,
						// get the title name from the source's "title" property
						'text-field': ['get', 'title'],
						'text-font': [
							'Montserrat SemiBold',
							'Arial Unicode MS Bold'
						],
						// 'text-offset': [0, 1.25],
						'text-anchor': 'top',
						'icon-anchor': 'bottom'
					}
				});
			}
	);
	
	// change the coordinate must change the zoom
	map.on('click', 'bao-cao', function (e) {
		map.flyTo({
			center: [e.features[0].geometry.coordinates[0] + 0.02, e.features[0].geometry.coordinates[1]],
			essential: true, // this animation is considered essential with respect to prefers-reduced-motion
			zoom:14
		});

		// toggle #offcanvas element
		// var offcanvas = document.getElementById('offcanvasRight');
		// var bsOffcanvas = new bootstrap.Offcanvas(offcanvas);
		// bsOffcanvas.toggle();
	});

	map.on('mouseenter', 'bao-cao', function () {
		map.getCanvas().style.cursor = 'pointer';
	});

	map.on('mouseleave', 'bao-cao', function () {
		map.getCanvas().style.cursor = '';
	});
}

function addSource(map) {
	addAdvertisementSource(map);
	addReportSource(map);
}

function attachToggle(toggleId, layerId, map) {
	if (!map.getLayer(layerId)) {
		throw new Error(`Layer ${layerId} does not exist on map.`);
	}
	const toggle = document.getElementById(toggleId);

	if (toggle == null) {
		throw new Error(`Toggle ${toggleId} does not exist.`);
	}

	toggle.addEventListener('click', () => {
		const clickedLayer = layerId;
		if (toggle.checked == true) {
			console.log(`Hiện ${clickedLayer}`);
			map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
		} else {
			console.log(`Ẩn ${clickedLayer}`);
			map.setLayoutProperty(clickedLayer, 'visibility', 'none');
		}
	});
}

mapboxScript.onload = function () {
	mapboxgl.accessToken = MAPBOX_TOKEN;

	const map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/streets-v12',
		center: [106.68243903161627,10.762562194949156],
		zoom: 12,
		hash: true,
		locale: 'vi-VN',
		language: 'vi-VN',
		cooperativeGestures: true,
	});

    // ấn control để điều khiển
	// map.dragRotate.disable();
	// map.touchZoomRotate.disableRotation();

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


	const geocoder = new MapboxGeocoder({
		accessToken: mapboxgl.accessToken,
		mapboxgl: mapboxgl,
		countries: 'vn',
		language: 'vi-VN',
		localIdeographFontFamily: '\'Montserrat\', \'sans-serif\'',
	});
	map.addControl(
			geocoder,
			'top-left'
	);

	// Wait until the map has finished loading.
	map.on('load', () => {
		addSource(map);
	});
	// After the last frame rendered before the map enters an "idle" state.
	map.on('idle', () => {
		// If these two layers were not added to the map, abort
		if (!map.getLayer('bao-cao') || !map.getLayer('quang-cao')) {
			return;
		}

		attachToggle('bao-cao', 'bao-cao', map);
		attachToggle('quang-cao', 'quang-cao', map);
	});
	
	map.on('style.load', function(e) {
		map.on('click', function(e) {
			var coor = e.lngLat;
			new mapboxgl.Popup()
				.setLngLat(coor)
				.setHTML(coor)
				.addTo(map)
		})
	});
}

