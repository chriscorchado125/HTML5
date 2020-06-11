'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var API_base = 'https://chriscorchado.com/drupal8';
var API_Course_Count = API_base + "/rest/api/course/count?_format=json";
var API_Company_Count = API_base + "/rest/api/company/count?_format=json";
var API_Project_Count = API_base + "/rest/api/project/count?_format=json";
var inputSearchBox = document.getElementById('searchSite');
var pageLimit = 50;
/* Hide container and load navigation/footer */
$('.container').hide();
$('#navigation').load('includes/nav.html');
$('#footer').load('includes/footer.html');
/**
 * Load page
 * @callback getCurrentPage
 * @param {getCurrentPage} page - page name
 * @param {string=} search - (optional) - search string
 * @param {string=} pagingURL - (optional) - Prev/Next links
 */
function getPage(page, search, pagingURL) {
    return __awaiter(this, void 0, void 0, function () {
        var data, inputSearchBox, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    data = null;
                    inputSearchBox = document.getElementById('searchSite');
                    if (search) {
                        ga('send', 'pageview', location.pathname + '?search=' + inputSearchBox.value);
                    }
                    /* if not searching */
                    if (!document.getElementById('noRecords')) {
                        $('#preloader').show();
                        $('.container').hide();
                    }
                    if (!(page == 'contact')) return [3 /*break*/, 2];
                    /* get the feedback form and javascript from the Drupal 8 site */
                    return [4 /*yield*/, fetch(API_base + "/contact/feedback")
                            .then(function (resp) {
                            return resp.ok ? resp.text() : Promise.reject(resp.statusText);
                        })
                            .then(function (document) {
                            /* get the HTML and update the URLs from relative to absolute */
                            data = document.substr(0, document.indexOf('</html>') + 8);
                            data = data.replace(/\/drupal8/g, API_base);
                            /* get form */
                            var form = data.substr(data.indexOf('<form'), data.indexOf('</form>'));
                            form = form.substr(0, form.indexOf('</form>') + 8);
                            /* replace form name and email label text */
                            form = form.replace('Your name', 'Name');
                            form = form.replace('Your email address', 'Email');
                            /* add 'searchBtn' class to the submit button */
                            form = form.replace('class="button button--primary js-form-submit form-submit"', 'class="button button--primary js-form-submit form-submit searchBtn"');
                            /* get scripts */
                            var script = data.substr(data.indexOf('<script type="application/json" data-drupal-selector="drupal-settings-json">'), data.indexOf('js"></script>'));
                            script = script.substr(0, script.indexOf('</script>') + 9);
                            /* show form or submitted message */
                            if (location.toString().indexOf('submitted') !== -1) {
                                data = '<h2>Thanks for the Feedback</h2>';
                                data += '<div id="countdown"></div>';
                            }
                            else {
                                data = "<h1>Contact</h1>" + form + " " + script;
                            }
                        })["catch"](function (error) {
                            console.log(error);
                        })];
                case 1:
                    /* get the feedback form and javascript from the Drupal 8 site */
                    _b.sent();
                    renderPage(data, page);
                    return [2 /*return*/, false];
                case 2:
                    if (!pagingURL) return [3 /*break*/, 4];
                    return [4 /*yield*/, getData(pagingURL)];
                case 3:
                    data = _b.sent();
                    return [3 /*break*/, 22];
                case 4:
                    getTotalRecordCount(page);
                    _a = page;
                    switch (_a) {
                        case 'about': return [3 /*break*/, 5];
                        case 'companies': return [3 /*break*/, 7];
                        case 'courses': return [3 /*break*/, 12];
                        case 'projects': return [3 /*break*/, 17];
                    }
                    return [3 /*break*/, 22];
                case 5: return [4 /*yield*/, getData(API_base + "/jsonapi/node/page?fields[node--page]=id,title,body&filter[id][operator]=CONTAINS&filter[id][value]=ca23f416-ad70-41c2-9228-52ba6577abfe")];
                case 6:
                    data = _b.sent();
                    return [3 /*break*/, 22];
                case 7:
                    if (!search) return [3 /*break*/, 9];
                    return [4 /*yield*/, getData(API_base + "/jsonapi/node/company?filter[or-group][group][conjunction]=OR&filter[field_company_name][operator]=CONTAINS&filter[field_company_name][value]=" + search + "&filter[field_company_name][condition][memberOf]=or-group&filter[field_job_title][operator]=CONTAINS&filter[field_job_title][value]=" + search + "&filter[field_job_title][condition][memberOf]=or-group&filter[body.value][operator]=CONTAINS&filter[body.value][value]=" + search + "&filter[body.value][condition][memberOf]=or-group&sort=-field_end_date&include=field_company_screenshot&page[limit]=" + pageLimit)];
                case 8:
                    data = _b.sent();
                    return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, getData(API_base + "/jsonapi/node/company?sort=-field_end_date&include=field_company_screenshot&page[limit]=" + pageLimit)];
                case 10:
                    data = _b.sent();
                    _b.label = 11;
                case 11: return [3 /*break*/, 22];
                case 12:
                    if (!search) return [3 /*break*/, 14];
                    return [4 /*yield*/, getData(API_base + "/jsonapi/node/awards?filter[or-group][group][conjunction]=OR&filter[title][operator]=CONTAINS&filter[title][value]=" + search + "&filter[title][condition][memberOf]=or-group&filter[field_award_date][operator]=CONTAINS&filter[field_award_date][value]=" + search + "&filter[field_award_date][condition][memberOf]=or-group&sort=-field_award_date&include=field_award_pdf,field_track_image,field_award_images&page[limit]=" + pageLimit)];
                case 13:
                    data = _b.sent();
                    return [3 /*break*/, 16];
                case 14: return [4 /*yield*/, getData(API_base + "/jsonapi/node/awards?sort=-field_award_date&include=field_award_pdf,field_track_image,field_award_images&page[limit]=" + pageLimit)];
                case 15:
                    data = _b.sent();
                    _b.label = 16;
                case 16: return [3 /*break*/, 22];
                case 17:
                    if (!search) return [3 /*break*/, 19];
                    return [4 /*yield*/, getData(API_base + "/jsonapi/node/project?filter[or-group][group][conjunction]=OR&filter[title][operator]=CONTAINS&filter[title][value]=" + search + "&filter[title][condition][memberOf]=or-group&filter[taxonomy_term--tags][path]=field_project_technology.name&filter[taxonomy_term--tags][operator]=CONTAINS&filter[taxonomy_term--tags][value]=" + search + "&filter[taxonomy_term--tags][condition][memberOf]=or-group&filter[field_company.title][operator]=CONTAINS&filter[field_company.title][value]=" + search + "&filter[field_company.title][condition][memberOf]=or-group&filter[field_screenshot.meta.alt][operator]=CONTAINS&filter[field_screenshot.meta.alt][value]=" + search + "&filter[field_screenshot.meta.alt][condition][memberOf]=or-group&filter[field_date][operator]=CONTAINS&filter[field_date][value]=" + search + "&filter[field_date][condition][memberOf]=or-group&sort=-field_date&include=field_project_technology,field_company,field_screenshot&fields[node--company]=field_company_name,field_video_url&fields[node--project]=title,body,field_date,field_screenshot,field_project_technology,field_company,field_video_url&page[limit]=" + pageLimit)];
                case 18:
                    data = _b.sent();
                    return [3 /*break*/, 21];
                case 19: return [4 /*yield*/, getData(API_base + "/jsonapi/node/project?sort=-field_date&include=field_project_technology,field_company,field_screenshot&fields[node--company]=field_company_name,field_video_url&fields[node--project]=title,body,field_date,field_screenshot,field_project_technology,field_company,field_video_url&page[limit]=" + pageLimit)];
                case 20:
                    data = _b.sent();
                    _b.label = 21;
                case 21: return [3 /*break*/, 22];
                case 22:
                    renderPage(data, page, search, data.links.next, data.links.prev);
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Get data from Drupal 8 datastore
 * @param {string} dataURL - url to fetch data from
 * @return {array} - array of objects
 */
var getData = function (dataURL) {
    var result = $.ajax({
        dataType: 'json',
        accepts: {
            json: 'application/vnd.api+json'
        },
        url: dataURL,
        type: 'GET'
    });
    return result;
};
/**
 * Search data after the user pauses typing for half a second
 */
function searchData() {
    return __awaiter(this, void 0, void 0, function () {
        var timeout, inputSearchBox;
        return __generator(this, function (_a) {
            timeout = 0;
            inputSearchBox = document.getElementById('searchSite');
            inputSearchBox.addEventListener('keyup', function (e) {
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    $('.container, .courses-container').hide();
                    getPage(getCurrentPage(), inputSearchBox.value);
                }, 500);
            });
            return [2 /*return*/];
        });
    });
}
/**
 * Clear current search
 */
var searchClear = function () {
    if (inputSearchBox.value !== '') {
        window.location.replace(location.href);
    }
};
/**
 * Filter what a user is allowed to enter in the search field
 * Only allow searching with a-Z, 0-9 and spaces
 * @param {KeyboardEvent} event - key event
 * @return {string} - allowed characters
 */
var searchFilter = function (event) {
    /* don't allow more characters to be typed if current search returns no records */
    if (document.getElementById('searchCount').innerText.substring(0, 1) == '0') {
        return false;
    }
    var charCode = event.keyCode || event.which;
    return ((charCode >= 65 && charCode <= 122) || // a-z
        (charCode >= 96 && charCode <= 105) || // 0-9 numeric keypad
        (charCode >= 48 && charCode <= 57) || // 0-9 top of keyboard
        charCode == 16 || // shift key - A-Z
        charCode == 32 // space
    );
};
/**
 * Highlight search term with a string
 * @param {string} itemToHighlight - string to search
 * @param {string} searchedFor - string to search for
 * @return {string} - search result with/without highlight
 */
var itemWithSearchHighlight = function (itemToHighlight, searchedFor) {
    var dataToReturn = '';
    if (searchedFor) {
        var searchTerm_1 = new RegExp(searchedFor, 'gi');
        var results_1 = '';
        var searchString_1 = '';
        var searchStringArray = [];
        if (itemToHighlight && +itemToHighlight !== -1) {
            searchString_1 = itemToHighlight.replace('&amp;', '&').replace('&#039;', "'");
        }
        /* check for HTML
         * TODO: use entities within Drupal to avoid adding body content with HTML
         */
        if (searchString_1.indexOf('<ul>') !== -1) {
            var listItem_1 = '';
            // remove ul tags and break the li items into an array
            var searchWithHTML = searchString_1.replace('<ul>', '').replace('</ul>', '');
            searchStringArray = searchWithHTML.split('<li>');
            searchStringArray.forEach(function (element) {
                if (element.length > 3) {
                    // remove closing li tag
                    searchString_1 = element.slice(0, element.lastIndexOf('<'));
                    if (searchString_1.match(searchTerm_1)) {
                        results_1 = searchString_1.replace(searchTerm_1, function (match) { return "<span class=\"highlightSearchText\">" + match + "</span>"; });
                        listItem_1 += "<li>" + results_1 + "</li>";
                    }
                    else {
                        listItem_1 += "<li>" + searchString_1 + "</li>";
                    }
                }
            });
            dataToReturn = "<ul>" + listItem_1 + "</ul>";
        }
        else {
            if (searchString_1.match(searchTerm_1)) {
                results_1 = searchString_1.replace(searchTerm_1, function (match) { return "<span class=\"highlightSearchText\">" + match + "</span>"; });
                dataToReturn += results_1;
            }
            else {
                dataToReturn += searchString_1;
            }
        }
    }
    return dataToReturn || itemToHighlight;
};
/**
 * Create the countdown after submitting the contact form
 */
var seconds = 5;
var showCountDown = function () {
    seconds -= 1;
    document.getElementById('countdown').innerHTML = "<h4>You will be redirect to the homepage in " + seconds + " seconds.</h4><img id=\"timer\" src=\"https://chriscorchado.com/images/timer.gif\" />";
};
/**
 * Create HTML for page
 * @param {object[]} data - page items
 * @param {string} page - page name
 * @param {string=} searchedFor - (Optional) - search string
 * @param {Object=} next - (Optional) - page name
 * @param {Object=} prev - (Optional) - search string
 */
var renderPage = function (data, page, searchedFor, next, prev) {
    if (page == 'contact') {
        $('#contact-link').addClass('nav-item-active');
        $('.container').html(data.toString()).fadeIn(300);
        document.getElementById('profiles').style.display = 'none';
        document.getElementById('search-container').style.display = 'none';
        document.getElementById('preloader').style.display = 'none';
        /* foward to the homepage after submission */
        var loc_1 = location.toString().indexOf('contact.html?submitted');
        if (loc_1 !== -1) {
            setInterval(showCountDown, 1000);
            /* get the homepage url and forward to it after ${seconds} */
            setTimeout(function () {
                window.location.replace(location.toString().substr(0, loc_1));
            }, seconds * 1000);
        }
        else {
            $('#edit-name').focus();
        }
        return false;
    }
    /* regex to get string within quotes */
    var getStringInQuotes = /"(.*?)"/;
    var screenshotCount = 0, imgAltCount = 0, itemCount = 0;
    var imgPieces = [''];
    var item = '', itemBody = '', currentNavItem = '', itemGridClass = '', itemTitle = '', itemDate = '', startDate = '', endDate = '', itemJobTitle = '', itemTechnology = '', itemCompanyName = '', itemWorkType = '', itemPDF = '', section = '', projectImage = '', aboutBody = '', aboutProfiles = '';
    var newDate = new Date();
    // add border to logo and hide search box on About page
    if (page == 'about') {
        document.getElementById('search-container').style.display = 'none';
        document.getElementById('logo').getElementsByTagName('img')[0].style.border =
            '1px dashed #7399EA';
    }
    $('#noRecords').remove();
    data.data.forEach(function (element) {
        itemTitle = element.attributes.title;
        itemBody = element.attributes.body ? element.attributes.body.value : '';
        itemDate = element.attributes.field_date || element.attributes.field_award_date;
        itemJobTitle = element.attributes.field_job_title;
        startDate = element.attributes.field_start_date;
        endDate = element.attributes.field_end_date;
        itemWorkType = element.attributes.field_type = 'full' ? 'Full-Time' : 'Contract';
        itemTechnology = '';
        imgPieces = [];
        if (data.included) {
            data.included.forEach(function (included_element) {
                //console.log(typeof included_element);
                /* get Courses screenshot filenames */
                if (element.relationships.field_award_images) {
                    if (element.relationships.field_award_images.data[0].id == included_element.id) {
                        imgPieces.push(included_element.attributes.filename);
                    }
                }
                /* get Courses PDF filenames */
                if (element.relationships.field_award_pdf &&
                    element.relationships.field_award_pdf.data.id == included_element.id) {
                    itemPDF = included_element.attributes.filename;
                }
                /* get Company screenshot filenames */
                if (element.relationships.field_company_screenshot) {
                    if (element.relationships.field_company_screenshot.data.some(function (field_screenshot) { return field_screenshot.id == included_element.id; })) {
                        imgPieces.push(included_element.attributes.filename);
                    }
                }
                /* get Company name */
                if (element.relationships.field_screenshot) {
                    if (element.relationships.field_company.data.id == included_element.id) {
                        itemCompanyName = included_element.attributes.field_company_name;
                    }
                    /* get Project screenshot filenames */
                    if (element.relationships.field_screenshot.data.some(function (field_screenshot) { return field_screenshot.id == included_element.id; })) {
                        imgPieces.push(included_element.attributes.filename);
                    }
                    /* get technology names */
                    if (element.relationships.field_project_technology.data.some(function (technology) { return technology.id == included_element.id; })) {
                        itemTechnology += included_element.attributes.name + ', ';
                    }
                }
            });
        } // if data_included
        /* get dates */
        if (itemDate) {
            if (page == 'projects') {
                itemDate = itemDate.split('-')[0]; // only year
            }
            if (page == 'courses') {
                // month and year
                newDate = new Date(itemDate);
                itemDate =
                    newDate.toLocaleString('default', { month: 'long' }) +
                        ' ' +
                        newDate.getFullYear();
            }
        }
        /* Work History Dates - month and year*/
        if (startDate) {
            newDate = new Date(startDate);
            startDate =
                newDate.toLocaleString('default', { month: 'long' }) +
                    ' ' +
                    newDate.getFullYear();
        }
        if (endDate) {
            newDate = new Date(endDate);
            endDate =
                newDate.toLocaleString('default', { month: 'long' }) +
                    ' ' +
                    newDate.getFullYear();
        }
        if (page == 'about') {
            var aboutData = element.attributes.body.value.toString().split('<hr />');
            //console.log(aboutData[0]);
            /* body */
            aboutBody = aboutData[0];
            aboutProfiles = aboutData[1];
        }
        itemTitle = itemTitle.replace('&amp;', '&');
        if (searchedFor) {
            itemTitle = itemWithSearchHighlight(itemTitle, searchedFor);
            itemDate = itemWithSearchHighlight(itemDate, searchedFor);
            startDate = itemWithSearchHighlight(startDate, searchedFor);
            endDate = itemWithSearchHighlight(endDate, searchedFor);
            itemBody = itemWithSearchHighlight(itemBody, searchedFor);
            itemJobTitle = itemWithSearchHighlight(itemJobTitle, searchedFor);
            itemTechnology = itemWithSearchHighlight(itemTechnology, searchedFor);
            itemCompanyName = itemWithSearchHighlight(itemCompanyName, searchedFor);
            if (itemWorkType !== 'node-company') {
                itemWorkType = itemWithSearchHighlight(itemWorkType, searchedFor);
            }
        }
        itemCount++;
        switch (page) {
            case 'about':
                currentNavItem = 'about-link';
                item = "<h1>" + itemTitle + "</h1>";
                item += aboutBody;
                document.getElementById('profiles').innerHTML = aboutProfiles;
                break;
            case 'companies':
                currentNavItem = 'companies-link';
                item += "<div class=\"company-container col shadow\">";
                item += "<div class=\"company-name\">" + itemTitle + "</div>";
                item += "<div class=\"company-job-title\">" + itemJobTitle + "</div>";
                item += "<div class=\"body-container\">" + itemBody + "</div>";
                item += "<div class=\"screenshot-container\">";
                item += "<img src=" + getFullUrlByPage(imgPieces[0], page) + " class=\"company-screenshot\"  alt=\"" + element.title + " Screenshot\" />";
                item += "</div>";
                item += "<div class=\"employment-dates\">" + startDate + " - " + endDate;
                item += "<div class=\"employment-type\">" + itemWorkType + "</div>";
                item += "</div>";
                item += "</div>";
                break;
            case 'courses':
                currentNavItem = 'courses-link';
                item += "<div class=\"course-box box\">";
                item += "<h2>" + itemTitle + "</h2>";
                item += "<div>";
                /* if there is a PDF, link to it */
                if (itemPDF) {
                    item += "<a href=\"" + getFullUrlByPage(itemPDF, page) + "\" target=\"_blank\"><img src=\"" + getFullUrlByPage(imgPieces[0], page) + "\" alt=\"" + itemTitle.replace(/(<([^>]+)>)/gi, '') + "\" /></a>";
                }
                else {
                    item += "<img src=\"" + getFullUrlByPage(imgPieces[0], page) + "\" alt=\"" + itemTitle + "\" />";
                }
                item += "</div>";
                item += "<div class=\"course-date\">" + itemDate + "</div>";
                item += "</div>";
                setPageMessage('click an image to view the PDF');
                break;
            case 'projects':
                currentNavItem = 'projects-link';
                item += "<div class=\"project col\">";
                item += "<div class=\"project-title\">" + itemTitle;
                item += "<div class=\"project-company\">" + itemCompanyName + " <span class=\"project-date\">(" + itemDate + ")</span></div>";
                item += "</div>";
                item += "<div class=\"body-container\">" + itemBody + "</div>";
                /* Screenshot Section */
                if (imgPieces) {
                    screenshotCount = +imgPieces.length;
                    itemGridClass = 'project-item-grid';
                    if (screenshotCount === 2) {
                        itemGridClass = 'project-items2 project-item-grid';
                    }
                    if (screenshotCount === 1) {
                        itemGridClass = 'project-items1 project-item-grid';
                    }
                    section = "<section data-featherlight-gallery data-featherlight-filter=\"a\" class=\"" + itemGridClass + "\">";
                    var screenshotAlt_1 = [''];
                    element.relationships.field_screenshot.data.forEach(function (screenshot) {
                        screenshotAlt_1.push(screenshot.meta.alt);
                    });
                    imgAltCount = 0; // reset
                    imgPieces.forEach(function (img) {
                        projectImage = getFullUrlByPage(img, page);
                        section += "<div class=\"project-item shadow\">";
                        section += "<a href=" + projectImage + " class=\"gallery\">\n            <div class=\"project-item-desc\">" + itemWithSearchHighlight(screenshotAlt_1[imgAltCount], searchedFor) + "</div>\n            <img src=" + projectImage + " alt=" + screenshotAlt_1[imgAltCount] + " />\n            </a>";
                        section += "</div>";
                        imgAltCount++;
                    });
                    section += "</section>";
                    item += section;
                }
                /* Video Section */
                if (element.attributes.field_video_url) {
                    element.attributes.field_video_url.forEach(function (img) {
                        item += "<a href=\"" + img + "\" \n          data-featherlight=\"iframe\" \n          data-featherlight-iframe-frameborder=\"0\" \n          data-featherlight-iframe-allowfullscreen=\"true\" \n          data-featherlight-iframe-allow=\"autoplay; encrypted-media\"\n          data-featherlight-iframe-style=\"display:block;border:none;height:85vh;width:85vw;\" class=\"play-video\">Play Video<img src=\"images/play_vidoe_icon.png\" width=\"20\" /></a>";
                    });
                }
                item += "<br /><div class=\"project-technology\">" + itemTechnology + "</div>";
                item += "</div>";
                setPageMessage('click an image to enlarge it');
                break;
        }
    }); // data.data forEach
    $('#' + currentNavItem).addClass('nav-item-active');
    $('#searchSite').focus();
    $('#preloader').hide();
    if (itemCount > 0) {
        $('.container').html(item).fadeIn(300);
        $('a.gallery').featherlightGallery({
            previousIcon: '&#9664;' /* Code that is used as previous icon */,
            nextIcon: '&#9654;' /* Code that is used as next icon */,
            galleryFadeIn: 200 /* fadeIn speed when slide is loaded */,
            galleryFadeOut: 300 /* fadeOut speed before slide is loaded */
        });
        $('section').featherlight(); // must init after adding items
    }
    else {
        $('body').append("<div id=\"noRecords\" class=\"shadow\">No matches found for '" + searchedFor + "'</div>");
    }
    setItemCount(itemCount, page, prev, next);
};
/**
 * Create absolute link
 * @param {string} linkToFix - relative url
 * @param {string} page - page name
 * @return {string} - absolute url
 */
var getFullUrlByPage = function (linkToFix, page) {
    switch (page) {
        case 'companies':
            return API_base + "/sites/default/files/company-screenshot/" + linkToFix;
            break;
        case 'courses':
            if (linkToFix.indexOf('.pdf') !== -1) {
                return API_base + "/sites/default/files/award-pdf/" + linkToFix;
            }
            else {
                return API_base + "/sites/default/files/award-images/" + linkToFix;
            }
            break;
        case 'projects':
            return API_base + "/sites/default/files/project-screenshot/" + linkToFix;
            break;
    }
};
/**
 * Set/update the current page item counts
 * @param {int} count - number of items
 * @param {string} page - page name
 * @param {object=} prev - (optional) - link to previous results
 * @param {object=} next - (optional) - link to next results
 */
function setItemCount(count, page, prev, next) {
    var dataOffset = 0;
    var dataOffsetText = '';
    var totalItems = getCookie(page);
    var inputSearchBox = document.getElementById('searchSite');
    if (next) {
        var nextURL = next.href
            .replace(/%2C/g, ',')
            .replace(/%5B/g, '[')
            .replace(/%5D/g, ']');
        var startOffset = nextURL.indexOf('page[offset]') + 13;
        var endOffset = nextURL.indexOf('page[limit]') - 1;
        dataOffset = nextURL.substring(startOffset, endOffset);
    }
    /* setup pagination counts */
    var currentCount = dataOffset / pageLimit;
    if (currentCount == 1) {
        dataOffsetText = "Items " + currentCount + "-" + pageLimit * currentCount;
    }
    else {
        dataOffsetText = "Items " + (currentCount * pageLimit - pageLimit) + "-" + pageLimit * currentCount;
    }
    /* get the highest multiple of the page limit without going over the total */
    var topNumber = Math.round(+totalItems / pageLimit) * pageLimit;
    /* set the paging count on the last page */
    if (count < pageLimit && +totalItems > pageLimit) {
        dataOffsetText = "Items " + topNumber + "-" + totalItems + " ";
    }
    /* handle searching  */
    if ($('#searchSite').val()) {
        dataOffsetText = count + " " + (count == 1 ? 'Item' : 'Items') + " ";
        if (count <= pageLimit) {
            $('#searchCount').html(count + ("  " + (count == 1 ? 'Item' : 'Items')));
        }
        else {
            $('#searchCount').html(pageLimit + ("  " + (+pageLimit == 1 ? 'Item' : 'Items')));
        }
    }
    var recordCount = getTotalRecordCount(page);
    /* use pagination when the total records exceed the page limit */
    if (+recordCount < pageLimit) {
        document.getElementById('searchCount').innerHTML = "<span id=\"totalItems\">" + recordCount + "</span>\n   " + (count == 1 ? 'Item' : 'Items');
    }
    else {
        document.getElementById('searchCount').innerHTML = "<span id=\"paging-info\">" + dataOffsetText + "</span>";
        //const inputSearchBox = document.getElementById('searchSite')! as HTMLInputElement;
        //console.log('value : ' + inputSearchBox);
        var prevLink = prev
            ? "<a href=\"#\" class=\"pager-navigation\" onclick=\"getPage(getCurrentPage(), inputSearchBox.value,prev.href)\">Prev</a>"
            : "<span class=\"pager-navigation disabled\">Prev</span>";
        var nextLink = next
            ? "<a href=\"#\" class=\"pager-navigation\" onclick=\"getPage(getCurrentPage(), inputSearchBox.value,next.href)\">Next</a>"
            : "<span class=\"pager-navigation disabled\">Next</span>";
        $('#pagination').html(prevLink + "  " + nextLink);
    }
    /* add record count */
    $('#totalItems').html(recordCount);
}
/**
 * Return the total record count via the Drupal API and store the results in a cookie
 * JSON:API has a limit of 50 records
 * @param {string} page - page name
 * @return {int} - total record count
 */
var getTotalRecordCount = function (page) {
    var recordCount = getCookie(page);
    var urlForTotal = null;
    if (!recordCount) {
        switch (page) {
            case 'courses':
                urlForTotal = API_Course_Count;
                break;
            case 'companies':
                urlForTotal = API_Company_Count;
                break;
            case 'projects':
                urlForTotal = API_Project_Count;
        }
    }
    /* fetch total or use the cookie value */
    if (urlForTotal) {
        fetch(urlForTotal)
            .then(function (resp) {
            return resp.ok ? resp.json() : Promise.reject(resp.statusText);
        })
            .then(function (document) {
            recordCount = document.length;
            setCookie(page, recordCount, 1);
        });
    }
    return recordCount;
};
/**
 * Set page message
 * @param {string} msg - message text
 */
var setPageMessage = function (msg) {
    document.getElementById('msg').innerHTML = "(" + msg + ")";
};
/**
 * Get current page - defaults to "about"
 * @return {string} - page name
 */
var getCurrentPage = function () {
    if (location.pathname.indexOf('/index.html') !== -1) {
        return 'about';
    }
    if (location.pathname.indexOf('/companies.html') !== -1) {
        return 'companies';
    }
    if (location.pathname.indexOf('/courses.html') !== -1) {
        return 'courses';
    }
    if (location.pathname.indexOf('/projects.html') !== -1) {
        return 'projects';
    }
    if (location.pathname.indexOf('/contact.html') !== -1) {
        return 'contact';
    }
    // default
    return 'about';
};
/**
 * Get current page when the resources are loaded
 */
window.onload = function () {
    getPage(getCurrentPage());
};
/**
 * Cookies
 */
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}
function getCookie(cname) {
    var name = cname + '=';
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}
