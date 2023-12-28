const show = document
  .querySelector("#submenu-btn")
  .addEventListener("click", showSubMenu);
function showSubMenu() {
  if (
    document.querySelector("#submenu").classList.contains("show") &&
    document.querySelector("#dropdown").classList.contains("change")
  ) {
    document.querySelector("#submenu").classList.remove("show");
    document.querySelector("#dropdown").classList.remove("change");
  } else {
    document.querySelector("#submenu").classList.add("show");
    document.querySelector("#dropdown").classList.add("change");
  }
}

const close = document
  .querySelector("#closing")
  .addEventListener("click", handleSideBar);
function handleSideBar() {
  if (document.body.classList.contains("open")) {
    document.body.classList.remove("open");
    document.querySelector("#submenu").classList.remove("show");
    document.querySelector("#dropdown").classList.remove("change");
  } else {
    document.body.classList.toggle("open");
  }
}
// document.body.classList.toggle("open")
