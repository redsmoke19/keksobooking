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
  var getRandomLength = getRandomNumber(1, arrayCopies.length)
  for (var i = 0; i < getRandomLength; i++) {
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
        type: getRandomElement(Object.keys(TYPES)),
        rooms: getRandomNumber(1, 5),
        guest: getRandomNumber(1, 10),
        checkin: getRandomElement(USER_CHECKIN),
        checkout: getRandomElement(USER_CHECKOUT),
        features: getRandomArray(FEATURES),
        description: '',
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
