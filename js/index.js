import Slider from './components/slider';

(function () {
    const sliderElement = document.querySelector("[data-slider]");
    const sliderOptions = {};
    const sliderObj = new Slider(sliderElement, sliderOptions);
})();
