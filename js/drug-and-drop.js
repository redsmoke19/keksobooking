'use strict';
(function () {
  // Перетаскивание главного пина по карте
  var pinHandler = document.querySelector('.map__pin--main');
  var mapPins = document.querySelector('.map__pins');
  window.dragMainPin = function () {
    pinHandler.addEventListener('mousedown', function (evt) {
      evt.preventDefault();
      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      function onMouseMove(moveEvt) {
        moveEvt.preventDefault();
        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        function getMainPinLeftCoords() {
          var coordsLeft = pinHandler.offsetLeft - shift.x;
          if (coordsLeft < mapPins.offsetLeft - pinHandler.getBoundingClientRect().width / 2) {
            coordsLeft = mapPins.offsetLeft - pinHandler.getBoundingClientRect().width / 2;
          }
          var coordRight = mapPins.getBoundingClientRect().width - (pinHandler.getBoundingClientRect().width / 2);
          if (coordsLeft > coordRight) {
            coordsLeft = coordRight;
          }
          return coordsLeft;
        }

        function getMainPinTopCoords() {
          var coordsTop = pinHandler.offsetTop - shift.y;
          if (coordsTop < 130) {
            coordsTop = 130;
          }
          if (coordsTop > mapPins.getBoundingClientRect().height - pinHandler.getBoundingClientRect().height - 22) {
            coordsTop = mapPins.getBoundingClientRect().height - pinHandler.getBoundingClientRect().height - 22;
          }
          return coordsTop;
        }

        pinHandler.style.left = getMainPinLeftCoords() + 'px';
        pinHandler.style.top = getMainPinTopCoords() + 'px';
        window.address.value = parseInt(pinHandler.style.left) + Math.floor(pinHandler.getBoundingClientRect().width / 2) + ',' + parseInt(pinHandler.style.top);
      }

      function onMouseUp(upEvt) {
        upEvt.preventDefault();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  };
})();
