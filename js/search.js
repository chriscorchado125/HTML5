import * as utilityJS from "./utilities.js";
import * as dataJS from "./data.js";
const getSearchCount = (count, searchCountID) => {
    let searchElement = document.getElementById(utilityJS.SITE_SEARCH_ID);
    if (searchElement.value) {
        const searchCountEL = document.getElementById(searchCountID);
        if (count <= utilityJS.MAX_ITEMS_PER_PAGE) {
            searchCountEL.innerHTML = count + `  ${count == 1 ? "Item" : "Items"}`;
        }
        else {
            searchCountEL.innerHTML = utilityJS.MAX_ITEMS_PER_PAGE + `  ${+utilityJS.MAX_ITEMS_PER_PAGE == 1 ? "Item" : "Items"}`;
        }
        return `${count} ${count == 1 ? "Item" : "Items"} `;
    }
};
const getSearchOffset = (link) => {
    let nextURL = link.href.replace(/%2C/g, ",").replace(/%5B/g, "[").replace(/%5D/g, "]");
    return nextURL.substring(nextURL.search("offset") + 8, nextURL.search("limit") - 6);
};
export const setPagination = (count, paginationTotal, prev, next) => {
    let dataOffset = 0;
    let prevLink = "";
    let nextLink = "";
    if (next)
        dataOffset = getSearchOffset(next);
    let dataOffsetText = getSearchCount(count, "searchCount");
    const searchContainer = document.getElementById("search-container");
    const searchContainerCount = document.getElementById("searchCount");
    if (!next && !prev) {
        searchContainer.className = "paginationNo";
        searchContainerCount.innerHTML = `<span id="totalItems">${count}</span> ${count == 1 ? "Item" : "Items"}`;
    }
    else {
        searchContainer.className = "paginationYes";
        let currentCount = +dataOffset / utilityJS.MAX_ITEMS_PER_PAGE;
        if (count == dataOffset) {
            dataOffsetText = `Items 1-<span id="lastCount">${utilityJS.MAX_ITEMS_PER_PAGE}</span>`;
        }
        else {
            if (currentCount !== 0) {
                dataOffsetText = `Items ${(currentCount * utilityJS.MAX_ITEMS_PER_PAGE - utilityJS.MAX_ITEMS_PER_PAGE) + 1}-<span id="lastCount">${currentCount * utilityJS.MAX_ITEMS_PER_PAGE}</span>`;
            }
            else {
                dataOffsetText = `Items ${+paginationTotal + 1}-<span id="lastCount">${+paginationTotal + count}</span>`;
            }
        }
        searchContainerCount.innerHTML = `<span id="paging-info">${dataOffsetText}</span>`;
        prevLink = prev
            ? `<a href="#" class="pager-navigation" title="View the previous page" role="button" id="pagePrev"
          onclick="getPage(getCurrentPage(), document.getElementById('${utilityJS.SITE_SEARCH_ID}').value,'${prev.href}')">Prev</a>`
            : `<span class="pager-navigation disabled" title="There is no previous page available" role="button">Prev</span>`;
        nextLink = next
            ? `<a href="#" class="pager-navigation" title="View the next page" role="button" id="pageNext">Next</a>`
            : `<span class="pager-navigation disabled" title="There is no next page available" role="button">Next</span>`;
    }
    const SITE_SEARCH_ID = document.getElementById(utilityJS.SITE_SEARCH_ID);
    const paginationCount = document.getElementById("pagination");
    if (count < utilityJS.MAX_ITEMS_PER_PAGE && paginationTotal === 1) {
        paginationCount.style.display = "none";
    }
    else {
        paginationCount.style.display = "inline-block";
        paginationCount.innerHTML = `${prevLink}  ${nextLink}`;
        const pagePrev = document.getElementById("pagePrev");
        const pageNext = document.getElementById("pageNext");
        if (pagePrev)
            pagePrev.onclick = () => dataJS.getPage(utilityJS.getCurrentPage(), SITE_SEARCH_ID.value, prev.href);
        if (pageNext)
            pageNext.onclick = () => dataJS.getPage(utilityJS.getCurrentPage(), SITE_SEARCH_ID.value, next.href);
    }
};
export const search = (e) => {
    const re = new RegExp(('[a-zA-Z \s]'));
    const inputSearchBox = document.getElementById(utilityJS.SITE_SEARCH_ID);
    if (inputSearchBox.value == "" || re.exec(inputSearchBox.value) == null) {
        e.preventDefault();
        if (inputSearchBox.value == "") {
            alert("Please enter something to search for");
        }
        else if (re.exec(inputSearchBox.value) == null) {
            alert("Searching with numbers and/or special characters is not enabled");
        }
        return false;
    }
    dataJS.getPage(utilityJS.getCurrentPage(), inputSearchBox.value);
    updateInterface();
};
export const searchFilter = (event) => {
    const allowOnlyLettersAndSpace = new RegExp("^(?! )[A-Za-z\s]*$");
    return allowOnlyLettersAndSpace.test(event.key);
};
export const searchClear = (searchTextBoxID) => {
    const inputSearchBox = document.getElementById(searchTextBoxID);
    inputSearchBox.value = "";
    dataJS.getPage(utilityJS.getCurrentPage());
    updateInterface();
};
export const noRecordsFound = (noRecordID, search, appendToID, msg) => {
    const noRecordEL = document.getElementById(noRecordID);
    const pagination = document.getElementById("pagination");
    if (!noRecordEL && search) {
        pagination.style.display = "none";
        document.getElementsByClassName("container")[0].removeAttribute("style");
        let notFound = document.createElement("div");
        notFound.id = noRecordID;
        notFound.innerHTML = `${msg} '${search}'`;
        const appendToEL = document.getElementById(appendToID);
        appendToEL.appendChild(notFound);
        const preloadAnimationEL = document.getElementById("preloadAnimation");
        preloadAnimationEL.remove();
        const searchCountEL = document.getElementById("searchCount");
        searchCountEL.innerHTML = '<b style="color:red">No match</b>';
    }
    else {
        pagination.style.display = "inline-block";
    }
};
export const getIncludedData = (data) => {
    let includedAssetFilename = [""];
    let includedCompanyName = [""];
    let includedTechnologyName = [""];
    let includedTechnologyIcon = [""];
    data.included.forEach((included_element) => {
        if (included_element.attributes.description) {
            let iconFileNamePath = /"(.*?)"/.exec(included_element.attributes.description.value) || "";
            includedTechnologyIcon[included_element.id] = iconFileNamePath[1];
        }
        if (included_element.attributes.filename) {
            includedAssetFilename[included_element.id] = included_element.attributes.filename;
        }
        if (included_element.attributes.field_company_name) {
            includedCompanyName[included_element.id] =
                included_element.attributes.field_company_name;
        }
        if (included_element.attributes.name) {
            includedTechnologyName[included_element.id] = included_element.attributes.name;
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
    let imgPieces = [];
    let itemPDF = "";
    let itemTrackImage = "";
    let itemCompanyName = "";
    let itemTechnology = "";
    let itemTechnologyIcon = "";
    let includedTechnologyItem = [];
    if (element.relationships.field_award_images &&
        element.relationships.field_award_images.data) {
        imgPieces.push(includedAssetFilename[element.relationships.field_award_images.data[0].id]);
    }
    if (element.relationships.field_award_pdf &&
        element.relationships.field_award_pdf.data) {
        itemPDF = includedAssetFilename[element.relationships.field_award_pdf.data.id];
    }
    if (element.relationships.field_track_image &&
        element.relationships.field_track_image.data) {
        itemTrackImage =
            includedAssetFilename[element.relationships.field_track_image.data.id];
    }
    if (element.relationships.field_company && element.relationships.field_company.data) {
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
            itemTechnology +=
                includedTechnologyName[element.relationships.field_project_technology.data[i].id] + ", ";
            itemTechnologyIcon +=
                includedTechnologyIcon[element.relationships.field_project_technology.data[i].id] + ", ";
            let technologyItem = {
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
    let dataToReturn = "";
    if (searchedFor) {
        let searchTerm = new RegExp(searchedFor, "gi");
        let results = "";
        let searchString = "";
        let searchStringArray = [];
        if (itemToHighlight && +itemToHighlight !== -1) {
            searchString = itemToHighlight.replace("&amp;", "&").replace("&#039;", "'");
        }
        if (searchString.indexOf("<ul>") !== -1) {
            let listItem = "";
            let searchWithHTML = searchString.replace("<ul>", "").replace("</ul>", "");
            searchStringArray = searchWithHTML.split("<li>");
            searchStringArray.forEach((element) => {
                if (element.length > 3) {
                    searchString = element.slice(0, element.lastIndexOf("<"));
                    if (searchString.match(searchTerm)) {
                        results = searchString.replace(searchTerm, (match) => `<span class="highlightSearchText">${match}</span>`);
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
                results = searchString.replace(searchTerm, (match) => `<span class="highlightSearchText">${match}</span>`);
                dataToReturn += results;
            }
            else {
                dataToReturn += searchString;
            }
        }
    }
    return dataToReturn || itemToHighlight;
};
export const updateInterface = (search = "") => {
    noRecordsFound("noRecords", search, "navigation", "No matches found for");
};
