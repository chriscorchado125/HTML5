export const API_BASE = 'https://live-chriscorchadod8.pantheonsite.io';
export const MAX_ITEMS_PER_PAGE = 50;
export const SITE_SEARCH_ID = 'search-site';
export const showMessage = (msg) => {
    const userMessage = document.createElement('div');
    userMessage.id = 'user-message';
    userMessage.innerHTML = msg;
};
export const getFullUrlByPage = (linkToFix, page) => {
    let pathToResource = 'No Path Found';
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
        default:
    }
    return `${API_BASE}/sites/default/files/${pathToResource}/${linkToFix}`;
};
export const getMonthYear = (dateString) => {
    const newDate = new Date(dateString);
    return (`${newDate.toLocaleString('default', { month: 'long' })}  ${newDate.getFullYear().toString()}`);
};
export const cleanURL = (urlToClean) => {
    let fixedURL = '';
    const strings = urlToClean.split(' ');
    strings.forEach((element) => {
        if (element)
            fixedURL += element.replace(/$\n^\s*/gm, '');
    });
    return fixedURL;
};
export const animateLogo = (logoID, animationID) => {
    const logoElement = document.getElementById(logoID);
    const checkExist = setInterval(function () {
        if (logoElement) {
            if (animationID) {
                logoElement.setAttribute('src', `https://chriscorchado.com/images/chriscorchado-initials-logo-animated-${animationID}.gif`);
            }
            else {
                logoElement.setAttribute('src', 'https://chriscorchado.com/images/chriscorchado-initials-logo.png');
            }
            clearInterval(checkExist);
        }
    }, 100);
};
