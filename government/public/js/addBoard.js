const dropArea = document.querySelector(".drag-area");
const dragText = dropArea.querySelector(".dragText");
const button = dropArea.querySelector("button");
const input = dropArea.querySelector("input");
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