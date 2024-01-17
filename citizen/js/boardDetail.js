import { getDetailBoard } from "./request.js";

const urlParams = new URLSearchParams(window.location.search);
const boardID = urlParams.get('id');
let boardDetail = await getDetailBoard(boardID);
// console.log(boardDetail);

const thumbnailsCarousel = boardDetail.image
  .map((img) =>`<li class="splide__slide"><img src="${img}" alt="thumbnail"></li>`)
  .join("");
document
  .getElementById("thumbnail-carousel")
  .querySelector("ul.splide__list").innerHTML = thumbnailsCarousel;
document.getElementById("main-carousel").querySelector("ul.splide__list").innerHTML = thumbnailsCarousel;

const thumbnail = new Splide("#thumbnail-carousel", {
  fixedHeight: "5rem",
  perPage: Math.min(3, boardDetail.image.length),
  type: "loop",
  gap: 10,
  rewind: true,
  pagination: false,
  focus: "center",
  isNavigation: true,
  arrows: false,
  breakpoints: {
    600: {
      fixedWidth: 66,
      fixedHeight: 40,
    },
  },
});

const main = new Splide("#main-carousel", {
  type: "fade",
  rewind: true,
  pagination: false,
  arrows: true,
  fixedHeight: "28rem",
  fixedWidth: "100%",
  type:"loop",
});

main.sync(thumbnail);
main.mount();
thumbnail.mount();
// {
//   "_id": "6577e392b9f63faab623510c",
//   "boardID": "QC0006",
//   "spotID": "DD0008",
//   "height": 13,
//   "width": 7.5,
//   "quantity": 3,
//   "image": [
//       "https://drive.google.com/uc?export=view&id=1VDcBGaE7KToRdlc1pWccE112vaf8kfUk",
//       "https://drive.google.com/uc?export=view&id=1DdHY02Ga5qoh_cEhc2BK0_UL4H1SisaO"
//   ],
//   "spotAddress": "974 Trường Sa",
//   "authCompany": "Công ty Dược phẩm Quốc tế",
//   "authCompanyPhone": "0912 876 543",
//   "authCompanyEmail": "quocphatmcompany.info@gmail.com",
//   "authCompanyAddress": "806 Đ. Trần Hưng Đạo, Phường 7, Quận 5, Thành phố Hồ Chí Minh",
//   "startDate": "2023-06-30T00:00:00.000Z",
//   "endDate": "2024-06-30T00:00:00.000Z",
//   "boardTypeName": "Trụ treo băng rôn dọc",
//   "spotTypeName": "Chợ",
//   "adsFormName": "Xã hội hoá"
// }

const formater = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

$("#board-id").val(boardDetail.boardID);
$("#spot-id").val(boardDetail.spotID);
$("#address").val(boardDetail.spotAddress);
$("#auth-company").val(boardDetail.authCompany);
$("#auth-company-phone").val(boardDetail.authCompanyPhone);
$("#auth-company-email").val(boardDetail.authCompanyEmail);
$("#auth-company-address").val(boardDetail.authCompanyAddress);
$("#start-date").val(formater.format(new Date(boardDetail.startDate)));
$("#end-date").val(formater.format(new Date(boardDetail.endDate)));
$("#ads-type").val(boardDetail.adsFormName);
$("#quantity").val(`${boardDetail.quantity} trụ/bảng`);
$("#size").val(`${boardDetail.width} x ${boardDetail.height} m^2`);
$("#ads-form").val(boardDetail.adsFormName);
$("#location-type").val(boardDetail.spotTypeName);
$("#report-btn").attr("href", `/report-create.html?id=${boardDetail.boardID}`);