/**
 * Модуль для работы с модальным окном пополнения баланса
 */

// Инициализация модального окна пополнения баланса
function initWalletModal() {
    // Находим кнопку пополнения баланса
    const rechargeBtn = document.querySelector('.client-wallet-incoming');
    const payAppointmentBtn = document.querySelector('.client-wallet-outcoming');
    const modal = document.querySelector('.payment-modal');
    const rechargeModal = modal.querySelector('.modal-recharge-balance');
    const payAppointmentModal = modal.querySelector('.modal-pay-appointments');
    const closeBtns = modal.querySelectorAll('.modal-window-close');
    const cancelBtn = modal.querySelector('#paymentModalClose');
    const payBtn = modal.querySelector('#paymentModalPay');
    const appointmentPayBtns = modal.querySelectorAll('.payment-appointment-pay');

    if (!rechargeBtn || !modal) {
        console.warn('Элементы модального окна пополнения баланса не найдены');
        return;
    }

    // Открытие модального окна по клику на кнопку пополнения
    rechargeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openWalletModal('recharge');
    });

    // Открытие модального окна по клику на кнопку оплаты встречи
    if (payAppointmentBtn) {
        payAppointmentBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openWalletModal('pay-appointment');
        });
    }

    // Закрытие модальных окон при клике на крестик
    if (closeBtns) {
        closeBtns.forEach(btn => {
            btn.addEventListener('click', closeWalletModal);
        });
    }

    // Закрытие модального окна при клике на кнопку отмены
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeWalletModal);
    }

    // Обработка кнопки оплаты
    if (payBtn) {
        payBtn.addEventListener('click', processRecharge);
    }

    // Обработка кнопок оплаты встреч
    if (appointmentPayBtns) {
        appointmentPayBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                const appointmentItem = this.closest('.payment-appointment-item');
                const expertName = appointmentItem.querySelector('.payment-expert-info p:first-child').textContent;
                const cost = appointmentItem.querySelector('.payment-appointment-cost p').textContent;
                
                // Переключаемся на модальное окно оплаты картой
                payAppointmentModal.style.display = 'none';
                rechargeModal.style.display = 'flex';
                
                // Обновляем заголовок и сумму
                const modalTitle = rechargeModal.querySelector('.subtitle-2');
                if (modalTitle) {
                    modalTitle.textContent = `Оплата: ${expertName}`;
                }
                
                const payButton = rechargeModal.querySelector('#paymentModalPay p');
                if (payButton) {
                    payButton.textContent = `Сплатити ${cost}`;
                }
            });
        });
    }

    // Инициализация валидации карты
    initCardValidation();
}

/**
 * Инициализация валидации данных кредитной карты
 */
function initCardValidation() {
    // Получение полей формы
    const cardNumberInput = document.querySelector('.modal-recharge-balance input[placeholder="Номер картки"]');
    const cardExpiryInput = document.querySelector('.modal-recharge-balance input[placeholder="Термін дії картки"]');
    const cardCvvInput = document.querySelector('.modal-recharge-balance input[placeholder="CVV код"]');
    const cardPayButton = document.querySelector('.modal-recharge-balance #paymentModalPay');

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
 * Открыть модальное окно
 * @param {string} type - Тип модального окна ('recharge' или 'pay-appointment')
 */
function openWalletModal(type = 'recharge') {
    const modal = document.querySelector('.payment-modal');
    const rechargeModal = modal.querySelector('.modal-recharge-balance');
    const payAppointmentModal = modal.querySelector('.modal-pay-appointments');

    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Блокировка скролла

        // Показываем нужное модальное окно
        if (type === 'recharge') {
            rechargeModal.style.display = 'flex';
            payAppointmentModal.style.display = 'none';
        } else {
            rechargeModal.style.display = 'none';
            payAppointmentModal.style.display = 'flex';
        }
    }
}

/**
 * Закрыть модальное окно пополнения баланса
 */
function closeWalletModal() {
    const modal = document.querySelector('.payment-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Разблокировка скролла
    }
}

/**
 * Обработать пополнение баланса
 */
function processRecharge() {
    // Получаем все поля формы
    const cardNumberInput = document.querySelector('.modal-recharge-balance input[placeholder="Номер картки"]');
    const cardExpiryInput = document.querySelector('.modal-recharge-balance input[placeholder="Термін дії картки"]');
    const cardCvvInput = document.querySelector('.modal-recharge-balance input[placeholder="CVV код"]');
    
    // Проверяем валидность всех полей
    if (!validateCardNumber(cardNumberInput) || 
        !validateCVV(cardCvvInput) || 
        cardExpiryInput.value.length < 5) {
        return;
    }
    
    // Здесь будет реальная логика обработки пополнения баланса
    alert('Баланс успішно поповнено!');
    closeWalletModal();
    
    // Опционально: обновить отображение баланса на странице
    updateBalance();
}

/**
 * Обновить отображение баланса на странице
 */
function updateBalance() {
    // Здесь будет логика обновления баланса
    // Например, получение нового баланса с сервера и обновление UI
}

// Инициализация модуля при загрузке страницы
document.addEventListener('DOMContentLoaded', initWalletModal); 