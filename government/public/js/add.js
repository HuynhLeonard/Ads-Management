const MAPBOX_TOKEN = 'pk.eyJ1IjoiY29rYXZuMTEiLCJhIjoiY2xuenJ6Nm02MHZvajJpcGVreXpmZm8wNCJ9.a3zQ4KrnD9YRRco8l4o-Pg'
function updateTitle(el) {
  const title = document.querySelector('#spotTitle')
  title.textContent = el.value
}

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

const addr = document.querySelector('#address-field')
const dist = document.querySelector('#district-field')
const ward = document.querySelector('#ward-field')
const queryParams = new URLSearchParams(window.location.search)
const reverseGeoCodingApiKey = 'iFRNmnpm9tPfPuSWFtpk3VDDI3xKUuNDxy0EHKjJlF4';

if (queryParams.get('lng') !== undefined && queryParams.get('lat') !== undefined) {
  const api = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${queryParams.get('lat')},${queryParams.get('lng')}&apiKey=${reverseGeoCodingApiKey}&lang=vi&limit=5`;

  const lng_field = document.querySelector('#long-field')
  const lat_field = document.querySelector('#lat-field')

  lng_field.value = queryParams.get('lng')
  lat_field.value = queryParams.get('lat')

  fetch(api)
    .then((res) => res.json())
    .then((res) => {
      let address = res.items[0].address.label;
      addr.value = address.split(',')[0] || ' '
      dist.value = res.items[0].address.city.replace('Quận ', '').trim() || ' '
      if (dist.value.length === 1) {
        dist.value = dist.value
      }
      ward.value = res.items[0].address.district.replace('Phường ', '').trim() || ' '
      if (ward.value.length === 1) {
        ward.value = ward.value
      }
    })
}

// upload image here
const dropArea = document.querySelector(".drag-area");
const dragText = dropArea.querySelector(".dragText");
const orText = dropArea.querySelector(".or");
const button = dropArea.querySelector("button");
const input = dropArea.querySelector("input");
let isExisted = false;
let numOfFile = 0;

let imageDiv = document.createElement("div");
imageDiv.classList.add("slider");

let navDiv = document.createElement("div");
navDiv.classList.add("slider-nav");

let imageWrapper = document.createElement("div");
imageWrapper.appendChild(imageDiv);
imageWrapper.classList.add("slider-wrapper");

imageWrapper.style.marginLeft = "10px";
imageWrapper.style.marginRight = "10px";
imageWrapper.style.marginBottom = "50px";

let navWrapper = document.createElement("div");
navWrapper.appendChild(navDiv);
navWrapper.classList.add("slider-nav");

let container = document.createElement("div");
container.appendChild(imageWrapper);
container.appendChild(navWrapper);
container.classList.add("image-section");

button.addEventListener("click", () => {
    input.click();
});

input.addEventListener("change", (e) => {
    const files = e.target.files;
    console.log(files);
    showFile(files);
});

function showFile(files) {
    let check = true;
    let imgLinks = [];
    for (let i = 0; i < files.length; i++) {
        // create object URL to use as src for img element
        imgLinks.push(URL.createObjectURL(files[i]))
    }
    console.log(imgLinks);
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let fileType = file.type;
        let validExtensions = ["image/jpeg", "image/png", "image/jpg"];
        if (validExtensions.includes(fileType)) {
            let fileReader = new FileReader();
            fileReader.onload = () => {
                let fileUrl = fileReader.result;
                let imgTag = document.createElement("img");
                let navTag = document.createElement("a");
                imgTag.src = fileUrl;
                imgTag.setAttribute("id", numOfFile);
                navTag.href = "#" + numOfFile;
                imageDiv.appendChild(imgTag);
                navWrapper.appendChild(navTag);
            };
            fileReader.readAsDataURL(file);
            numOfFile += 1;
        } else {
            alert("Đây không phải là một file ảnh");
            dragText.textContent = "Kéo và thả để tải hình ảnh lên";
            check = false;
            break;
        }
    }

    if (check) {
        if (!isExisted) {
            dropArea.innerHTML = "";
            dropArea.appendChild(container);
            dropArea.appendChild(dragText);
            dropArea.appendChild(orText);
            dropArea.appendChild(button);
            isExisted = true;
        } else {
            dropArea.appendChild(container);
            dropArea.appendChild(dragText);
            dropArea.appendChild(orText);
            dropArea.appendChild(button);
        }
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
    let fileType = file.type;
    let validExtensions = ["image/jpeg", "image/png", "image/jpg"];
    let check = true;
    if (validExtensions.includes(fileType)) {
        let fileReader = new FileReader();
        fileReader.onload = () => {
            let fileUrl = fileReader.result;
            let imgTag = document.createElement("img");
            let navTag = document.createElement("a");
            imgTag.src = fileUrl;
            imgTag.setAttribute("id", numOfFile);
            navTag.href = "#" + numOfFile;
            imageDiv.appendChild(imgTag);
            navWrapper.appendChild(navTag);
        };
        fileReader.readAsDataURL(file);
        numOfFile += 1;
    } else {
        check = false;
        alert("Đây không phải là một file ảnh");
        dragText.textContent = "Kéo và thả để tải hình ảnh lên";
    }

    if (check) {
        if (!isExisted) {
            dropArea.innerHTML = "";
            dropArea.appendChild(container);
            dropArea.appendChild(dragText);
            dropArea.appendChild(orText);
            dropArea.appendChild(button);
            isExisted = true;
        } else {
            dropArea.appendChild(container);
            dropArea.appendChild(dragText);
            dropArea.appendChild(orText);
            dropArea.appendChild(button);
        }
    }
});

console.log(input.files);