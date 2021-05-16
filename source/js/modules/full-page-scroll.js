import throttle from 'lodash/throttle';
import startLetterAnimation from './letter-by-letter-animation';

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 2000;

    this.screenElements = document.querySelectorAll(`.js-screen-page`);

    this.temporaryScreenElements = [];

    for (let i = this.screenElements.length - 1; i >= 0; i--) {
      this.temporaryScreenElements.push(this.screenElements[i]);
    }

    this.screenElements = this.temporaryScreenElements;

    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);

    this.activeScreen = -1;
    this.oldActiveScreen = -1;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
    this.onLoadHandler = this.loadResource.bind(this);
    this.arrayScreenTitle = [];
    this.activeClassAccent = null;
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);
    window.addEventListener(`load`, this.onLoadHandler);

    this.screenElements.forEach((currentScreen) => {
      this.arrayScreenTitle.push(currentScreen.dataset.page);
    });

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
    const arrayScreenTitle = this.arrayScreenTitle;

    const indexActiveScreen = this.activeScreen;
    const indexOldActiveScreen = this.oldActiveScreen;

    const activeScreen = this.screenElements[indexActiveScreen];
    const oldActiveScreen = this.screenElements[indexOldActiveScreen] || null;

    if (indexActiveScreen !== indexOldActiveScreen && indexOldActiveScreen !== -1) {
      oldActiveScreen.classList.remove(`screen--active`);
      oldActiveScreen.classList.remove(this.activeClassAccent);
    }

    this.activeClassAccent = `screen--${arrayScreenTitle[indexOldActiveScreen]}-to-${arrayScreenTitle[indexActiveScreen]}`;
    activeScreen.classList.add(`screen--active`);
    if (indexOldActiveScreen !== -1) {
      activeScreen.classList.add(this.activeClassAccent);
    }

    if (!activeScreen.classList.contains(`animation-letter-done`)) {
      const lettersAnimationElements = activeScreen.querySelectorAll(`.js-letter-by-letter-animation`);

      for (let i = 0; i < lettersAnimationElements.length; i++) {
        lettersAnimationElements[i].innerHTML = startLetterAnimation(lettersAnimationElements[i], activeScreen);
      }
    }
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
