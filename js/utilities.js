const fadeOut = (el) => {
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
const fadeIn = (el) => {
    el.style.opacity = 0;
    (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += 0.1) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
};
const setLoading = (loadingStatus) => {
    if (loadingStatus) {
        let preloader = document.createElement('div');
        preloader.innerHTML = `
      <div class="preloadAnimation" id="preloadAnimation">
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
        <br />Loading
      </div>`;
        document.body.append(preloader);
    }
    else {
        document.getElementById('preloadAnimation').remove();
        fadeIn(document.getElementsByClassName('container')[0]);
    }
};
export { fadeOut, fadeIn, setLoading };
