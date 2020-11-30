import * as dataJS from "./data.js";
import * as utilityJS from "./utilities.js";
import * as searchJS from "./search.js";

window.onload = () => {
  fetch("./includes/nav.html")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      const thisNav = document.getElementById("navigation") as HTMLElement;
      thisNav.innerHTML = data;

      // setup search functionality
      if (document.getElementById("search-container")) {

        const thisSearchSite = document.getElementById("searchSite") as HTMLElement;
        thisSearchSite.onkeydown = (event) => searchJS.searchFilter(event);

        const thisSearchSubmit = document.getElementById("searchSubmit") as HTMLElement;
        thisSearchSubmit.onclick = (event) => searchJS.search(event);

        const thisSearchClearBtn = document.getElementById("searchClearBtn") as HTMLElement;
        thisSearchClearBtn.onclick = (event) => searchJS.searchClear(utilityJS.SITE_SEARCH_ID)

      }
    }).catch((error) => {
      alert(`Sorry an error has occurred: ${error}`);
    });;

  fetch("./includes/footer.html")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      const thisSearchClearBtn = document.getElementById("footer") as HTMLElement;
      thisSearchClearBtn.innerHTML = data;
    }).catch((error) => {
      alert(`Sorry an error has occurred: ${error}`);
    });;

  dataJS.getPage(utilityJS.getCurrentPage());
}