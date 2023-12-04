const close = document.querySelector("#close").addEventListener("click", closePopupHandler);
function closePopupHandler() {
    document.querySelector("#container").classList.add("fade");
}
