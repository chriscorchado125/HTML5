const getCurrentPage = () => {
    const thisPage = window.location.pathname
        .split('/')
        .filter((pathnamePieces) => {
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
export default getCurrentPage;
