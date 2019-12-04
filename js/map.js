'use strict';

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
var MIN_PRICE = {
  'bungalo': 0,
  'flat': 1000,
  'house': 5000,
  'palace': 10000
}

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
  var randomLength = getRandomNumber(1, arrayCopies.length)
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
  pinElement.style.left = arr.location.x + PIN_SIZE.x / 2 + 'px';
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
  var photosList = cardElement.querySelector('.popup__photos')
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
var address = document.querySelector('#address');
address.value = getAddressValue();

// По умолчанию переводим поля формы в состояние disabled, т.к. при загрузки страницы они должны быть неактивны
function disableFieldset() {
  var formFieldset = form.querySelectorAll('fieldset');
  for (var i = 0; i < formFieldset.length; i++) {
    formFieldset[i].disabled = !formFieldset[i].disabled;
  }
}

// Получаем значения координат главного пина на карте по значению его места на карте left and top
function getAddressValue() {
  var addressValue = parseInt(mainPin.style.left) + ',' + parseInt(mainPin.style.top);
  return addressValue;
}

// При нажатии на гланый пин страница переходит в активный режим, удаляя классы блокировки, отключает блокировку формы, записывает во фрагмент каждый элемент массива pins и вставляет их на страницу, добалвяет слушателя делегированного на всю карту pinList
function mainPinMouseUpHandler() {
  map.classList.remove('map--faded');
  form.classList.remove('ad-form--disabled');
  disableFieldset();
  address.value = getAddressValue();
  mainPin.style.zIndex = '100';
  for (var i = 0; i < pins.length; i++) {
    fragment.append(pins[i]);
  }
  pinList.append(fragment);
  pinList.addEventListener('click', pinClickHandler);
  mainPin.removeEventListener('mouseup', mainPinMouseUpHandler);
  mainPin.removeEventListener('keydown', mainPinEnterUpHandler);
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

// Валидация формы

function checkScript() {
  var forms = document.querySelectorAll('.novalidate');
  for (var i = 0; i < forms.length; i++) {
    forms[i].setAttribute('novalidate', true);
  }
  // Находим в форме поле с именем type, timein, timeout это Select.
  var selectType = form.type;
  var selectTimein = form.timein;
  var selectTimeout = form.timeout;
  var selectRooms = form.rooms;
  var selectCapacity = form.capacity;

  function hasError(field) {
    if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') {
      return;
    }
    var validity = field.validity;
    if (validity.valid) {
      return;
    }
    if (validity.valueMissing) return 'Пожалуйста, заполните это поле. Оно обязательное';
    if (validity.typeMismatch) {
      if (field.type === 'email') return 'Пожалуйста, введите верное значение почты';
      if (field.type === 'url') return 'Пожалуйста, введите правильный адрес ссылки';
    }
    if (validity.tooShort) return 'Длинна имени должна быть не менее ' + field.getAttribute('minLength') + ' символов. Вы ввели ' + field.value.length + ' символа.';
    if (validity.tooLong) return 'Длинна имени должна быть не более ' + field.getAttribute('maxLength') + ' символов. Вы ввели ' + field.value.length + ' символа.';
    if (validity.badInput) return 'Пожалуйста, введите число';
    if (validity.stepMismatch) return 'Указано не верное значение';
    if (validity.rangeOverflow) return 'Введенное значение слишком велико';
    if (validity.rangeUnderflow) return 'Введенное значение слишком мало';
    if (validity.patternMismatch) return 'неверный формат';
    return 'Введенное значение не верно';
  }

  function showError(field, error) {
    field.classList.add('error');
    var id = field.id;
    if (!id) return;
    var message = field.form.querySelector('.error-message#error-for-' + id);
    if (!message) {
      message = document.createElement('div');
      message.className = 'error-message';
      message.id = 'error-for-' + id;
      field.parentNode.insertBefore(message, field.nextSibling);
    }
    field.setAttribute('aria-describedby', 'error-for-' + id);
    message.innerHTML = error;
    message.style.display = 'block';
    message.style.visibility = 'visible';
  }

  function removeError(field) {
    field.classList.remove('error');
    field.removeAttribute('aria-describedby');
    var id = field.id;
    if (!id) return;
    var message = field.form.querySelector('.error-message#error-for-' + id + '');
    if (!message) return;
    message.innerHTML = '';
    message.style.display = 'none';
    message.style.visibility = 'hidden';
  }

  function fieldBlurHandler(evt) {
    if (!evt.target.form.classList.contains('novalidate')) {
      return;
    }
    var error = hasError(evt.target);
    if (error) {
      showError(evt.target, error);
      return;
    }
    removeError(evt.target);
  }

  function submitButtonHandler(evt) {
    if (!evt.target.classList.contains('novalidate')) {
      return;
    }
    var fields = evt.target.elements;
    var error;
    var hasErrors;
    for (var j = 0; j < fields.length; j++) {
      error = hasError(fields[j]);
      if (error) {
        showError(fields[j], error);
        if (!hasErrors) {
          hasErrors = fields[j];
        }
      }
    }
    if (hasErrors) {
      evt.preventDefault();
      hasErrors.focus();
    }
  }

  function getPriceType() {
    var selectOption = selectType.options[selectType.selectedIndex];
    var selectPrice = form.price;
    // Соркащенный вариант
    // selectPrice.placeholder = MIN_PRICE[selectOption.value];
    // selectPrice.min = MIN_PRICE[selectOption.value];
    if (selectOption.value === 'bungalo') {
      selectPrice.placeholder = MIN_PRICE['bungalo'];
      selectPrice.min = MIN_PRICE['bungalo'];
    }
    if (selectOption.value === 'flat') {
      selectPrice.placeholder = MIN_PRICE['flat'];
      selectPrice.min = MIN_PRICE['flat'];
    }
    if (selectOption.value === 'house') {
      selectPrice.placeholder = MIN_PRICE['house'];
      selectPrice.min = MIN_PRICE['house'];
    }
    if (selectOption.value === 'palace') {
      selectPrice.placeholder = MIN_PRICE['palace'];
      selectPrice.min = MIN_PRICE['palace'];
    }
  }

  function getSyncTime(first, second) {
    second.options[first.selectedIndex].selected = true;
  }

  function getSyncRooms() {
    var capacityValue = selectCapacity.options;
    selectCapacity.value = (selectRooms.value === '100') ? '0' : selectRooms.value;
    var currentValue = selectCapacity.value;
    for (var j = 0; j < capacityValue.length; j++) {
      capacityValue[j].disabled = (currentValue === '0') ? (capacityValue[j].value !== '0') : (capacityValue[j].value > currentValue || capacityValue[j].value === '0');
    }
  }
  getSyncRooms()
  form.addEventListener('submit', submitButtonHandler, false);
  form.addEventListener('blur', fieldBlurHandler, true);
  selectType.addEventListener('change', getPriceType);
  selectTimein.addEventListener('change', function () {
    getSyncTime(selectTimein, selectTimeout);
  });
  selectTimeout.addEventListener('change', function () {
    getSyncTime(selectTimeout, selectTimein);
  });
  selectRooms.addEventListener('change', getSyncRooms);
}

checkScript();