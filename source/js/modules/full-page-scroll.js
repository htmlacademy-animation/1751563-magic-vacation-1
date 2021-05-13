import throttle from 'lodash/throttle';
import startLetterAnimation from './letter-by-letter-animation';

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 2000;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);

    this.activeScreen = 0;
    this.oldActiveScreen = -1;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
    this.onLoadHandler = this.loadResource.bind(this);
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);
    window.addEventListener(`load`, this.onLoadHandler);

    this.onUrlHashChanged();
  }

  onScroll(evt) {
    const currentPosition = this.activeScreen;
    this.reCalculateActiveScreenPosition(evt.deltaY);
    if (currentPosition !== this.activeScreen) {
      this.changePageDisplay();
    }
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.oldActiveScreen = this.activeScreen;
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay();
  }

  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }

  changeVisibilityDisplay() {
    this.screenElements.forEach((screen) => {
      screen.classList.add(`screen--hidden`);
      screen.classList.remove(`active`);
    });

    const activeScreen = this.screenElements[this.activeScreen];
    activeScreen.classList.remove(`screen--hidden`);

    if (!activeScreen.classList.contains(`animation-letter-done`)) {
      const lettersAnimationElements = activeScreen.querySelectorAll(`.js-letter-by-letter-animation`);

      for (let i = 0; i < lettersAnimationElements.length; i++) {
        lettersAnimationElements[i].innerHTML = startLetterAnimation(lettersAnimationElements[i], activeScreen);
      }
    }

    if (this.activeScreen === 2 && this.oldActiveScreen === 1) {
      activeScreen.classList.add(`to-animation`);
      this.screenElements[this.oldActiveScreen].classList.add(`from-animation`);
    } else {
      this.screenElements[2].classList.remove(`to-animation`);
      this.screenElements[1].classList.remove(`from-animation`);
    }
    setTimeout(() => {
      activeScreen.classList.add(`active`);
    }, 100);
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }

  loadResource() {
    document.body.classList.add(`body--loaded`);
  }
}
