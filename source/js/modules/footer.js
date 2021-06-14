export default () => {
  let footerTogglers = document.querySelectorAll(`.js-footer-toggler`);

  if (footerTogglers.length) {
    for (let i = 0; i < footerTogglers.length; i++) {
      footerTogglers[i].addEventListener(`click`, function () {
        let footer = footerTogglers[i].closest(`.footer__inner`);
        if (footer.classList.contains(`footer--full`)) {
          footer.classList.remove(`footer--full`);
        } else {
          footer.classList.add(`footer--full`);
        }
      });
    }
  }
};
