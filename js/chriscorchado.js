"use strict";
const API_BASE = "https://chriscorchado.com/drupal8";
const MAX_ITEMS_PER_PAGE = 50;
const SITE_SEARCH_ID = "searchSite";
fetch("./includes/nav.html")
    .then((response) => {
    return response.text();
})
    .then((data) => {
    document.getElementById("navigation").innerHTML = data;
});
fetch("./includes/footer.html")
    .then((response) => {
    return response.text();
})
    .then((data) => {
    document.getElementById("footer").innerHTML = data;
});
window.onload = () => {
    getPage(getCurrentPage());
};
