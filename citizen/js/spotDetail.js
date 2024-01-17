import { getDetailSpot } from "/js/request.js";

const urlParams = new URLSearchParams(window.location.search);
const spotID = urlParams.get("id");
$("#report-btn").click(() => {
  // change to report page
  window.location.href = `./report-create.html?id=${spotID}`;
});

let spotDetail = await getDetailSpot(spotID);
spotDetail = spotDetail[0];
console.log(spotDetail);
const thumbnailsCarousel = spotDetail.images
  .map((img) =>`<li class="splide__slide"><img src="${img}" alt="thumbnail"></li>`)
  .join("");
document
  .getElementById("thumbnail-carousel")
  .querySelector("ul.splide__list").innerHTML = thumbnailsCarousel;
document.getElementById("main-carousel").querySelector("ul.splide__list").innerHTML = thumbnailsCarousel;

const thumbnail = new Splide("#thumbnail-carousel", {
  fixedHeight: "5rem",
  perPage: Math.min(3, 1),
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

$("#spot-name").text(spotDetail.locationName);
$("#spot-id").val(spotDetail.locationID);

let [address, ward, district] = spotDetail.address.split(",");
ward = ward.replace("Phường", "").trim();
district = district.replace("Quận", "").trim();

$("#address").val(address);
$("#ward").val(ward);
$("#district").val(district);
$("#spot-type").val(spotDetail.locationTypeName);
$("#ads-type").val(spotDetail.adsFormName);
$("#status").val(spotDetail.status === 1 ? "Đã xử lý" : "Chờ xử lý");
const table = $("#table");
const boardData = spotDetail.boards.map((board) => ({
  id: board.boardID,
  ward: board.wardName,
  type: board.boardType,
  size: `${board.boardSize} m<sup>2</sup>`,
  quantity: `${board.quantity} trụ/bảng`,
  detail: `
		<div class="d-flex flex-row align-items-center justify-content-center">
      <a href="./board-detail.html?id=${board.boardID}">
        <img src="./assets/info.svg" alt="edit-icon" style="background-color: transparent"/>
      </a>
    </div>
		`,
}));
table.bootstrapTable("load", boardData);
