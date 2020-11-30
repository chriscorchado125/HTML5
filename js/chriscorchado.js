"use strict";
import * as dataJS from "./data.js";
import * as utilityJS from "./utilities.js";
import * as searchJS from "./search.js";
window.onload = () => {
    fetch("./includes/nav.html")
        .then((response) => {
        return response.text();
    })
        .then((data) => {
        const thisNav = document.getElementById("navigation");
        thisNav.innerHTML = data;
        if (document.getElementById("search-container")) {
            const thisSearchSite = document.getElementById("searchSite");
            thisSearchSite.onkeydown = (event) => searchJS.searchFilter(event);
            const thisSearchSubmit = document.getElementById("searchSubmit");
            thisSearchSubmit.onclick = (event) => searchJS.search(event);
            const thisSearchClearBtn = document.getElementById("searchClearBtn");
            thisSearchClearBtn.onclick = (event) => searchJS.searchClear(utilityJS.SITE_SEARCH_ID);
        }
    }).catch((error) => {
        alert(`Sorry an error has occurred: ${error}`);
    });
    ;
    fetch("./includes/footer.html")
        .then((response) => {
        return response.text();
    })
        .then((data) => {
        const thisSearchClearBtn = document.getElementById("footer");
        thisSearchClearBtn.innerHTML = data;
    }).catch((error) => {
        alert(`Sorry an error has occurred: ${error}`);
    });
    ;
    dataJS.getPage(utilityJS.getCurrentPage());
};
