export default class Slider {
    #root;
    #slides;
    #firstNodeClone;
    #lastNodeClone;
    #initialLength = 0;
    #currentIndex = 0;
    #offsetWidth;

    constructor(root, options) {
        this.#root = root;
        this.#slides = [];

        this.#getSlides();
        this.#slides.forEach((node, index) => node.setAttribute('data-slider-index', index));
        this.#currentIndex = 0;
        this.#initialLength = this.#slides.length - 1;
        this.#clone();

        const currentStyles = this.#slides[this.#currentIndex].currentStyle || window.getComputedStyle(this.#slides[this.#currentIndex]);
        const margins = parseFloat(currentStyles.marginLeft) + parseFloat(currentStyles.marginRight);
        this.#offsetWidth = this.#slides[this.#currentIndex].clientWidth + margins;

        document.querySelector('[data-slider-control="next"]')
            .addEventListener('click', this.nextSlide);
        document.querySelector('[data-slider-control="prev"]')
            .addEventListener('click', this.prevSlide);

        this.#root.addEventListener('transitionend', () => {
            if (this.#currentIndex > this.#initialLength) {
                this.#root.style.transition = 'none';
                this.#currentIndex = 0;
                this.#root.style.transform = `translateX(${-this.#currentIndex * this.#offsetWidth}px)`;
            }

            if (this.#currentIndex <= -1) {
                this.#root.style.transition = 'none';
                this.#currentIndex = this.#initialLength;
                this.#root.style.transform = `translateX(${-this.#currentIndex * this.#offsetWidth}px)`;
            }
        });
    }

    #getSlides() {
        this.#slides = Array.from(this.#root.querySelectorAll('[data-slider-item]'));
    }

    #clone() {
        const slidesLength = this.#slides.length;
        this.#firstNodeClone = this.#slides.slice();
        this.#lastNodeClone = this.#slides.slice();

        this.#lastNodeClone.reverse().forEach((node, index) => {
            const cloneNode = node.cloneNode(true);
            cloneNode.setAttribute('data-slider-index', -Math.abs(index + 1));
            this.#root.prepend(cloneNode);
        });

        this.#firstNodeClone.forEach((node, index) => {
            const cloneNode = node.cloneNode(true);
            cloneNode.setAttribute('data-slider-index', Math.abs(slidesLength + index));
            this.#root.append(cloneNode);
        });
    }

    nextSlide = () => {
        if (this.#currentIndex >= this.#slides.length) return;

        this.#currentIndex++;
        this.#root.style.transition = `transform .3s`;
        this.#root.style.transform = `translateX(${-this.#currentIndex * this.#offsetWidth}px)`;
    }

    prevSlide = () => {
        if (this.#currentIndex < -1) return;
        this.#currentIndex--;
        this.#root.style.transition = `transform .3s`;
        this.#root.style.transform = `translateX(${-this.#currentIndex * this.#offsetWidth}px)`;
    }
}