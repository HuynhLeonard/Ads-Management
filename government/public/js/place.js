const close = document.querySelector("#close").addEventListener("click", closePopupHandler);
function closePopupHandler() {
    document.querySelector("#container").classList.add("fade");
}

const reportButton = document.querySelector(".view-reports");
const adsButton = document.querySelector(".view-ads");

reportButton.addEventListener("click", displayReports);
adsButton.addEventListener("click", displayAds);

function displayAds() {
    if (document.querySelector(".ads-info").classList.contains("fade")) {
        if (document.querySelector(".reports-info").classList.contains("fade")) {
            document.querySelector(".ads-info").classList.remove("fade");
        } else {
            document.querySelector(".reports-info").classList.add("fade");
            document.querySelector(".ads-info").classList.remove("fade");
        }
    } else {
        document.querySelector(".ads-info").classList.add("fade");
    }
}

function displayReports() {
    if (document.querySelector(".reports-info").classList.contains("fade")) {
        if (document.querySelector(".ads-info").classList.contains("fade")) {
            document.querySelector(".reports-info").classList.remove("fade");
        } else {
            document.querySelector(".ads-info").classList.add("fade");
            document.querySelector(".reports-info").classList.remove("fade");
        }
    } else {
        document.querySelector(".reports-info").classList.add("fade");
    }
}
