const changeMainImg = (img) => {
  document.getElementById("mainImg").src = img.src;
  // add border to img
  document.querySelectorAll("img.border").forEach((img) => {
    img.classList.remove("border", "border-primary");
  });
  img.classList.add("border", "border-primary");
};

const moveSlides = (direction) => {
  const thumbnails = document.querySelectorAll(".thumbnails-item");
  const currentThumbnails = document.querySelector(
    ".thumbnails-item:not(.d-none)"
  );
  const currentIndex = Array.from(thumbnails).indexOf(currentThumbnails);

  // remove the border of current img
  const currentImg = currentThumbnails.querySelector("img.border");
  const currentImgIndex = currentImg.dataset.bsIndex;
  console.log(currentImgIndex)
  if (currentImg) {
    currentImg.classList.remove("border", "border-primary");
  }

  let newIndex = 0;
  if (direction === "left") {
    newIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
  } else {
    newIndex = (currentIndex + 1) % thumbnails.length;
  }
  currentThumbnails.classList.add("d-none");
  thumbnails[newIndex].classList.remove("d-none");

  // change img to center
  if (newIndex !== currentIndex) {
    const centerImg = thumbnails[newIndex].children[1].children[0];
    document.getElementById("mainImg").src = centerImg.src;
    centerImg.classList.add("border", "border-primary");
  }
};
// document.addEventListener("DOMContentLoaded", async () => {
// 	moveSlides('right');
// });
