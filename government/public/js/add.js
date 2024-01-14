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
    showFile(files);
});

function showFile(files) {
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
