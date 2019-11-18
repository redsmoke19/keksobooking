'use strict';

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

// Глобальные переменные
var fragment = document.createDocumentFragment();

// Переменные поиска элементов
var map = document.querySelector('.map');
var template = document.querySelector('template').content;
var pinList = document.querySelector('.map__pins');


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

// Функция создания массива объекта любой длины (длина задается в цикле <= n)
function getObjectArray() {
  var objectArray = [];
  for (var i = 0; i < 8; i++) {
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

// Временно удаляем класс, который блакирует карту
map.classList.remove('map--faded');

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

// Запись созданных значков на карте во fragment
for (var k = 0; k < objectList.length; k++) {
  fragment.appendChild(createPinElement(objectList[k]));
}

// Записываю из фрагмента элементы в спикок всех пинов на карте (сам тег fragment после этой операции опусташается)
pinList.appendChild(fragment);

// Функция генерации кароточки объекта на основании скопированного шаблона
function createCardElement (object) {
  var cardElement = mapTemplate.cloneNode(true);
  cardElement.querySelector('.popup__title').textContent = object.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = object.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = object.offer.price + ' Руб/ночь';
  cardElement.querySelector('.popup__type').textContent = object.offer.type;
  cardElement.querySelector('.popup__text--capacity').textContent = object.offer.rooms + ((objectList[0].offer.rooms === 1) ? ' комната для ' : (objectList[0].offer.rooms === 5 ? ' комнат для ' : ' комнаты для ')) + objectList[0].offer.guest + (object.offer.guest === 1 ? ' гостя' : ' гостей');
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + object.offer.checkin + ', выезд до ' + object.offer.checkout;

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

  cardElement.querySelector('.popup__description').textContent = object.offer.description;
  cardElement.querySelector('.popup__avatar').src = object.author.avatar;

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

  // photosList.innerHTML = '';
  // for (var j = 0; j < object.offer.photos.length; j++) {
  //   var photosElement = '<img src="' + object.offer.photos[j] + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">';
  //   photosList.insertAdjacentHTML('afterbegin', photosElement);
  // }

  return cardElement;
}

fragment.append(createCardElement(objectList[0]));

map.children[1].before(fragment);

