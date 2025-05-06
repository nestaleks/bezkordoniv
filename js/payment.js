/**
 * Модуль для работы с модальным окном оплаты
 */

// Инициализация модального окна оплаты
function initPaymentModal() {
    // Найдем все кнопки оплаты на странице
    const paymentBtns = document.querySelectorAll('.client-meeting-item-pay, .client-meetings-item-pay, .button-pay, [data-action="pay"]');
    const paymentModal = document.getElementById('paymentModal');
    const paymentModalContent = document.querySelector('.payment-modal-content');
    const paymentModalNewcard = document.querySelector('.payment-modal-newcard');
    const closeBtn = document.querySelectorAll('.modal-window-close');
    const backBtn = document.querySelector('.prev-page-btn');
    const paymentMethods = document.querySelectorAll('.payment-method');
    const cardPaymentBtn = document.querySelector('.payment-modal-card');
    
    if (!paymentModal) {
        console.warn('Модальное окно оплаты не найдено на странице');
        return;
    }
    
    if (!paymentBtns.length) {
        console.warn('Кнопки оплаты не найдены на странице');
    } else {
        // Открытие модального окна по клику на любую кнопку оплаты
        paymentBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                openPaymentModal();
                
                // Если у кнопки есть атрибуты с данными, используем их
                if (btn.dataset.amount) {
                    updatePaymentAmount(btn.dataset.amount);
                } else {
                    // Попробуем найти сумму рядом с кнопкой
                    const parentContainer = btn.closest('.client-meetings-item-info, .client-meeting-item-payments');
                    if (parentContainer) {
                        const costElement = parentContainer.querySelector('.client-meetings-item-cost p, .client-meeting-item-cost p');
                        if (costElement) {
                            updatePaymentAmount(costElement.textContent.trim());
                        }
                    }
                }
                
                if (btn.dataset.service) {
                    updatePaymentService(btn.dataset.service);
                } else {
                    // Попробуем найти название услуги рядом с кнопкой
                    const appointmentItem = btn.closest('.client-meetings-item, .client-meeting-item');
                    if (appointmentItem) {
                        const expertNameElement = appointmentItem.querySelector('.client-meetings-item-expert-name, .client-meeting-item-expert-name');
                        if (expertNameElement) {
                            updatePaymentService(expertNameElement.textContent.trim());
                        }
                    }
                }
            });
        });
    }
    
    // Обработка клика на элемент payment-modal-card
    if (cardPaymentBtn) {
        cardPaymentBtn.addEventListener('click', function() {
            showCardDetailsModal();
        });
    }
    
    // Обработка клика на кнопку "Назад"
    if (backBtn) {
        backBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showMainPaymentModal();
        });
    }
    
    if (!closeBtn.length) {
        console.warn('Кнопки закрытия модального окна не найдены');
    } else {
        // Закрытие модального окна при клике на крестик
        closeBtn.forEach(btn => {
            btn.addEventListener('click', closePaymentModal);
        });
    }
    
    // Закрытие модального окна при клике вне его области
    paymentModal.addEventListener('click', function(e) {
        if (e.target === paymentModal) {
            closePaymentModal();
        }
    });
    
    // Выбор способа оплаты
    if (!paymentMethods.length) {
        console.warn('Методы оплаты не найдены');
    } else {
        paymentMethods.forEach(method => {
            method.addEventListener('click', function() {
                // Удаляем активный класс у всех методов
                paymentMethods.forEach(m => m.classList.remove('active'));
                // Добавляем активный класс к выбранному методу
                this.classList.add('active');
            });
        });
    }
    
    // Добавляем обработчики для кнопок в модальных окнах
    const closeModalBtns = document.querySelectorAll('#paymentModalCloseMain, #paymentModalCloseCard');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closePaymentModal);
    });

    // Добавляем обработчики для кнопок оплаты
    const payModalBtns = document.querySelectorAll('#paymentModalPayMain, #paymentModalPayCard');
    payModalBtns.forEach(btn => {
        btn.addEventListener('click', processPayment);
    });

    // Инициализация валидации карты
    initCardValidation();
}

/**
 * Инициализация валидации данных кредитной карты
 */
function initCardValidation() {
    // Получение полей формы
    const cardNumberInput = document.querySelector('.payment-modal-newcard input[placeholder="Номер картки"]');
    const cardExpiryInput = document.querySelector('.payment-modal-newcard input[placeholder="Термін дії картки"]');
    const cardCvvInput = document.querySelector('.payment-modal-newcard input[placeholder="CVV код"]');
    const cardPayButton = document.querySelector('#paymentModalPayCard');

    // Проверка наличия элементов на странице
    if (!cardNumberInput || !cardExpiryInput || !cardCvvInput || !cardPayButton) {
        console.warn('Не найдены все необходимые поля формы карты');
        return;
    }

    // Валидация номера карты (должен содержать ровно 16 цифр)
    cardNumberInput.addEventListener('input', function(e) {
        // Удалить всё, кроме цифр
        let value = this.value.replace(/\D/g, '');
        
        // Ограничить длину до 16 символов
        if (value.length > 16) {
            value = value.slice(0, 16);
        }
        
        // Форматирование номера карты (группы по 4 цифры)
        let formattedValue = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        
        this.value = formattedValue;
        
        // Проверка на валидность (16 цифр)
        validateCardNumber(this);
    });

    // Валидация срока действия (формат MM/YY)
    cardExpiryInput.addEventListener('input', function(e) {
        // Удалить всё, кроме цифр
        let value = this.value.replace(/\D/g, '');
        
        // Ограничить до 4 цифр
        if (value.length > 4) {
            value = value.slice(0, 4);
        }
        
        // Автоматически добавить / после первых двух цифр
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        
        this.value = value;
    });

    // Валидация CVV (ровно 3 цифры)
    cardCvvInput.addEventListener('input', function(e) {
        // Удалить всё, кроме цифр
        let value = this.value.replace(/\D/g, '');
        
        // Ограничить до 3 цифр
        if (value.length > 3) {
            value = value.slice(0, 3);
        }
        
        this.value = value;
        
        // Проверка на валидность (3 цифры)
        validateCVV(this);
    });

    // Валидация всей формы перед отправкой
    cardPayButton.addEventListener('click', function(e) {
        // Проверка номера карты
        if (!validateCardNumber(cardNumberInput)) {
            e.preventDefault();
            return false;
        }
        
        // Проверка CVV
        if (!validateCVV(cardCvvInput)) {
            e.preventDefault();
            return false;
        }
        
        // Дополнительная проверка срока действия
        if (cardExpiryInput.value.length < 5) {
            showError(cardExpiryInput, "Введіть термін дії у форматі MM/YY");
            e.preventDefault();
            return false;
        }
        
        // Если всё в порядке, можно продолжить обработку
        processPayment();
    });
}

/**
 * Проверка номера карты
 * @param {HTMLInputElement} input - Поле ввода номера карты
 * @returns {boolean} - Результат валидации
 */
function validateCardNumber(input) {
    // Удаляем все не-цифры для подсчета
    const digitsOnly = input.value.replace(/\D/g, '');
    
    if (digitsOnly.length !== 16) {
        showError(input, "Номер картки повинен містити 16 цифр");
        return false;
    }
    
    hideError(input);
    return true;
}

/**
 * Проверка CVV кода
 * @param {HTMLInputElement} input - Поле ввода CVV
 * @returns {boolean} - Результат валидации
 */
function validateCVV(input) {
    if (input.value.length !== 3) {
        showError(input, "CVV код повинен містити 3 цифри");
        return false;
    }
    
    hideError(input);
    return true;
}

/**
 * Показать сообщение об ошибке под полем ввода
 * @param {HTMLInputElement} input - Поле ввода
 * @param {string} message - Текст сообщения
 */
function showError(input, message) {
    // Проверяем, есть ли уже сообщение об ошибке
    let errorElement = input.nextElementSibling;
    
    // Если следующий элемент - текст под полем, то ищем дальше
    if (errorElement && errorElement.classList.contains('form-undertext')) {
        errorElement = errorElement.nextElementSibling;
    }
    
    // Если сообщения об ошибке ещё нет, создаем его
    if (!errorElement || !errorElement.classList.contains('form-error')) {
        errorElement = document.createElement('p');
        errorElement.classList.add('form-error');
        
        // Вставляем после подписи или прямо после поля, если подписи нет
        const undertext = input.nextElementSibling;
        if (undertext && undertext.classList.contains('form-undertext')) {
            undertext.after(errorElement);
        } else {
            input.after(errorElement);
        }
    }
    
    input.classList.add('input-error');
    errorElement.textContent = message;
}

/**
 * Скрыть сообщение об ошибке
 * @param {HTMLInputElement} input - Поле ввода
 */
function hideError(input) {
    input.classList.remove('input-error');
    
    // Ищем сообщение об ошибке
    let errorElement = input.nextElementSibling;
    
    // Если следующий элемент - текст под полем, то ищем дальше
    if (errorElement && errorElement.classList.contains('form-undertext')) {
        errorElement = errorElement.nextElementSibling;
    }
    
    // Если сообщение об ошибке есть, удаляем его
    if (errorElement && errorElement.classList.contains('form-error')) {
        errorElement.remove();
    }
}

/**
 * Показать основное модальное окно оплаты
 */
function showMainPaymentModal() {
    console.log('Showing main payment modal');
    const paymentModalContent = document.querySelector('.payment-modal-content');
    const paymentModalNewcard = document.querySelector('.payment-modal-newcard');
    
    if (paymentModalContent && paymentModalNewcard) {
        console.log('Found modal elements, switching to main payment');
        paymentModalContent.style.display = 'block';
        paymentModalNewcard.style.display = 'none';
    } else {
        console.error('Modal elements not found', {
            paymentModalContent,
            paymentModalNewcard
        });
    }
}

/**
 * Показать модальное окно с деталями карты
 */
function showCardDetailsModal() {
    console.log('Showing card details modal');
    const paymentModal = document.querySelector('.payment-modal');
    const paymentModalContent = document.querySelector('.payment-modal-content');
    const paymentModalNewcard = document.querySelector('.payment-modal-newcard');
    
    if (paymentModal && paymentModalContent && paymentModalNewcard) {
        console.log('Found modal elements, switching to card details');
        paymentModalContent.style.display = 'none';
        paymentModalNewcard.style.display = 'block';
    } else {
        console.error('Modal elements not found', {
            paymentModal,
            paymentModalContent,
            paymentModalNewcard
        });
    }
}

/**
 * Открыть модальное окно оплаты
 */
function openPaymentModal() {
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) {
        paymentModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Блокировка скролла
        // При открытии всегда показываем основное модальное окно
        showMainPaymentModal();
    }
}

/**
 * Закрыть модальное окно оплаты
 */
function closePaymentModal() {
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) {
        paymentModal.classList.remove('active');
        document.body.style.overflow = ''; // Разблокировка скролла
    }
}

/**
 * Обновить сумму оплаты в модальном окне
 * @param {string} amount - Сумма для оплаты
 */
function updatePaymentAmount(amount) {
    const amountEl = document.querySelector('.payment-detail-value:last-child');
    const submitBtn = document.querySelector('.payment-modal-submit p');
    
    if (amountEl) {
        amountEl.textContent = amount;
    }
    
    if (submitBtn) {
        submitBtn.textContent = `Оплатити ${amount}`;
    }
}

/**
 * Обновить название услуги в модальном окне
 * @param {string} service - Название услуги
 */
function updatePaymentService(service) {
    const modalHeader = document.querySelector('.payment-modal-header h3');
    if (modalHeader) {
        modalHeader.textContent = `Оплата: ${service}`;
    }
}

/**
 * Обработать оплату
 */
function processPayment() {
    // Здесь будет реальная логика обработки оплаты
    const activeMethod = document.querySelector('.payment-method.active');
    let paymentMethod = 'карта';
    
    if (activeMethod) {
        paymentMethod = activeMethod.querySelector('p').textContent;
    }
    
    alert(`Оплата успішно виконана "${paymentMethod}"!`);
    closePaymentModal();
    
    // Опционально: обновить статус оплаты на странице
    updatePaymentStatus();
}

/**
 * Обновить статус оплаты на странице
 */
function updatePaymentStatus() {
    // Обновляем иконку статуса оплаты
    const clickedPayButton = document.activeElement;
    let statusImg;
    
    if (clickedPayButton) {
        // Пытаемся найти статусный элемент на странице относительно кнопки, которую нажали
        const appointmentItem = clickedPayButton.closest('.client-meetings-item, .client-meeting-item');
        if (appointmentItem) {
            statusImg = appointmentItem.querySelector('.client-meetings-item-payment-status img, .client-meeting-item-payment-status img');
        }
    }
    
    // Если не нашли по кнопке, ищем на всей странице
    if (!statusImg) {
        statusImg = document.querySelector('.client-meetings-item-payment-status img, .client-meeting-item-payment-status img');
    }
    
    if (statusImg) {
        statusImg.src = './img/icons/approoved.svg';
    }
    
    // Скрыть кнопку оплаты, если нужно
    if (clickedPayButton && 
        (clickedPayButton.classList.contains('client-meeting-item-pay') || 
        clickedPayButton.classList.contains('client-meetings-item-pay'))) {
        clickedPayButton.style.display = 'none';
    }
}

// Функция для инициализации обработчиков после загрузки модальных окон
function initPaymentModalHandlers() {
    console.log('Initializing payment modal handlers');
    
    // Проверяем, загружено ли модальное окно в DOM
    const paymentModal = document.querySelector('.payment-modal');
    if (!paymentModal) {
        console.warn('Payment modal not found in DOM, scheduling retry');
        // Если модальное окно ещё не загружено, пробуем позже
        setTimeout(initPaymentModalHandlers, 500);
        return;
    }
    
    console.log('Payment modal found in DOM, setting up handlers');
    
    // Обработчик для кнопки перехода к вводу данных карты
    const cardPaymentBtn = paymentModal.querySelector('.payment-modal-card');
    if (cardPaymentBtn) {
        console.log('Found card payment button, adding click listener');
        cardPaymentBtn.addEventListener('click', function() {
            console.log('Card payment button clicked');
            showCardDetailsModal();
        });
    } else {
        console.warn('Card payment button not found');
    }
    
    // Обработчик для кнопки "Назад"
    const backBtn = paymentModal.querySelector('.prev-page-btn');
    if (backBtn) {
        console.log('Found back button, adding click listener');
        backBtn.addEventListener('click', function(e) {
            console.log('Back button clicked');
            e.preventDefault();
            showMainPaymentModal();
        });
    } else {
        console.warn('Back button not found');
    }
}

// Запускаем инициализацию после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting payment modal initialization');
    
    // Инициализируем обработчики для модальных окон
    initPaymentModalHandlers();
    
    // Проверяем, была ли уже определена функция initPaymentModal
    if (typeof initPaymentModal === 'function') {
        console.log('Initializing payment module');
        initPaymentModal();
    } else {
        console.warn('initPaymentModal function not found');
    }
}); 