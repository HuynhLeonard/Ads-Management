const MAPBOX_TOKEN = 'pk.eyJ1IjoibGVvbmFyZGh1eW5oIiwiYSI6ImNscDNxdzNmZzB6dG0ya3M1MGt2MTVreHEifQ.WiaFF1ZoklZy7vMDLcPJ5g'

const dropArea = document.querySelector(".drag-area");
const dragText = dropArea.querySelector(".dragText");
const button = dropArea.querySelector("button");
const input = dropArea.querySelector("input");

const address = document.querySelector('#address-field');
const district = document.querySelector('#district-field');
const ward = document.querySelector('#ward-field');
const urlParams = new URLSearchParams(window.location.search);

console.log(urlParams.get('lng') + " " + urlParams.get('lat'));

if(urlParams.get('lng') !== undefined && urlParams.get('lat') !== undefined){
  const api = `https://api.mapbox.com/geocoding/v5/mapbox.places/${urlParams.get('lng')},${urlParams.get('lat')}.json?access_token=${MAPBOX_TOKEN}`

  const long = document.querySelector('#long-field');
  const lat = document.querySelector('#lat-field');

  long.value = urlParams.get('lng');
  lat.value = urlParams.get('lat');

  fetch(api)
      .then((res) => res.json())
      .then((res) => {
        let description = res.features[0].place_name
        .replace(/,\s*\d+,\s*Vietnam/, '')
        .replace(/, Ho Chi Minh City|, Quận|, Phường|, Q|, F|, P|, District|, Ward.*/g, '')
        .replace(/,.*Dist\.|,.*Ward\./, '');

        address.value = description || ' '
        district.value = res.features[0].context[2].text.replace('Quận ', '').trim() || ' '
        ward.value = res.features[0].context[0].text.replace('Phường ', '').trim() || ' '
        if (dist.value.length === 1) {
          dist.value = '0' + dist.value
        }
      })  
}

let isExisted = false;

button.addEventListener("click", () => {
  input.click();
});

input.addEventListener("change", (e) => {
  const files = e.target.files;
  showFile(files);
});

function showFile(files) {
  let imageDiv = document.createElement("div");
  let check = true;
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let fileType = file.type;
    let validExtensions = ["image/jpeg", "image/png", "image/jpg"];
    if (validExtensions.includes(fileType)) {
      let fileReader = new FileReader();
      fileReader.onload = () => {
        let fileUrl = fileReader.result;
        let imgTag = document.createElement("img");
        imgTag.src = fileUrl;
        imgTag.style.width = "100%";
        imgTag.style.marginTop = "10px";
        imgTag.style.marginBottom = "10px";
        imageDiv.appendChild(imgTag);
      };
      fileReader.readAsDataURL(file);
    } else {
      alert("Đây không phải là một file ảnh");
      dragText.textContent = "Kéo và thả để tải hình ảnh lên";
      check = false;
      break;
    }
  }
  if (check) {
    isExisted = true;
    dropArea.innerHTML = "";
    dropArea.appendChild(imageDiv);
  }
}

dropArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  dragText.textContent = "Thả để tải ảnh lên";
});

dropArea.addEventListener("dragleave", (event) => {
  event.preventDefault();
  dragText.textContent = "Kéo và thả để tải hình ảnh lên";
});

dropArea.addEventListener("drop", (event) => {
  event.preventDefault();
  dragText.textContent = "Kéo và thả để tải hình ảnh lên";
  const file = event.dataTransfer.files[0];
  if (!isExisted) {
    dropArea.innerHTML = "";
    let fileType = file.type;
    let validExtensions = ["image/jpeg", "image/png", "image/jpg"];
    if (validExtensions.includes(fileType)) {
      let fileReader = new FileReader();
      fileReader.onload = () => {
        let fileUrl = fileReader.result;
        let imgTag = document.createElement("img");
        imgTag.src = fileUrl;
        imgTag.style.width = "100%";
        imgTag.style.marginTop = "10px";
        imgTag.style.marginBottom = "10px";
        dropArea.appendChild(imgTag);
      };
      fileReader.readAsDataURL(file);
      isExisted = true;
    } else {
      alert("Đây không phải là một file ảnh");
      dragText.textContent = "Kéo và thả để tải hình ảnh lên";
    }
  } else {
    let fileType = file.type;
    let validExtensions = ["image/jpeg", "image/png", "image/jpg"];
    if (validExtensions.includes(fileType)) {
      let fileReader = new FileReader();
      fileReader.onload = () => {
        let fileUrl = fileReader.result;
        let imgTag = document.createElement("img");
        imgTag.src = fileUrl;
        imgTag.style.width = "100%";
        imgTag.style.marginTop = "10px";
        imgTag.style.marginBottom = "10px";
        dropArea.appendChild(imgTag);
      };
      fileReader.readAsDataURL(file);
    } else {
      alert("Đây không phải là một file ảnh");
      dragText.textContent = "Kéo và thả để tải hình ảnh lên";
    }
  }
});
