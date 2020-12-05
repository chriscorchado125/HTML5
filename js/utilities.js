export const API_BASE = 'https://chriscorchado.com/drupal8';
export const MAX_ITEMS_PER_PAGE = 50;
export const SITE_SEARCH_ID = 'search-site';
export const fadeOut = (el) => {
    el.style.opacity = 1;
    (function fade() {
        if ((el.style.opacity -= 0.2) < 0) {
            el.style.display = 'none';
        }
        else {
            requestAnimationFrame(fade);
        }
    })();
};
export const fadeIn = (el) => {
    el.style.opacity = 0;
    (function fade() {
        let val = parseFloat(el.style.opacity);
        if (!((val += 0.2) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
};
export const getCurrentPage = () => {
    const thisPage = window.location.pathname
        .split('/')
        .filter(function (pathnamePieces) {
        return pathnamePieces.length;
    })
        .pop();
    let pageName = '';
    if (thisPage)
        pageName = thisPage.split('.')[0];
    if (pageName === 'index' || pageName === 'html5' || !pageName)
        pageName = 'about';
    return pageName;
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
    }
    return `${API_BASE}/sites/default/files/${pathToResource}/${linkToFix}`;
};
export const getMonthYear = (dateString) => {
    const newDate = new Date(dateString);
    return (newDate.toLocaleString('default', { month: 'long' }) +
        ' ' +
        newDate.getFullYear().toString());
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
export const setLoading = (loadingStatus) => {
    if (loadingStatus) {
        const preloader = document.createElement('div');
        preloader.innerHTML = `
      <div class='preloadAnimation' id='preloadAnimation'>
        <div class='bounce1'></div>
        <div class='bounce2'></div>
        <div class='bounce3'></div>
        <br />Loading
      </div>`;
        document.body.append(preloader);
    }
    else {
        const preloadAnimation = document.getElementById('preloadAnimation');
        preloadAnimation.remove();
        if (document.getElementsByClassName('container')[0]) {
            const mainContainer = document.getElementsByClassName('container')[0];
            fadeIn(mainContainer);
        }
        if (document.getElementsByClassName('container')[1]) {
            const dataContainer = document.getElementsByClassName('container')[1];
            fadeIn(dataContainer);
        }
    }
};
