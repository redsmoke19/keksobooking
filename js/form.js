'use strict';
(function () {
  var form = document.querySelector('.ad-form');
  var forms = document.querySelectorAll('.novalidate');
  var MIN_PRICE = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };
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
    if (validity.valueMissing) {
      return 'Пожалуйста, заполните это поле. Оно обязательное';
    }
    if (validity.typeMismatch) {
      if (field.type === 'email') {
        return 'Пожалуйста, введите верное значение почты';
      }
      if (field.type === 'url') {
        return 'Пожалуйста, введите правильный адрес ссылки';
      }
    }
    if (validity.tooShort) {
      return 'Длинна имени должна быть не менее ' + field.getAttribute('minLength') + ' символов. Вы ввели ' + field.value.length + ' символа.';
    }
    if (validity.tooLong) {
      return 'Длинна имени должна быть не более ' + field.getAttribute('maxLength') + ' символов. Вы ввели ' + field.value.length + ' символа.';
    }
    if (validity.badInput) {
      return 'Пожалуйста, введите число';
    }
    if (validity.stepMismatch) {
      return 'Указано не верное значение';
    }
    if (validity.rangeOverflow) {
      return 'Введенное значение слишком велико';
    }
    if (validity.rangeUnderflow) {
      return 'Введенное значение слишком мало';
    }
    if (validity.patternMismatch) {
      return 'неверный формат';
    }
    return 'Введенное значение не верно';
  }

  function showError(field, error) {
    field.classList.add('error');
    var id = field.id;
    if (!id) {
      return;
    }
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
    if (!id) {
      return;
    }
    var message = field.form.querySelector('.error-message#error-for-' + id + '');
    if (!message) {
      return;
    }
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

  getSyncRooms();
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
})();