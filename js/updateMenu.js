var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { showMessage } from './utilities';
export const updateMenuPages = (baseURL, currentPage, targetContainer) => __awaiter(void 0, void 0, void 0, function* () {
    yield fetch(`${baseURL}/api/menu_items/main?_format=json`)
        .then((resp) => {
        return resp.ok ? resp.json() : Promise.reject(resp.statusText);
    })
        .then((pageData) => {
        let pageName = '';
        let pageLink = '';
        let homepageStyle = '';
        if (currentPage === 'about') {
            homepageStyle = 'border: 1px dashed rgb(115, 153, 234)';
        }
        let generatedPageLinks = `<a href='index.html' class='navbar-brand' id='logo' style='${homepageStyle}'>
        <img src='./images/chriscorchado-initials-logo.png' title='Home' alt='Home' id="logo-image">
      </a>`;
        for (const page in pageData) {
            pageName = pageData[page].title;
            if ((pageName !== 'Home' && pageName !== 'About') || pageData[page].enabled) {
                let activeNavItem = '';
                if (currentPage === pageName.toLowerCase()) {
                    activeNavItem = 'nav-item-active';
                }
                pageLink = pageName;
                if (pageName === 'Companies')
                    pageName = 'History';
                generatedPageLinks += `<a href='${pageLink.toLowerCase()}.html'
          class='nav-item nav-link ${activeNavItem}'
          title='${pageName}'
          id='${pageName.toLowerCase()}-link'>${pageName}</a>`;
            }
        }
        const targetContainerEL = document.getElementById(targetContainer);
        targetContainerEL.innerHTML = generatedPageLinks;
    })
        .catch((error) => {
        showMessage(`Sorry an error has occurred: ${error}`);
    });
});
