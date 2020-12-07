export const formSubmitted = (seconds) => {
    const countDown = document.createElement('div');
    countDown.style.padding = '50px';
    let theseSeconds = seconds;
    countDown.innerHTML = `<h2>Thanks For Your Submission</h2>
    <h4>Redirecting to the homepage in <span id="secondCountDown">${theseSeconds}</span> seconds</h4>
    <img id="timer" src="https://chriscorchado.com/images/timer.gif" />`;
    document.getElementsByClassName('container')[0].append(countDown);
    const updateCountDown = setInterval(function () {
        theseSeconds--;
        const secondCountDown = document.getElementById('secondCountDown');
        secondCountDown.innerHTML = theseSeconds.toString();
        if (theseSeconds === 0) {
            clearInterval(updateCountDown);
            window.location.replace(location.href.substring(0, location.href.lastIndexOf('/') + 1));
        }
    }, 1000);
};
