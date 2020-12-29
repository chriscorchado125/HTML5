import * as utilityJS from './utilities.js';
import * as dataJS from './data.js';
import getCurrentPage from './getCurrentPage.js';
const searchElement = document.getElementById(utilityJS.SITE_SEARCH_ID);
const getSearchCount = (count, searchCountID) => {
    if (searchElement && searchElement.value) {
        const searchCountEL = document.getElementById(searchCountID);
        if (searchCountEL && (count <= utilityJS.MAX_ITEMS_PER_PAGE)) {
            searchCountEL.innerHTML = `${count}  ${count === 1 ? 'Item' : 'Items'}`;
        }
        else {
            searchCountEL.innerHTML = `${utilityJS.MAX_ITEMS_PER_PAGE} ${+utilityJS.MAX_ITEMS_PER_PAGE === 1 ? 'Item' : 'Items'}`;
        }
        return `${count} ${count === 1 ? 'Item' : 'Items'} `;
    }
    return '';
};
const getSearchOffset = (link) => {
    const nextURL = link.href.replace(/%2C/g, ',').replace(/%5B/g, '[').replace(/%5D/g, ']');
    return nextURL.substring(nextURL.search('offset') + 8, nextURL.search('limit') - 6);
};
export const setPagination = (count, paginationTotal, prev, next) => {
    let dataOffset = 0;
    let prevLink = '';
    let nextLink = '';
    if (next)
        dataOffset = getSearchOffset(next);
    let dataOffsetText = getSearchCount(count, 'search-count');
    const searchContainer = document.getElementById('search-container');
    const searchContainerCount = document.getElementById('search-count');
    if (!next && !prev) {
        searchContainer.className = 'pagination-no';
        if (searchContainerCount) {
            searchContainerCount.innerHTML = `<span id='totalItems'>${count}</span>&nbsp;${count === 1 ? 'Item' : 'Items'}`;
        }
    }
    else {
        searchContainer.className = 'pagination-yes';
        const currentCount = +dataOffset / utilityJS.MAX_ITEMS_PER_PAGE;
        if (count === dataOffset) {
            dataOffsetText = `Items&nbsp;1-<span id="lastCount">${utilityJS.MAX_ITEMS_PER_PAGE}</span>`;
        }
        else {
            if (currentCount !== 0) {
                dataOffsetText = `Items&nbsp;${(currentCount * utilityJS.MAX_ITEMS_PER_PAGE - utilityJS.MAX_ITEMS_PER_PAGE) + 1}-<span id="lastCount">${currentCount * utilityJS.MAX_ITEMS_PER_PAGE}</span>`;
            }
            else {
                dataOffsetText = `Items&nbsp;${+paginationTotal + 1}-<span id="lastCount">${+paginationTotal + count}</span>`;
            }
        }
        if (searchContainerCount) {
            searchContainerCount.innerHTML = `<span id="paging-info">${dataOffsetText}</span>`;
        }
        prevLink = prev
            ? `<a href="#" class="pager-navigation" title="View the previous page" role="button" id="pagePrev" onclick="getPage(getCurrentPage(), document.getElementById("${utilityJS.SITE_SEARCH_ID}").value,"${prev.href}")">Prev</a>`
            : '<span class="pager-navigation disabled" title="There is no previous page available" role="button">Prev</span>';
        nextLink = next
            ? '<a href="#" class="pager-navigation" title="View the next page" role="button" id="pageNext">Next</a>'
            : '<span class="pager-navigation disabled" title="There is no next page available" role="button">Next</span>';
    }
    const SITE_SEARCH_ID = document.getElementById(utilityJS.SITE_SEARCH_ID);
    const paginationCount = document.getElementById('pagination');
    if (count < utilityJS.MAX_ITEMS_PER_PAGE && paginationTotal === 1) {
        paginationCount.style.display = 'none';
    }
    else {
        paginationCount.style.display = 'inline-block';
        paginationCount.innerHTML = `${prevLink}  ${nextLink}`;
        const pagePrev = document.getElementById('pagePrev');
        const pageNext = document.getElementById('pageNext');
        if (pagePrev)
            pagePrev.onclick = () => dataJS.getPage(getCurrentPage(), SITE_SEARCH_ID.value, prev.href, 'prev');
        if (pageNext)
            pageNext.onclick = () => dataJS.getPage(getCurrentPage(), SITE_SEARCH_ID.value, next.href, 'next');
    }
};
export const search = (e) => {
    const re = /[A-Za-z\s]/;
    let inputSearchBox;
    if (document.getElementById(utilityJS.SITE_SEARCH_ID)) {
        inputSearchBox = document.getElementById(utilityJS.SITE_SEARCH_ID);
    }
    if (inputSearchBox && (inputSearchBox.value === '' || re.exec(inputSearchBox.value) === null)) {
        e.preventDefault();
        inputSearchBox.focus();
    }
    if (inputSearchBox && inputSearchBox.value) {
        const currentSearchPage = getCurrentPage();
        dataJS.getPage(currentSearchPage, inputSearchBox.value);
        inputSearchBox.select();
    }
};
export const searchFilter = (event) => {
    const allowOnlyLettersAndSpace = /[A-Za-z\s]/;
    return allowOnlyLettersAndSpace.test(event.key);
};
export const searchClear = (searchTextBoxID) => {
    var _a;
    const inputSearchBox = document.getElementById(searchTextBoxID);
    const pagination = document.getElementById('pagination');
    if (inputSearchBox.value === '' && pagination.style.display === 'none')
        return;
    inputSearchBox.value = '';
    (_a = document.getElementById('no-records')) === null || _a === void 0 ? void 0 : _a.remove();
    dataJS.getPage(getCurrentPage(), '');
    utilityJS.animateLogo('logo-image', 'spin-reverse');
};
export const noRecordsFound = (noRecordID, searchedFor, appendToID, msg) => {
    const searchEL = document.getElementById('search-container');
    searchEL.classList.add('pagination-no');
    searchEL.classList.remove('pagination-yes');
    const pagination = document.getElementById('pagination');
    pagination.style.display = 'none';
    document.getElementsByClassName('container')[0].classList.add('hide');
    const notFound = document.createElement('div');
    notFound.id = noRecordID;
    notFound.innerHTML = `${msg} '${searchedFor}'`;
    const appendToEL = document.getElementById(appendToID);
    appendToEL.appendChild(notFound);
    const preloadAnimationEL = document.getElementById('preloadAnimation');
    if (preloadAnimationEL) {
        preloadAnimationEL.remove();
    }
    const searchCountEL = document.getElementById('search-count');
    if (searchCountEL) {
        searchCountEL.innerHTML = '0 items';
    }
};
export const getIncludedData = (data) => {
    const includedAssetFilename = [''];
    const includedCompanyName = [''];
    const includedTechnologyName = [''];
    const includedTechnologyIcon = [''];
    data.included.forEach((includedElement) => {
        if (includedElement.attributes.description) {
            const iconFileNamePath = /'(.*?)'/.exec(includedElement.attributes.description.value) || '';
            includedTechnologyIcon[includedElement.id] = iconFileNamePath[1];
        }
        if (includedElement.attributes.filename) {
            includedAssetFilename[includedElement.id] = includedElement.attributes.filename;
        }
        if (includedElement.attributes.field_company_name) {
            includedCompanyName[includedElement.id] = includedElement.attributes.field_company_name;
        }
        if (includedElement.attributes.name) {
            includedTechnologyName[includedElement.id] = includedElement.attributes.name;
        }
    });
    return [
        includedCompanyName,
        includedAssetFilename,
        includedTechnologyName,
        includedTechnologyIcon
    ];
};
export const getElementRelationships = (element, includedAssetFilename, includedCompanyName, includedTechnologyName, includedTechnologyIcon) => {
    const imgPieces = [];
    let itemPDF = '';
    let itemTrackImage = '';
    let itemCompanyName = '';
    let itemTechnology = '';
    let itemTechnologyIcon = '';
    const includedTechnologyItem = [];
    if (element.relationships.field_award_images && element.relationships.field_award_images.data) {
        imgPieces.push(includedAssetFilename[element.relationships.field_award_images.data[0].id]);
    }
    if (element.relationships.field_award_pdf && element.relationships.field_award_pdf.data) {
        itemPDF = includedAssetFilename[element.relationships.field_award_pdf.data.id];
    }
    if (element.relationships.field_track_image && element.relationships.field_track_image.data) {
        itemTrackImage = includedAssetFilename[element.relationships.field_track_image.data.id];
    }
    if (element.relationships.field_company &&
        element.relationships.field_company.data) {
        itemCompanyName = includedCompanyName[element.relationships.field_company.data.id];
    }
    if (element.relationships.field_company_screenshot &&
        element.relationships.field_company_screenshot.data) {
        imgPieces.push(includedAssetFilename[element.relationships.field_company_screenshot.data[0].id]);
    }
    if (element.relationships.field_screenshot &&
        element.relationships.field_screenshot.data) {
        for (let i = 0; i < element.relationships.field_screenshot.data.length; i++) {
            imgPieces.push(includedAssetFilename[element.relationships.field_screenshot.data[i].id]);
        }
    }
    if (element.relationships.field_project_technology &&
        element.relationships.field_project_technology.data) {
        for (let i = 0; i < element.relationships.field_project_technology.data.length; i++) {
            itemTechnology += `${includedTechnologyName[element.relationships.field_project_technology.data[i].id]} , `;
            itemTechnologyIcon += `${includedTechnologyIcon[element.relationships.field_project_technology.data[i].id]} , `;
            const technologyItem = {
                name: includedTechnologyName[element.relationships.field_project_technology.data[i].id],
                image: includedTechnologyIcon[element.relationships.field_project_technology.data[i].id]
            };
            includedTechnologyItem.push(technologyItem);
        }
    }
    return [
        imgPieces,
        itemPDF,
        itemTrackImage,
        itemCompanyName,
        itemTechnology,
        itemTechnologyIcon,
        includedTechnologyItem
    ];
};
export const itemWithSearchHighlight = (itemToHighlight, searchedFor) => {
    let dataToReturn = '';
    if (searchedFor) {
        const searchTerm = new RegExp(searchedFor, 'gi');
        let results = '';
        let searchString = '';
        let searchStringArray = [];
        if (itemToHighlight && +itemToHighlight !== -1) {
            searchString = itemToHighlight.replace('&amp;', '&').replace('&#039;', '\'');
        }
        if (searchString.indexOf('<ul>') !== -1) {
            let listItem = '';
            const searchWithHTML = searchString.replace('<ul>', '').replace('</ul>', '');
            searchStringArray = searchWithHTML.split('<li>');
            searchStringArray.forEach((element) => {
                if (element.length > 3) {
                    searchString = element.slice(0, element.lastIndexOf('<'));
                    if (searchString.match(searchTerm)) {
                        results = searchString.replace(searchTerm, (match) => `<span class='highlightSearchText'>${match}</span>`);
                        listItem += `<li>${results}</li>`;
                    }
                    else {
                        listItem += `<li>${searchString}</li>`;
                    }
                }
            });
            dataToReturn = `<ul>${listItem}</ul>`;
        }
        else {
            if (searchString.match(searchTerm)) {
                results = searchString.replace(searchTerm, (match) => `<span class='highlightSearchText'>${match}</span>`);
                dataToReturn += results;
            }
            else {
                dataToReturn += searchString;
            }
        }
    }
    return dataToReturn || itemToHighlight;
};
