'use strict';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var API_BASE = 'https://chriscorchado.com/drupal8';
var MAX_ITEMS_PER_PAGE = 50;
var SITE_SEARCH_ID = 'searchSite';
$('#navigation').load('includes/nav.html');
$('#footer').load('includes/footer.html');
var setLoading = function (loadingStatus) {
    if (loadingStatus) {
        var preloader = document.createElement('div');
        preloader.innerHTML = "\n      <div class=\"preloadAnimation\" id=\"preloadAnimation\">\n        <div class=\"bounce1\"></div>\n        <div class=\"bounce2\"></div>\n        <div class=\"bounce3\"></div>\n        <br />Loading\n      </div>";
        document.body.append(preloader);
    }
    else {
        document.getElementById('preloadAnimation').remove();
        fadeIn(document.getElementsByClassName('container')[0]);
    }
};
var getPage = function (page, search, pagingURL) { return __awaiter(void 0, void 0, void 0, function () {
    var data, _a, passedInCount;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                data = null;
                setLoading(true);
                if (search) {
                }
                if (!(page == 'contact')) return [3, 3];
                if (!(location.toString().indexOf('submitted') == -1)) return [3, 2];
                return [4, fetch(API_BASE + "/contact/feedback")
                        .then(function (resp) {
                        return resp.ok ? resp.text() : Promise.reject(resp.statusText);
                    })
                        .then(function (page) {
                        data = page.replace(/\/drupal8/g, API_BASE);
                        var form = data.substr(data.indexOf('<form'), data.indexOf('</form>'));
                        form = form.substr(0, form.indexOf('</form>') + 8);
                        form = form.replace('Your email address', 'Email');
                        var script = data.substr(data.indexOf('<script type="application/json" data-drupal-selector="drupal-settings-json">'), data.indexOf('></script>'));
                        script = script.substr(0, script.indexOf('</script>') + 9);
                        data = "<h1>Contact</h1>" + form + " " + script;
                    })
                        .catch(function (error) {
                        alert("Sorry an error has occurred: " + error);
                    })];
            case 1:
                _b.sent();
                _b.label = 2;
            case 2:
                renderPage(data, page);
                setLoading(false);
                return [2, false];
            case 3:
                if (!pagingURL) return [3, 5];
                return [4, getData(pagingURL)];
            case 4:
                data = _b.sent();
                return [3, 23];
            case 5:
                _a = page;
                switch (_a) {
                    case 'about': return [3, 6];
                    case 'companies': return [3, 8];
                    case 'courses': return [3, 13];
                    case 'projects': return [3, 18];
                }
                return [3, 23];
            case 6: return [4, getData(API_BASE + "/jsonapi/node/page?fields[node--page]=id,title,body&\n              filter[id][operator]=CONTAINS&\n              filter[id][value]=ca23f416-ad70-41c2-9228-52ba6577abfe")];
            case 7:
                data = _b.sent();
                return [3, 23];
            case 8:
                if (!search) return [3, 10];
                return [4, getData(API_BASE + "/jsonapi/node/company?filter[or-group][group][conjunction]=OR&\n                filter[field_company_name][operator]=CONTAINS&\n                filter[field_company_name][value]=" + search + "&\n                filter[field_company_name][condition][memberOf]=or-group&\n                filter[field_job_title][operator]=CONTAINS&\n                filter[field_job_title][value]=" + search + "&\n                filter[field_job_title][condition][memberOf]=or-group&\n                filter[body.value][operator]=CONTAINS&\n                filter[body.value][value]=" + search + "&\n                filter[body.value][condition][memberOf]=or-group&\n                sort=-field_end_date&\n                include=field_company_screenshot&\n                page[limit]=" + MAX_ITEMS_PER_PAGE)];
            case 9:
                data = _b.sent();
                return [3, 12];
            case 10: return [4, getData(API_BASE + "/jsonapi/node/company?sort=-field_end_date&\n                include=field_company_screenshot&\n                page[limit]=" + MAX_ITEMS_PER_PAGE)];
            case 11:
                data = _b.sent();
                _b.label = 12;
            case 12: return [3, 23];
            case 13:
                if (!search) return [3, 15];
                return [4, getData(API_BASE + "/jsonapi/node/awards?filter[or-group][group][conjunction]=OR&\n                filter[title][operator]=CONTAINS&\n                filter[title][value]=" + search + "&\n                filter[title][condition][memberOf]=or-group&\n                filter[field_award_date][operator]=CONTAINS&\n                filter[field_award_date][value]=" + search + "&\n                filter[field_award_date][condition][memberOf]=or-group&\n                sort=-field_award_date&\n                include=field_award_pdf,field_track_image,field_award_images&\n                page[limit]=" + MAX_ITEMS_PER_PAGE)];
            case 14:
                data = _b.sent();
                return [3, 17];
            case 15: return [4, getData(API_BASE + "/jsonapi/node/awards?sort=-field_award_date&\n                include=field_award_pdf,field_track_image,field_award_images&\n                page[limit]=" + MAX_ITEMS_PER_PAGE)];
            case 16:
                data = _b.sent();
                _b.label = 17;
            case 17: return [3, 23];
            case 18:
                if (!search) return [3, 20];
                return [4, getData(API_BASE + "/jsonapi/node/project?filter[or-group][group][conjunction]=OR&\n              filter[title][operator]=CONTAINS&\n              filter[title][value]=" + search + "&\n              filter[title][condition][memberOf]=or-group&\n              filter[taxonomy_term--tags][path]=field_project_technology.name&\n              filter[taxonomy_term--tags][operator]=CONTAINS&\n              filter[taxonomy_term--tags][value]=" + search + "&\n              filter[taxonomy_term--tags][condition][memberOf]=or-group&\n              filter[field_company.title][operator]=CONTAINS&\n              filter[field_company.title][value]=" + search + "&\n              filter[field_company.title][condition][memberOf]=or-group&\n              filter[field_screenshot.meta.alt][operator]=CONTAINS&\n              filter[field_screenshot.meta.alt][value]=" + search + "&\n              filter[field_screenshot.meta.alt][condition][memberOf]=or-group&\n              filter[field_date][operator]=CONTAINS&filter[field_date][value]=" + search + "&\n              filter[field_date][condition][memberOf]=or-group&\n              sort=-field_date&\n              include=field_project_technology,field_company,field_screenshot&fields[node--company]=field_company_name,field_video_url&\n              fields[node--project]=title,body,field_date,field_screenshot,field_project_technology,field_company,field_video_url&\n              page[limit]=" + MAX_ITEMS_PER_PAGE)];
            case 19:
                data = _b.sent();
                return [3, 22];
            case 20: return [4, getData(API_BASE + "/jsonapi/node/project?sort=-field_date&\n                include=field_project_technology,field_company,field_screenshot&\n                fields[node--company]=field_company_name,field_video_url&\n                fields[node--project]=title,body,field_date,field_screenshot,field_project_technology,field_company,field_video_url&\n                page[limit]=" + MAX_ITEMS_PER_PAGE)];
            case 21:
                data = _b.sent();
                _b.label = 22;
            case 22: return [3, 23];
            case 23:
                passedInCount = {
                    currentCount: document.getElementById('lastCount')
                        ? document.getElementById('lastCount').textContent
                        : 1,
                };
                data = __assign(__assign({}, data), { passedInCount: passedInCount });
                if (data.data.length) {
                    renderPage(data, page, search, data.links.next, data.links.prev);
                }
                else {
                    updateInterface(search);
                }
                return [2];
        }
    });
}); };
var updateInterface = function (search) {
    var action = 'none';
    if (!search) {
        action = '';
        document.getElementById('searchBtn').style.display = '';
    }
    var uiElements = ['preloader', 'searchCount', 'paging-info', 'pagination', 'msg'];
    uiElements.forEach(function (element) {
        if (document.getElementById(element)) {
            document.getElementById(element).style.display = action;
        }
    });
    noRecordsFound('noRecords', search, 'navigation', 'No matches found for');
};
var cleanURL = function (urlToClean) {
    var fixedURL = '';
    var strings = urlToClean.split(' ');
    strings.forEach(function (element) {
        if (element)
            fixedURL += element.replace(/$\n^\s*/gm, '');
    });
    return fixedURL;
};
var getData = function (dataURL) {
    var result = $.ajax({
        dataType: 'json',
        accepts: {
            json: 'application/vnd.api+json',
        },
        url: cleanURL(dataURL),
        type: 'GET',
    });
    return result;
};
var searchClear = function (searchTextBoxID) {
    var inputSearchBox = document.getElementById(searchTextBoxID);
    if (inputSearchBox.value !== '') {
        inputSearchBox.value = '';
        getPage(getCurrentPage());
        updateInterface();
    }
};
var searchFilter = function (event) {
    var charCode = event.keyCode || event.which;
    return ((charCode >= 65 && charCode <= 122) ||
        (charCode >= 96 && charCode <= 105) ||
        (charCode >= 48 && charCode <= 57) ||
        charCode == 16 ||
        charCode == 32);
};
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
        if (searchString_1.indexOf('<ul>') !== -1) {
            var listItem_1 = '';
            var searchWithHTML = searchString_1.replace('<ul>', '').replace('</ul>', '');
            searchStringArray = searchWithHTML.split('<li>');
            searchStringArray.forEach(function (element) {
                if (element.length > 3) {
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
var formSubmitted = function (seconds) {
    var countDown = document.createElement('div');
    countDown.style.padding = '50px';
    countDown.innerHTML = "<h2>Thanks For Your Submission</h2>\n    <h4>Redirecting to the homepage in <span id=\"secondCountDown\">" + seconds + "</span> seconds</h4>\n    <img id=\"timer\" src=\"https://chriscorchado.com/images/timer.gif\" />";
    document.getElementsByClassName('container')[0].append(countDown);
    var updateCountDown = setInterval(function () {
        seconds--;
        document.getElementById('secondCountDown').innerHTML = seconds.toString();
        if (seconds === 0) {
            clearInterval(updateCountDown);
            window.location.replace(location.href.substring(0, location.href.lastIndexOf('/') + 1));
        }
    }, 1000);
};
var getMonthYear = function (dateString) {
    var newDate = new Date(dateString);
    return (newDate.toLocaleString('default', { month: 'long' }) +
        ' ' +
        newDate.getFullYear().toString());
};
var setPageHTML = function (values) {
    var page = values[0];
    var data = values[1];
    var itemTitle = values[2];
    var itemJobTitle = values[3];
    var itemBody = values[4];
    var imgPieces = values[5];
    var startDate = values[6];
    var endDate = values[7];
    var itemTrackImage = values[8];
    var itemPDF = values[9];
    var itemDate = values[10];
    var itemCompanyName = values[11];
    var itemTechnology = values[12];
    var searchedFor = values[13];
    var includedTechnologyItem = values[14];
    switch (page) {
        case 'about':
            document.getElementById('search-container').style.display = 'none';
            document.getElementById('logo').getElementsByTagName('img')[0].style.border =
                '1px dashed #7399EA';
            var aboutData = data.attributes.body.value.toString().split('<hr />');
            document.getElementById('profiles').innerHTML = aboutData[1];
            return "<h1>" + itemTitle + "</h1> " + aboutData[0];
            break;
        case 'contact':
            if (location.toString().indexOf('/contact.html?submitted=true') !== -1) {
                formSubmitted(5);
            }
            else {
                $('.container').html(data.toString());
                $('#contact-link').addClass('nav-item-active');
                var webLocation = document.getElementById('edit-field-site-0-value');
                webLocation.value = location.toString();
                $('#edit-mail').focus();
            }
            break;
        case 'companies':
            return "<div class=\"company-container col shadow\">\n\n          <div class=\"company-name\">" + itemTitle + "</div>\n          <div class=\"company-job-title\">" + itemJobTitle + "</div>\n          <div class=\"body-container\">" + itemBody + "</div>\n\n          <div class=\"screenshot-container\">\n            <img loading=lazy src=" + getFullUrlByPage(imgPieces[0], page) + " \n            class=\"company-screenshot\" \n            alt=\"" + data.attributes.title + " Screenshot\" \n            title=\"" + data.attributes.title + " Screenshot\"/>\n          </div>\n\n          <div class=\"employment-dates\">" + startDate + " - " + endDate + "</div>\n        </div>";
            break;
        case 'courses':
            var item_1 = "<div class=\"course-box box\">\n          <h2>" + itemTitle + "</h2>\n\n          <div>\n            <img loading=lazy src=\"" + getFullUrlByPage(imgPieces[0], page) + "\" \n              alt=\"" + itemTitle.replace(/(<([^>]+)>)/gi, '') + "\" \n              title=\"" + itemTitle.replace(/(<([^>]+)>)/gi, '') + "\" />\n          </div>\n\n          <div class=\"course-wrapper\">\n\n            <span class=\"course-date\">" + itemDate + "</span>\n\n            <span class=\"course-links\">\n              <a href=\"" + getFullUrlByPage(itemPDF, page) + "\" target=\"_blank\">\n                <img loading=lazy src=\"https://chriscorchado.com/images/pdfIcon.jpg\" height=\"25\" \n                title=\"View the PDF Certificate\" alt=\"View the PDF Certificate\"/>\n              </a>\n            </span>";
            if (itemTrackImage) {
                item_1 += "<span class=\"course-links\">\n            <a href=\"" + getFullUrlByPage(itemTrackImage, page) + "\" data-featherlight=\"image\">\n              <img loading=lazy src=\"https://chriscorchado.com/images/linkedIn-track.png\" height=\"25\" \n              title=\"View the Courses in the Track\" alt=\"View the Courses in the Track\" />\n            </a>\n          </span>";
            }
            return (item_1 += "</div></div>");
            break;
        case 'projects':
            var imgAltCount_1 = 0;
            item_1 = "<div class=\"project col\">\n        <div class=\"project-title\">" + itemTitle + "</div>\n        <div class=\"project-company\">" + itemCompanyName + " <span class=\"project-date\">(" + itemDate + ")</span></div> \n        <div class=\"body-container\">" + itemBody + "</div>";
            if (imgPieces) {
                var itemGridClass = "project-item-grid project-items" + data.relationships.field_screenshot.data.length;
                var section_1 = "<section data-featherlight-gallery data-featherlight-filter=\"a\" class=\"" + itemGridClass + "\">";
                var screenshotAlt_1 = new Array();
                data.relationships.field_screenshot.data.forEach(function (screenshot) {
                    screenshotAlt_1.push(screenshot.meta.alt);
                });
                imgAltCount_1 = 0;
                imgPieces.forEach(function (img) {
                    var pieces = img.split(',');
                    pieces.forEach(function (item) {
                        var projectImage = getFullUrlByPage(item, page);
                        section_1 += "<div class=\"project-item shadow\" title='" + screenshotAlt_1[imgAltCount_1] + "'>\n            \n              <a href=" + projectImage + " class=\"gallery\">\n                <div class=\"project-item-desc\">\n                  " + itemWithSearchHighlight(screenshotAlt_1[imgAltCount_1], searchedFor) + "\n                </div>\n\n                <img loading=lazy src='" + projectImage + "' alt='" + screenshotAlt_1[imgAltCount_1] + "' \n                  title='" + screenshotAlt_1[imgAltCount_1] + "' />\n              </a>\n            </div>";
                        imgAltCount_1++;
                    });
                });
                section_1 += "</section>";
                item_1 += section_1;
            }
            if (data.attributes.field_video_url) {
                data.attributes.field_video_url.forEach(function (img) {
                    item_1 += "<span title=\"Play Video\"><a href=\"" + img + "\" \n          data-featherlight=\"iframe\" \n          data-featherlight-iframe-frameborder=\"0\" \n          data-featherlight-iframe-allowfullscreen=\"true\" \n          data-featherlight-iframe-allow=\"autoplay; encrypted-media\"\n          data-featherlight-iframe-style=\"display:block;border:none;height:85vh;width:85vw;\" class=\"play-video\">\n            Play Video <img loading=lazy src=\"https://chriscorchado.com/images/play_vidoe_icon.png\" alt=\"Play Video\" width=\"20\" />\n          </a></span>";
                });
            }
            item_1 += "<div class=\"project-technology\">" + itemTechnology.slice(0, -2) + "</div>";
            item_1 += "</div>";
            return item_1;
            break;
    }
};
var noRecordsFound = function (noRecordID, search, appendToID, msg) {
    if (document.getElementById(noRecordID)) {
        document.getElementById(noRecordID).remove();
    }
    if (!document.getElementById(noRecordID) && search) {
        var notFound = document.createElement('div');
        notFound.id = noRecordID;
        notFound.innerHTML = msg + " '" + search + "'";
        document.getElementById(appendToID).appendChild(notFound);
        document.getElementById('preloadAnimation').remove();
        $('.container').hide();
    }
    else {
        $('.container').fadeIn();
    }
};
var getIncludedData = function (data) {
    var includedAssetFilename = [''];
    var includedCompanyName = [''];
    var includedTechnologyName = [''];
    var includedTechnologyIcon = [''];
    data.included.forEach(function (included_element) {
        if (included_element.attributes.description) {
            var iconFileNamePath = /"(.*?)"/.exec(included_element.attributes.description.value);
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
        includedTechnologyIcon,
    ];
};
var getElementRelationships = function (element, includedAssetFilename, includedCompanyName, includedTechnologyName, includedTechnologyIcon) {
    var imgPieces = [];
    var itemPDF = '';
    var itemTrackImage = '';
    var itemCompanyName = '';
    var itemTechnology = '';
    var itemTechnologyIcon = '';
    var includedTechnologyItem = [];
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
        for (var i = 0; i < element.relationships.field_screenshot.data.length; i++) {
            imgPieces.push(includedAssetFilename[element.relationships.field_screenshot.data[i].id]);
        }
    }
    if (element.relationships.field_project_technology &&
        element.relationships.field_project_technology.data) {
        for (var i = 0; i < element.relationships.field_project_technology.data.length; i++) {
            itemTechnology +=
                includedTechnologyName[element.relationships.field_project_technology.data[i].id] + ', ';
            itemTechnologyIcon +=
                includedTechnologyIcon[element.relationships.field_project_technology.data[i].id] + ', ';
            var technologyItem = {
                name: includedTechnologyName[element.relationships.field_project_technology.data[i].id],
                image: includedTechnologyIcon[element.relationships.field_project_technology.data[i].id],
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
        includedTechnologyItem,
    ];
};
var renderPage = function (data, page, searchedFor, next, prev) {
    var pageIsSearchable = false;
    if (page == 'contact') {
        setPageHTML([page, data]);
        return;
    }
    var includedCompanyName = [''];
    var includedAssetFilename = [''];
    var includedTechnologyName = [''];
    var includedTechnologyIcon = [''];
    if (data.included) {
        var allIncludedData = getIncludedData(data);
        includedCompanyName = allIncludedData[0];
        includedAssetFilename = allIncludedData[1];
        includedTechnologyName = allIncludedData[2];
        includedTechnologyIcon = allIncludedData[3];
    }
    var item = '', itemBody = '', currentNavItem = '', itemTitle = '', itemDate = '', startDate = '', endDate = '', itemJobTitle = '', itemTechnology = '', itemTechnologyIcon = '', itemCompanyName = '', itemWorkType = '', itemPDF = '', itemTrackImage = '';
    var itemCount = 0;
    var imgPieces = [''];
    var includedTechnologyItem = [];
    data.data.forEach(function (element) {
        itemTitle = element.attributes.title;
        itemBody = element.attributes.body ? element.attributes.body.value : '';
        itemDate = element.attributes.field_date || element.attributes.field_award_date;
        itemJobTitle = element.attributes.field_job_title;
        startDate = element.attributes.field_start_date;
        endDate = element.attributes.field_end_date;
        itemWorkType = element.attributes.field_type == 'full' ? 'Full-Time' : 'Contract';
        itemTechnology = '';
        itemTrackImage = '';
        imgPieces = [];
        includedTechnologyItem = [];
        if (element.relationships) {
            var relationshipData = getElementRelationships(element, includedAssetFilename, includedCompanyName, includedTechnologyName, includedTechnologyIcon);
            if (!imgPieces.includes(relationshipData[0].toString())) {
                imgPieces.push(relationshipData[0].toString());
            }
            itemPDF = relationshipData[1].toString();
            if (relationshipData[2])
                itemTrackImage = relationshipData[2].toString();
            itemCompanyName = relationshipData[3].toString();
            itemTechnology += relationshipData[4].toString();
            itemTechnologyIcon += relationshipData[5].toString();
            includedTechnologyItem.push(relationshipData[6]);
        }
        if (itemDate) {
            if (page == 'projects')
                itemDate = itemDate.split('-')[0];
            if (page == 'courses')
                itemDate = getMonthYear(itemDate);
        }
        if (startDate)
            startDate = getMonthYear(startDate);
        if (endDate)
            endDate = getMonthYear(endDate);
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
        var allValues = [
            page,
            element,
            itemTitle,
            itemJobTitle,
            itemBody,
            imgPieces,
            startDate,
            endDate,
            itemTrackImage,
            itemPDF,
            itemDate,
            itemCompanyName,
            itemTechnology,
            searchedFor,
            includedTechnologyItem,
        ];
        switch (page) {
            case 'about':
                item = setPageHTML(allValues);
                break;
            case 'companies':
                item += setPageHTML(allValues);
                break;
            case 'courses':
                item += setPageHTML(allValues);
                break;
            case 'projects':
                item += setPageHTML(allValues);
                break;
        }
    });
    switch (page) {
        case 'about':
            currentNavItem = 'about-link';
            break;
        case 'companies':
            currentNavItem = 'companies-link';
            pageIsSearchable = true;
            break;
        case 'courses':
            currentNavItem = 'courses-link';
            pageIsSearchable = true;
            break;
        case 'projects':
            currentNavItem = 'projects-link';
            pageIsSearchable = true;
            break;
    }
    $('#' + currentNavItem).addClass('nav-item-active');
    $('.container').html(item);
    if (pageIsSearchable) {
        document.getElementById('search-container').style.display = 'block';
    }
    $('a.gallery').featherlightGallery({
        previousIcon: '&#9664;',
        nextIcon: '&#9654;',
        galleryFadeIn: 200,
        galleryFadeOut: 300,
    });
    setPagination(itemCount, data.passedInCount.currentCount, prev, next);
    setLoading(false);
};
var getFullUrlByPage = function (linkToFix, page) {
    var pathToResource = 'No Path Found';
    switch (page) {
        case 'companies':
            pathToResource = 'company-screenshot';
            break;
        case 'courses':
            if (linkToFix.indexOf('.pdf') !== -1) {
                pathToResource = 'award-pdf';
            }
            else {
                pathToResource = 'award-images';
            }
            break;
        case 'projects':
            pathToResource = 'project-screenshot';
            break;
    }
    return API_BASE + "/sites/default/files/" + pathToResource + "/" + linkToFix;
};
var getSearchCount = function (count, searchCountID) {
    if ($("#" + SITE_SEARCH_ID).val()) {
        if (count <= MAX_ITEMS_PER_PAGE) {
            document.getElementById(searchCountID).innerHTML =
                count + ("  " + (count == 1 ? 'Item' : 'Items'));
        }
        else {
            document.getElementById(searchCountID).innerHTML =
                MAX_ITEMS_PER_PAGE + ("  " + (+MAX_ITEMS_PER_PAGE == 1 ? 'Item' : 'Items'));
        }
        return count + " " + (count == 1 ? 'Item' : 'Items') + " ";
    }
};
var getSearchOffset = function (link) {
    var nextURL = link.href.replace(/%2C/g, ',').replace(/%5B/g, '[').replace(/%5D/g, ']');
    return nextURL.substring(nextURL.search('offset') + 8, nextURL.search('limit') - 6);
};
var setPagination = function (count, paginationTotal, prev, next) {
    var dataOffset = 0;
    var prevLink = '';
    var nextLink = '';
    if (next)
        dataOffset = getSearchOffset(next);
    var dataOffsetText = getSearchCount(count, 'searchCount');
    if (!next && !prev) {
        document.getElementById('searchCount').innerHTML = "<span id=\"totalItems\">" + count + "</span>\n   " + (count == 1 ? 'Item' : 'Items');
    }
    else {
        var currentCount = +dataOffset / MAX_ITEMS_PER_PAGE;
        if (count == dataOffset) {
            dataOffsetText = "Items 1-<span id=\"lastCount\">" + MAX_ITEMS_PER_PAGE + "</span>";
        }
        else {
            if (currentCount !== 0) {
                dataOffsetText = "Items " + (currentCount * MAX_ITEMS_PER_PAGE - MAX_ITEMS_PER_PAGE) + "-<span id=\"lastCount\">" + currentCount * MAX_ITEMS_PER_PAGE + "</span>";
            }
            else {
                dataOffsetText = "Items " + paginationTotal + "-<span id=\"lastCount\">" + (+paginationTotal + count) + "</span>";
            }
        }
        document.getElementById('searchCount').innerHTML = "<span id=\"paging-info\">" + dataOffsetText + "</span>";
        prevLink = prev
            ? "<a href=\"#\" class=\"pager-navigation\" title=\"View the previous page\" \n          onclick=\"getPage(getCurrentPage(), document.getElementById('" + SITE_SEARCH_ID + "').value,'" + prev.href + "')\">Prev</a>"
            : "<span class=\"pager-navigation disabled\" title=\"There is no previous page available\">Prev</span>";
        nextLink = next
            ? "<a href=\"#\" class=\"pager-navigation\" title=\"View the next page\" \n          onclick=\"getPage(getCurrentPage(), document.getElementById('" + SITE_SEARCH_ID + "').value,'" + next.href + "')\">Next</a>"
            : "<span class=\"pager-navigation disabled\" title=\"There is no next page available\">Next</span>";
    }
    if (count < MAX_ITEMS_PER_PAGE && paginationTotal === 1) {
        $('#pagination').hide();
    }
    else {
        $('#pagination').html(prevLink + "  " + nextLink);
    }
};
var updateMenuPages = function (currentPage, targetContainer) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, fetch(API_BASE + "/api/menu_items/main?_format=json")
                    .then(function (resp) {
                    return resp.ok ? resp.json() : Promise.reject(resp.statusText);
                })
                    .then(function (pageData) {
                    var pageName = '';
                    var pageLink = '';
                    var homepageStyle = '';
                    if (currentPage == 'about') {
                        homepageStyle = 'border: 1px dashed rgb(115, 153, 234);';
                    }
                    var generatedPageLinks = "<a href=\"index.html\" class=\"navbar-brand\" id=\"logo\" style=\"" + homepageStyle + "\">\n        <img src=\"./images/chriscorchado-initials-logo.png\" title=\"Home\" alt=\"Home\">\n      </a>";
                    for (var page in pageData) {
                        pageName = pageData[page].title;
                        if (pageName == 'Home' || pageName == 'About' || !pageData[page].enabled) {
                            continue;
                        }
                        var activeNavItem = '';
                        if (currentPage == pageName.toLowerCase()) {
                            activeNavItem = 'nav-item-active';
                        }
                        pageLink = pageName;
                        if (pageName == 'Companies')
                            pageName = 'History';
                        generatedPageLinks += "<a href=\"" + pageLink.toLowerCase() + ".html\" \n        class=\"nav-item nav-link " + activeNavItem + "\" \n        title=\"" + pageName + "\" \n        id=\"" + pageName.toLowerCase() + "-link\">" + pageName + "</a>";
                    }
                    document.getElementById(targetContainer).innerHTML = generatedPageLinks;
                })
                    .catch(function (error) {
                    alert("Sorry an error has occurred: " + error);
                })];
            case 1:
                _a.sent();
                return [2];
        }
    });
}); };
var getCurrentPage = function () {
    var thisPage = window.location.pathname
        .split('/')
        .filter(function (pathnamePieces) {
        return pathnamePieces.length;
    })
        .pop();
    var pageName = thisPage.split('.')[0];
    if (pageName == 'index' || pageName == 'html5')
        pageName = 'about';
    return pageName;
};
var debounce = function (func, wait) {
    var timeout;
    return function executedFunction() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var later = function () {
            timeout = null;
            func.apply(void 0, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
var debounceMe = debounce(function () {
    var inputSearchBox = document.getElementById(SITE_SEARCH_ID);
    getPage(getCurrentPage(), inputSearchBox.value);
    updateInterface();
}, 500);
var fadeOut = function (el) {
    el.style.opacity = 1;
    (function fade() {
        if ((el.style.opacity -= 0.1) < 0) {
            el.style.display = 'none';
        }
        else {
            requestAnimationFrame(fade);
        }
    })();
};
var fadeIn = function (el) {
    el.style.opacity = 0;
    (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += 0.1) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
};
window.onload = function () {
    getPage(getCurrentPage());
};
//# sourceMappingURL=chriscorchado.js.map