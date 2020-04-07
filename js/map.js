'use strict';
(function () {

  // Глобальные переменные
  var fragment = document.createDocumentFragment();

  // Переменные поиска элементов
  var map = document.querySelector('.map');
  var template = document.querySelector('template').content;
  var pinList = document.querySelector('.map__pins');
  var form = document.querySelector('.ad-form');
  var mainPin = document.querySelector('.map__pin--main');

  // Статические переменные
  var USER__TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var USER_CHECKIN = ['12:00', '13:00', '14:00'];
  var USER_CHECKOUT = ['12:00', '13:00', '14:00'];
  var TYPES = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var USER_PHOTO = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var PIN_SIZE = {
    x: 50,
    y: 70
  };
  var MAIN_PIN_SIZE = {
    width: mainPin.clientWidth,
    height: mainPin.clientHeight
  };
  var ADDS_LENGTH = 8;
  var ESC_KEYCODE = 27;
  var ENTER_KEYCORE = 13;

  // Функция генерации случайного числа
  function getRandomNumber(min, max) {
    var randomNumber = min + Math.random() * (max + 1 - min);
    return Math.floor(randomNumber);
  }

  // Функция генерации случайного элемента в массиве
  function getRandomElement(array) {
    var randomElement = getRandomNumber(0, array.length - 1);
    return array[randomElement];
  }

  // Функция генерации массива случайной длины и со случайным порядком элементов внутри
  function getRandomArray(array) {
    var randomArray = [];
    var arrayCopies = array.slice();
    var randomLength = getRandomNumber(1, arrayCopies.length);
    for (var i = 0; i < randomLength; i++) {
      var randomElementIndex = getRandomNumber(0, arrayCopies.length - 1);
      randomArray.push(arrayCopies[randomElementIndex]);
      arrayCopies.splice(randomElementIndex, 1);
    }
    return randomArray;
  }

  // Правильная функция перемешивания массива в случайном порядке по алгоритму Фишера-Йетса
  function getShuffleArray(array) {
    var j;
    var temp;
    for (var i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = array[j];
      array[j] = array[i];
      array[i] = temp;
    }
    return array;
  }

  // Получаем ширину окна в которм находится пользователь
  var mapWidth = document.querySelector('.map__pins').getBoundingClientRect();
  var clientWidth = mapWidth.width - 75;
  mainPin.style.left = (mapWidth.width / 2 - MAIN_PIN_SIZE.width / 2) + 'px';

  // Функция создания массива объекта любой длины (длина задается в цикле <= n)
  function getObjectArray() {
    var objectArray = [];
    for (var i = 0; i < ADDS_LENGTH; i++) {
      var x = getRandomNumber(0, clientWidth);
      var y = getRandomNumber(130, 560);
      var objectItem = {
        author: {
          avatar: 'img/avatars/user0' + (i + 1) + '.png',
        },
        offer: {
          title: USER__TITLE[i],
          address: x + ', ' + y,
          price: getRandomNumber(1000, 1000000),
          type: TYPES[getRandomElement(Object.keys(TYPES))],
          rooms: getRandomNumber(1, 5),
          guest: getRandomNumber(1, 10),
          checkin: getRandomElement(USER_CHECKIN),
          checkout: getRandomElement(USER_CHECKOUT),
          features: getRandomArray(FEATURES),
          description: 'Великолепная квартира-студия в центре Токио. Подходит как туристам, так и бизнесменам. Квартира полностью укомплектована и недавно отремонтирована.',
          photos: getShuffleArray(USER_PHOTO),
        },
        location: {
          x: x,
          y: y,
        },
      };
      objectArray.push(objectItem);
    }
    return objectArray;
  }

  var objectList = getObjectArray();

  // В шаблоне ищу элементы необходимые для дальнейшего копирования
  var mapTemplate = template.querySelector('.map__card');
  var pinTemplate = template.querySelector('.map__pin');

  // Функция генерации одного значка на карте на основе скопированного шаблона
  function createPinElement(arr) {
    var pinElement = pinTemplate.cloneNode(true);
    pinElement.style.left = arr.location.x + (PIN_SIZE.x / 2) + 'px';
    pinElement.style.top = arr.location.y + PIN_SIZE.y + 'px';
    pinElement.querySelector('img').src = arr.author.avatar;
    pinElement.querySelector('img').alt = arr.offer.title;
    return pinElement;
  }

  // Функция генерации массива пинов длины равной ADDS_LENGTH
  function getPinList() {
    var pinArray = [];
    for (var k = 0; k < ADDS_LENGTH; k++) {
      pinArray.push(createPinElement(objectList[k]));
    }
    return pinArray;
  }

  var pins = getPinList();

  // Функция генерации кароточки объекта на основании скопированного шаблона
  function createCardElement(object) {
    var cardElement = mapTemplate.cloneNode(true);
    cardElement.querySelector('.popup__title').textContent = object.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = object.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = object.offer.price + ' Руб/ночь';
    cardElement.querySelector('.popup__type').textContent = object.offer.type;
    cardElement.querySelector('.popup__text--capacity').textContent = object.offer.rooms + ((objectList[0].offer.rooms === 1) ? ' комната для ' : (objectList[0].offer.rooms === 5 ? ' комнат для ' : ' комнаты для ')) + objectList[0].offer.guest + (object.offer.guest === 1 ? ' гостя' : ' гостей');
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + object.offer.checkin + ', выезд до ' + object.offer.checkout;
    cardElement.querySelector('.popup__description').textContent = object.offer.description;
    cardElement.querySelector('.popup__avatar').src = object.author.avatar;

    // Из массива features который содержит названия доступных удобств, создаем новые элементы li с классом удобств равному i-у элементу массива и записываем эти элементы в родительский элемент .popup__features
    // featuresList.innerHTML = '';
    // for (var i = 0; i < object.offer.features.length; i++) {
    //   var featureElement = '<li class="popup__feature popup__feature--' + object.offer.features[i] + '"></li>';
    //   featuresList.insertAdjacentHTML('afterbegin', featureElement);
    // }
    var featuresList = cardElement.querySelector('.popup__features');
    var featuresClone = featuresList.cloneNode(false);
    featuresList.remove();
    for (var i = 0; i < object.offer.features.length; i++) {
      var featuresElement = document.createElement('li');
      featuresElement.classList.add('popup__feature');
      featuresElement.classList.add('popup__feature--' + object.offer.features[i]);
      featuresClone.append(featuresElement);
    }
    cardElement.querySelector('.popup__description').before(featuresClone);

    // Тоже самое делаем с коллекцией фотографий. Сначала ищем класс который является контейнером фотографий, потом клонируем не глубоким методом (false) этот элемент-родитель, после этого удаляем главный элемент и оставляем только клон его, внутри цикла создаем новый элемент, добавляем ему класс, высоту, ширину и src с alt, после чего с помощью метода append отправляем элемент в конец родительского элемента photosClone, и после чего вставляем элемент photosClone после элемента с классом .popup__description;
    var photosList = cardElement.querySelector('.popup__photos');
    var photosClone = photosList.cloneNode(false);
    photosList.remove();
    for (var j = 0; j < object.offer.photos.length; j++) {
      var photoElement = document.createElement('img');
      photoElement.classList.add('popup__photo');
      photoElement.width = '45';
      photoElement.height = '40';
      photoElement.alt = 'Фотография жилья';
      photoElement.src = object.offer.photos[j];
      photosClone.append(photoElement);
    }
    cardElement.querySelector('.popup__description').after(photosClone);
    return cardElement;
  }

  // Загрузка пинов и карточек объявлений

  var popup;
  var pin;
  var currentTarget;

  // Задаем начальное значения координат для поля формы с адресом
  window.address = document.querySelector('#address');
  window.address.value = getAddressValue();

  // По умолчанию переводим поля формы в состояние disabled, т.к. при загрузки страницы они должны быть неактивны
  function disableFieldset() {
    var formFieldset = form.querySelectorAll('fieldset');
    for (var i = 0; i < formFieldset.length; i++) {
      formFieldset[i].disabled = !formFieldset[i].disabled;
    }
  }

  // Получаем значения координат главного пина на карте по значению его места на карте left and top
  function getAddressValue() {
    return parseInt(mainPin.style.left) + ',' + parseInt(mainPin.style.top);
  }

  // При нажатии на гланый пин страница переходит в активный режим, удаляя классы блокировки, отключает блокировку формы, записывает во фрагмент каждый элемент массива pins и вставляет их на страницу, добалвяет слушателя делегированного на всю карту pinList

  function mainPinMouseUpHandler() {
    map.classList.remove('map--faded');
    form.classList.remove('ad-form--disabled');
    disableFieldset();
    window.address.value = getAddressValue();
    mainPin.style.zIndex = '100';
    for (var i = 0; i < pins.length; i++) {
      fragment.append(pins[i]);
    }
    pinList.append(fragment);
    pinList.addEventListener('click', pinClickHandler);
    mainPin.removeEventListener('mouseup', mainPinMouseUpHandler);
    mainPin.removeEventListener('keydown', mainPinEnterUpHandler);
    window.dragMainPin();
  }

  // Функция показа карточки объявления при клике на пин
  function pinClickHandler(evt) {
    // Создаем элемент pin и присваиваем ему значение метки на карте (пина)
    pin = evt.target.closest('.map__pin');
    // Если событие произошло не на любом из пинов, то выходим из функции
    if (!pin) {
      return;
    }
    if (pin !== mainPin) {
      // Удаляем подсветку с предыдущего элемента пина, и так же удаляем соответсвующий ему элемент карточки товара
      if (currentTarget) {
        currentTarget.classList.remove('map__pin--active');
        popup.remove();
      }
      // Добавляем подсветку активного элемента пина на карте
      pin.classList.add('map__pin--active');
      // Переменной currentTarget присваиваем значение элемента пин, который находится в активном состоянии
      currentTarget = pin;
      // По индексу активного элемента в массиве pins создает соответствующий элемент карточки товара и размещает его на карте
      popup = createCardElement(objectList[pins.indexOf(currentTarget)]);
      map.children[1].before(popup);
      // Ищет кнопку закрытия карточки объявления и при клике или esc закрывает ее
      var popupClose = map.querySelector('.popup__close');
      popupClose.addEventListener('click', closePopupClickHandler);
      document.addEventListener('keydown', popupEscHandler);
    }
    // Если клик произошел на главном пине, то закрывает карточку товара
    if (popup && pin === mainPin) {
      closePopupClickHandler();
    }
  }

  // Функция закрытия попапа и удаления класса активного элемента, и так эе убирает обработчик с клавишы Esc
  function closePopupClickHandler() {
    currentTarget.classList.remove('map__pin--active');
    popup.classList.add('hidden');
    document.removeEventListener('keydown', popupEscHandler);
  }

  // Функция закрытия попапа по нажатию клавишы Esc
  function popupEscHandler(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closePopupClickHandler();
    }
  }

  // Функция разблокировки нарты при нажатии на главный пин через Enter
  function mainPinEnterUpHandler(evt) {
    if (evt.keyCode === ENTER_KEYCORE) {
      mainPinMouseUpHandler();
    }
  }

  // По умолчанию отключаем форму
  disableFieldset();
  // Добавляем обработчик событий на главный пин
  mainPin.addEventListener('mouseup', mainPinMouseUpHandler);
  mainPin.addEventListener('keydown', mainPinEnterUpHandler);

})();