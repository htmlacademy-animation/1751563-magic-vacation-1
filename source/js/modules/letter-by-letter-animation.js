/**
 * Script для разделения фразы на части для дальнейшего их анимирования.
 *
 * args:
 * animationTextElement - элемент, внутри которого нужно анимировать появление текста
 * duration - продолжительность анимации появления текста
 * delay - задержка начала выполнения анимация
 */

export default (animationTextElement, activeScreen) => {
  let animationElement = animationTextElement;
  let animationDelay = animationElement.dataset.animationDelay;
  let animationDuration = animationElement.dataset.animationDuration;
  activeScreen.classList.add(`animation-letter-done`);

  let newElement = ``;
  const wordsArray = animationElement.textContent.trim().split(` `);

  for (let i = 0; i < wordsArray.length; i++) {
    const lettersArray = wordsArray[i].split(``);
    wordsArray[i] = ``;

    for (let j = 0; j < lettersArray.length; j++) {
      const random = Number((Math.random() * animationDuration).toFixed(2));
      const transition = Number(animationDelay) + i * 0.2 + random;

      lettersArray[j] = `<span class="letter" style="transition: transform ${transition}s ease;">${lettersArray[j]}</span>`;
      wordsArray[i] += lettersArray[j];
    }
    wordsArray[i] = `<span class="word">${wordsArray[i]}</span>`;
    newElement += wordsArray[i];
  }

  return newElement;
};
