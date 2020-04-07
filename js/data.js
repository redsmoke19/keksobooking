'use strict';
(function () {
  window.data = {
    mainPin: document.querySelector('.map__pin--main'),
    USER_TITLE: ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
    USER_CHECKIN: ['12:00', '13:00', '14:00'],
    USER_CHECKOUT: ['12:00', '13:00', '14:00'],
    TYPES: {
      flat: 'Квартира',
      bungalo: 'Бунгало',
      house: 'Дом',
      palace: 'Дворец'
    },
    FEATURES: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
    USER_PHOTO: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'],
    PIN_SIZE: {
      x: 50,
      y: 70
    },
    MAIN_PIN_SIZE: {
      width: window.data.mainPin.clientWidth,
      height: window.data.mainPin.clientHeight
    },
    ADDS_LENGTH: 8,
    ESC_KEYCODE: 27,
    ENTER_KEYCORE: 13,
    MIN_PRICE: {
      'bungalo': 0,
      'flat': 1000,
      'house': 5000,
      'palace': 10000
    }
  };
})();