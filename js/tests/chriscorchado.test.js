const getCurrentPage = () => {
    let thisPage = window.location.pathname
        .split("/")
        .filter(function (pathnamePieces) {
        return pathnamePieces.length;
    })
        .pop();
    let pageName = "about";
    if (thisPage)
        pageName = thisPage.split(".")[0];
    if (pageName == "index" || pageName == "nodejs")
        pageName = "about";
    return pageName;
};

test('get homepage', () => {
    expect(getCurrentPage()).toMatch("about");
});