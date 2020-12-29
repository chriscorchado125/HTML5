import * as dataJS from './data.js';
import * as utilityJS from './utilities.js';
import * as searchJS from './search.js';
import getCurrentPage from './getCurrentPage.js';
window.onload = () => {
    fetch('./includes/nav.html')
        .then((response) => {
        return response.text();
    })
        .then((data) => {
        const thisNav = document.getElementById('navigation');
        thisNav.innerHTML = data;
        utilityJS.animateLogo('logo-image', 'spin');
        if (document.getElementById('search-container')) {
            const thisSearchSite = document.getElementById('search-site');
            if (thisSearchSite) {
                thisSearchSite.onkeydown = (event) => searchJS.searchFilter(event);
            }
            const thisSearchSubmit = document.getElementById('search-submit');
            if (thisSearchSubmit) {
                thisSearchSubmit.onclick = (event) => searchJS.search(event);
            }
            const thisSearchClearBtn = document.getElementById('search-clear-btn');
            if (thisSearchClearBtn) {
                thisSearchClearBtn.onclick = () => searchJS.searchClear(utilityJS.SITE_SEARCH_ID);
            }
        }
    }).catch((error) => {
        utilityJS.showMessage(`Sorry an error has occurred: ${error}`);
    });
    fetch('./includes/footer.html')
        .then((response) => {
        return response.text();
    })
        .then((data) => {
        const footerEL = document.getElementById('footer');
        if (footerEL) {
            footerEL.innerHTML = data;
        }
    }).catch((error) => {
        utilityJS.showMessage(`Sorry an error has occurred: ${error}`);
    });
    dataJS.getPage(getCurrentPage(), '');
};
