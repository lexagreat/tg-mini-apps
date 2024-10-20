(function isWebP() {
   function testWebP(callback) {
      let webP = new Image();
      webP.onload = webP.onerror = function () {
         callback(webP.height == 2);
      };
      webP.src =
         "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
   }
   testWebP(function (support) {
      if (support == true) {
         document.querySelector("html").classList.add("webp");
      } else {
         document.querySelector("html").classList.add("no-webp");
      }
   });
})();
const maskOptions = {
   mask: "+{7} (000) 000-00-00",
   // lazy: false,  // make placeholder always visible
   // placeholderChar: '0'     // defaults to '_'
};
if (document.querySelectorAll("[data-phone]").length) {
   document.querySelectorAll("[data-phone]").forEach((item) => {
      const mask = IMask(item, maskOptions);
   });
}
document.addEventListener("DOMContentLoaded", () => {
   initStepsSlider();
   initCasesSlider();
   accordion(".faq-item__header", ".faq-item__spoiler");
});

function initStepsSlider() {
   const swiper = new Swiper(".steps .swiper", {
      slidesPerView: "auto",
      spaceBetween: 16,
      centeredSlides: true,
      speed: 600,
      mousewheel: {
         enabled: true,
         forceToAxis: true,
         releaseOnEdges: true,
      },
      breakpoints: {
         1024: {
            spaceBetween: 40,
         },
      },
   });
   // wrapper.scrollWidth
   const length = document.querySelectorAll(".steps .swiper-slide").length;
   let pixelsForSlide = 400;
   let lastScroll = 0; // Переменная для хранения последнего положения скролла
   let cumulativeScroll = 0; // Переменная для накопления прокрутки
   gsap.to(".steps", {
      scrollTrigger: {
         trigger: ".steps", // элемент, который должен запускать анимацию
         start: "top 30%", // когда верх элемента достигает 80% высоты экрана
         end: () => "+=" + length * pixelsForSlide + "px", // Динамическое значение для end
         // markers: true, // Маркеры для отладки
         scrub: 1.5,
         pin: true, // Закрепляем элемент
         invalidateOnRefresh: true, // Пересчитывает значения при обновлении страницы или изменения размера
         onUpdate: (self) => {
            const scrollPos = self.scroll(); // Текущее положение скролла
            const direction = scrollPos > lastScroll ? "next" : "prev"; // Определение направления

            // Увеличиваем накопленное количество прокрученных пикселей
            cumulativeScroll += Math.abs(scrollPos - lastScroll);

            // Если прокручено больше 200 пикселей
            if (cumulativeScroll >= pixelsForSlide) {
               if (direction === "next") {
                  swiper.slideNext(); // Переход к следующему слайду
               } else {
                  swiper.slidePrev(); // Переход к предыдущему слайду
               }
               cumulativeScroll = 0; // Сброс накопленного скролла
            }

            lastScroll = scrollPos; // Обновление последнего положения скролла
         },
      },
   });
}
function initCasesSlider() {
   const swiper = new Swiper(".cases .swiper", {
      slidesPerView: "auto",
      spaceBetween: 10,
      mousewheel: {
         enabled: true,
         forceToAxis: true,
         releaseOnEdges: true,
      },
      breakpoints: {
         1024: {
            spaceBetween: 20,
         },
      },
   });
}
function accordion(linkSelector, contentSelector) {
   // получаем линки
   const openLinks = document.querySelectorAll(`${linkSelector}`);
   // контенты
   const contents = document.querySelectorAll(`${contentSelector}`);
   if (openLinks.length > 0) {
      for (let i = 0; i < openLinks.length; i++) {
         let openLink = openLinks[i];
         openLink.addEventListener("click", () => {
            // все прячем
            for (let j = 0; j < contents.length; j++) {
               // если хоть один открывается - return
               if (contents[j].classList.contains("collapsing")) {
                  return;
               } // Иначе
               // все прячем
               slideHide(contents[j]);
            }
            for (let j = 0; j < openLinks.length; j++) {
               openLinks[j].classList.remove("active");
            }
            // записываем в переменную нужный таб
            let content = openLink.nextElementSibling;
            // работаем с классами линка
            if (content.classList.contains("collapsing")) {
               return;
            } else if (content.classList.contains("collapse_show")) {
               openLink.classList.remove("active");
            } else {
               openLink.classList.add("active");
            }
            // показываем нужный
            slideShow(content);
         });
      }
   }
}

function slideShow(el, duration = 500) {
   // завершаем работу метода, если элемент содержит класс collapsing или collapse_show
   if (
      el.classList.contains("collapsing") ||
      el.classList.contains("collapse_show")
   ) {
      return;
   }
   // удаляем класс collapse
   el.classList.remove("collapse");
   // сохраняем текущую высоту элемента в константу height (это значение понадобится ниже)
   const height = el.offsetHeight;
   // устанавливаем высоте значение 0
   el.style["height"] = 0;
   // не отображаем содержимое элемента, выходящее за его пределы
   el.style["overflow"] = "hidden";
   // создание анимации скольжения с помощью CSS свойства transition
   el.style["transition"] = `height ${duration}ms ease`;
   // добавляем класс collapsing
   el.classList.add("collapsing");
   // получим значение высоты (нам этого необходимо для того, чтобы просто заставить браузер выполнить перерасчет макета, т.к. он не сможет нам вернуть правильное значение высоты, если не сделает это)
   el.offsetHeight;
   // установим в качестве значения высоты значение, которое мы сохранили в константу height
   el.style["height"] = `${height}px`;
   // по истечении времени анимации this._duration
   window.setTimeout(() => {
      // удалим класс collapsing
      el.classList.remove("collapsing");
      // добавим классы collapse и collapse_show
      el.classList.add("collapse");
      el.classList.add("collapse_show");
      // удалим свойства height, transition и overflow
      el.style["height"] = "";
      el.style["transition"] = "";
      el.style["overflow"] = "";
   }, duration);
}
function slideHide(el, duration = 500) {
   // завершаем работу метода, если элемент содержит класс collapsing или collapse_show
   if (
      el.classList.contains("collapsing") ||
      !el.classList.contains("collapse_show")
   ) {
      return;
   }
   // установим свойству height текущее значение высоты элемента
   el.style["height"] = `${el.offsetHeight}px`;
   // получим значение высоты
   el.offsetHeight;
   // установим CSS свойству height значение 0
   el.style["height"] = 0;
   // обрежем содержимое, выходящее за границы элемента
   el.style["overflow"] = "hidden";
   // добавим CSS свойство transition для осуществления перехода длительностью this._duration
   el.style["transition"] = `height ${duration}ms ease`;
   // удалим классы collapse и collapse_show
   el.classList.remove("collapse");
   el.classList.remove("collapse_show");
   // добавим класс collapsing
   el.classList.add("collapsing");
   // после завершения времени анимации
   window.setTimeout(() => {
      // удалим класс collapsing
      el.classList.remove("collapsing");
      // добавим класс collapsing
      el.classList.add("collapse");
      // удалим свойства height, transition и overflow
      el.style["height"] = "";
      el.style["transition"] = "";
      el.style["overflow"] = "";
   }, duration);
}
// // Smooth Scroll
// const lenis = new Lenis({
//    duration: 1.5, // продолжительность скролла (в секундах)
//    smooth: true, // включить плавный скролл
//    direction: "vertical", // направление скролла
// });
// function raf(time) {
//    lenis.raf(time);
//    requestAnimationFrame(raf);
// }
// requestAnimationFrame(raf);
// document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
//    anchor.addEventListener("click", function (e) {
//       e.preventDefault();

//       const targetId = this.getAttribute("href").substring(1);
//       const targetElement = document.getElementById(targetId);

//       lenis.scrollTo(targetElement); // Используем метод lenis для плавной прокрутки
//    });
// });
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
   anchor.addEventListener("click", function (e) {
      e.preventDefault();
      // lenis.scrollTo(this.getAttribute("href"));
      document.querySelector(this.getAttribute("href")).scrollIntoView({
         behavior: "smooth",
      });
   });
});
gsap.registerPlugin(ScrollTrigger);

gsap.to(".hero__images .left", {
   scrollTrigger: {
      trigger: ".hero__images", // элемент, который должен запускать анимацию
      start: "top 50%", // когда верх элемента достигает 80% высоты экрана
      end: "bottom 0", // когда низ элемента достигает 20% высоты экрана
      // markers: true, // включить маркеры для визуальной отладки
      scrub: 1.5,
   },
   x: -400,
   y: -500,
});
gsap.to(".hero__images .right", {
   scrollTrigger: {
      trigger: ".hero__images", // элемент, который должен запускать анимацию
      start: "top 50%", // когда верх элемента достигает 80% высоты экрана
      end: "bottom 0", // когда низ элемента достигает 20% высоты экрана
      // markers: true, // включить маркеры для визуальной отладки
      scrub: 1.5,
   },
   x: 400,
   y: -500,
});

// Popup
const popupLinks = document.querySelectorAll(".modal__link");
const body = document.querySelector("body");
const lockPadding = document.querySelectorAll(".lock-padding");
const popupCloseIcon = document.querySelectorAll(".modal__close");

let unlock = true;

const timeout = 500;

if (popupLinks.length > 0) {
   for (let index = 0; index < popupLinks.length; index++) {
      const popupLink = popupLinks[index];
      popupLink.addEventListener("click", function (e) {
         const popupName = popupLink.getAttribute("href").replace("#", "");
         const curentPopup = document.getElementById(popupName);
         popupOpen(curentPopup);
         e.preventDefault();
      });
   }
}

if (popupCloseIcon.length > 0) {
   for (let index = 0; index < popupCloseIcon.length; index++) {
      const el = popupCloseIcon[index];
      el.addEventListener("click", function (e) {
         popupClose(el.closest(".modal"));
         e.preventDefault();
      });
   }
}

function popupOpen(curentPopup) {
   if (curentPopup && unlock) {
      const popupActive = document.querySelector(".modal.open");
      if (popupActive) {
         popupClose(popupActive, false);
      } else {
         bodyLock();
      }
      curentPopup.classList.add("open");
      curentPopup.addEventListener("click", function (e) {
         if (!e.target.closest(".modal__content")) {
            popupClose(e.target.closest(".modal"));
         }
      });
   }
}
function popupClose(popupActive, doUnlock = true) {
   if (unlock) {
      popupActive.classList.remove("open");
      if (doUnlock) {
         bodyUnLock();
      }
   }
}

function bodyLock() {
   const lockPaddingValue =
      window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";

   if (lockPadding.length > 0) {
      for (let index = 0; index < lockPadding.length; index++) {
         const el = lockPadding[index];
         el.style.paddingRight = lockPaddingValue;
      }
   }
   body.style.paddingRight = lockPaddingValue;
   body.classList.add("lock");

   unlock = false;
   setTimeout(function () {
      unlock = true;
   }, timeout);
}

function bodyUnLock() {
   setTimeout(function () {
      if (lockPadding.length > 0) {
         for (let index = 0; index < lockPadding.length; index++) {
            const el = lockPadding[index];
            el.style.paddingRight = "0px";
         }
      }
      body.style.paddingRight = "0px";
      body.classList.remove("lock");
   }, timeout);

   unlock = false;
   setTimeout(function () {
      unlock = true;
   }, timeout);
}

document.addEventListener("keydown", function (e) {
   if (e.which === 27) {
      const popupActive = document.querySelector(".modal.open");
      popupClose(popupActive);
   }
});
