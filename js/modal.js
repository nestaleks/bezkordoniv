/**
 * Модуль для управления модальными окнами
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Modal.js: Initializing modal windows');
    
    // Глобальные переменные для отслеживания состояния модальных окон
    let activeModal = null;
    
    // Сначала проверим, есть ли на странице нужные элементы
    const paymentCard = document.querySelector('.payment-modal-card');
    const paymentModalNewcard = document.getElementById('payment-modal-newcard');
    
    // Если обнаружены элементы, добавляем прямой обработчик
    if (paymentCard && paymentModalNewcard) {
        console.log('Modal.js: Found payment card elements, adding direct handler');
        
        // Простой обработчик для кнопки оплаты картой
        paymentCard.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Modal.js: payment-modal-card clicked directly');
            
            // Закрываем текущее окно выбора метода оплаты
            const appointmentModal = document.getElementById('modal-pay-appointment-item');
            if (appointmentModal) {
                appointmentModal.classList.remove('active');
                appointmentModal.style.display = 'none';
            }
            
            // Показываем окно ввода данных карты
            paymentModalNewcard.classList.add('active');
            paymentModalNewcard.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
        
        // Прямой обработчик для кнопки "Назад"
        const backButton = paymentModalNewcard.querySelector('.prev-page-btn');
        if (backButton) {
            backButton.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Modal.js: Back button clicked directly');
                
                // Скрываем окно ввода данных карты
                paymentModalNewcard.classList.remove('active');
                paymentModalNewcard.style.display = 'none';
                
                // Показываем окно выбора метода оплаты
                const appointmentModal = document.getElementById('modal-pay-appointment-item');
                if (appointmentModal) {
                    appointmentModal.classList.add('active');
                    appointmentModal.style.display = 'flex';
                }
            });
        }
        
        // Прямой обработчик для кнопки закрытия
        const closeButton = paymentModalNewcard.querySelector('.modal-window-close');
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                console.log('Modal.js: Close button clicked directly');
                paymentModalNewcard.classList.remove('active');
                paymentModalNewcard.style.display = 'none';
                document.body.style.overflow = '';
            });
        }
        
        // Прямой обработчик для кнопки отмены
        const cancelButton = paymentModalNewcard.querySelector('#paymentModalClose');
        if (cancelButton) {
            cancelButton.addEventListener('click', function() {
                console.log('Modal.js: Cancel button clicked directly');
                paymentModalNewcard.classList.remove('active');
                paymentModalNewcard.style.display = 'none';
                document.body.style.overflow = '';
            });
        }
    }
    
    // Инициализация всех модальных окон на странице
    initModals();
    
    // Инициализация обработчиков для таблицы транзакций эксперта
    setupExpertIncomingTableHandlers();
    
    /**
     * Инициализация обработчиков для всех модальных окон
     */
    function initModals() {
        // Найдем все кнопки с атрибутом data-modal
        const modalTriggers = document.querySelectorAll('[data-modal]');
        console.log(`Modal.js: Found ${modalTriggers.length} modal triggers`);
        
        // Добавляем обработчики для всех триггеров модальных окон
        modalTriggers.forEach(trigger => {
            const modalId = trigger.getAttribute('data-modal');
            console.log(`Modal.js: Setting up trigger for modal: ${modalId}`);
            
            // Обработчик клика по триггеру
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openModal(modalId);
            });
        });
        
        // Находим все кнопки закрытия модальных окон и добавляем им обработчики
        const closeButtons = document.querySelectorAll('.modal-window-close, .modal-close-btn');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.modal, .modal-recharge-balance, .modal-pay-appointments, .payment-modal, .modal-pay-appointment-item, .payment-modal-newcard, .modal-incoming-about');
                if (modal) {
                    closeModal(modal.id);
                } else {
                    // Если не удалось найти родительское модальное окно, закрываем все
                    closeAllModals();
                }
            });
        });
        
        // Закрытие модального окна при клике вне его содержимого
        document.addEventListener('click', function(e) {
            if ((e.target.classList.contains('modal') || 
                 e.target.classList.contains('modal-recharge-balance') || 
                 e.target.classList.contains('modal-pay-appointments') ||
                 e.target.classList.contains('payment-modal') ||
                 e.target.classList.contains('modal-pay-appointment-item') ||
                 e.target.classList.contains('modal-incoming-about')) && 
                e.target.classList.contains('active')) {
                closeModal(e.target.id);
            }
        });
        
        // Инициализация специальных модальных окон
        setupRechargeBalanceModal();
        setupPayAppointmentsModal();
        setupPayAppointmentItemModal();
        setupPaymentNewcardModal();
        setupIncomingAboutModal();
        
        // НОВЫЙ ПОДХОД - прямые обработчики для специфических элементов
        setupSpecificHandlers();
    }
    
    /**
     * Настройка специфических обработчиков для интерактивных элементов
     */
    function setupSpecificHandlers() {
        // Обработчик для кнопки выбора оплаты картой
        const cardButtons = document.querySelectorAll('.payment-modal-card');
        cardButtons.forEach(button => {
            // Удаляем все существующие обработчики
            const buttonClone = button.cloneNode(true);
            button.parentNode.replaceChild(buttonClone, button);
            
            // Добавляем новый простой обработчик
            buttonClone.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Modal.js: Payment card button clicked');
                
                // Закрываем все модальные окна
                closeAllModals();
                
                // Открываем модальное окно для ввода данных карты
                const newCardModal = document.getElementById('payment-modal-newcard');
                if (newCardModal) {
                    console.log('Modal.js: Opening payment-modal-newcard');
                    newCardModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                    activeModal = newCardModal;
                }
            });
        });
        
        // Обработчик для кнопки "Назад" в окне ввода данных карты
        const backButtons = document.querySelectorAll('.prev-page-btn');
        backButtons.forEach(button => {
            // Удаляем все существующие обработчики
            const buttonClone = button.cloneNode(true);
            button.parentNode.replaceChild(buttonClone, button);
            
            // Добавляем новый простой обработчик
            buttonClone.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Modal.js: Back button clicked');
                
                // Закрываем все модальные окна
                closeAllModals();
                
                // Открываем модальное окно выбора способа оплаты
                openModal('modal-pay-appointment-item');
            });
        });
        
        // Обработчик для кнопки "Отменить" в окне ввода данных карты
        const paymentCancelButtons = document.querySelectorAll('#payment-modal-newcard #paymentModalClose');
        paymentCancelButtons.forEach(button => {
            // Удаляем все существующие обработчики
            const buttonClone = button.cloneNode(true);
            button.parentNode.replaceChild(buttonClone, button);
            
            // Добавляем новый простой обработчик
            buttonClone.addEventListener('click', function() {
                console.log('Modal.js: Cancel button clicked in payment-modal-newcard');
                closeAllModals();
            });
        });
        
        // Обработчик для кнопки "Продолжить" в окне ввода данных карты
        const paymentSubmitButtons = document.querySelectorAll('#payment-modal-newcard #paymentModalPay');
        paymentSubmitButtons.forEach(button => {
            // Удаляем все существующие обработчики
            const buttonClone = button.cloneNode(true);
            button.parentNode.replaceChild(buttonClone, button);
            
            // Добавляем новый простой обработчик
            buttonClone.addEventListener('click', function(e) {
                const cardNumberInput = document.querySelector('#payment-modal-newcard .card-number');
                const cardDateInput = document.querySelector('#payment-modal-newcard .card-date');
                const cardCvvInput = document.querySelector('#payment-modal-newcard .card-cvv');
                
                if (validateCardForm(e, cardNumberInput, cardDateInput, cardCvvInput)) {
                    console.log('Modal.js: Payment successful in payment-modal-newcard');
                    alert('Оплата картой успешно проведена!');
                    closeAllModals();
                }
            });
        });
    }
    
    /**
     * Открывает модальное окно по его ID
     */
    function openModal(modalId) {
        console.log(`Modal.js: Opening modal: ${modalId}`);
        
        // Закрываем активное модальное окно, если оно есть
        if (activeModal) {
            closeModal(activeModal.id);
        }
        
        // Ищем модальное окно
        const modal = document.getElementById(modalId);
        
        if (!modal) {
            console.error(`Modal.js: Modal with ID ${modalId} not found`);
            return;
        }
        
        // Открываем модальное окно
        modal.classList.add('active');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
        activeModal = modal;
        
        console.log(`Modal.js: Modal ${modalId} opened`);
        
        // Запускаем событие открытия модального окна
        const event = new CustomEvent('modal:opened', { detail: { modalId } });
        document.dispatchEvent(event);
    }
    
    /**
     * Закрывает модальное окно по его ID
     */
    function closeModal(modalId) {
        console.log(`Modal.js: Closing modal: ${modalId}`);
        
        // Ищем модальное окно
        const modal = document.getElementById(modalId);
        
        if (!modal) {
            console.error(`Modal.js: Modal with ID ${modalId} not found`);
            return;
        }
        
        // Закрываем модальное окно
        modal.classList.remove('active');
        modal.style.display = 'none';
        
        // Если это было активное модальное окно, сбрасываем его
        if (activeModal === modal) {
            activeModal = null;
        document.body.style.overflow = ''; // Восстанавливаем прокрутку страницы
        }
        
        console.log(`Modal.js: Modal ${modalId} closed`);
        
        // Запускаем событие закрытия модального окна
        const event = new CustomEvent('modal:closed', { detail: { modalId } });
        document.dispatchEvent(event);
    }
    
    /**
     * Закрывает все модальные окна
     */
    function closeAllModals() {
        console.log('Modal.js: Closing all modals');
        
        // Находим все модальные окна
        const modals = document.querySelectorAll('.modal, .modal-recharge-balance, .modal-pay-appointments, .payment-modal, .modal-pay-appointment-item, .payment-modal-newcard, .modal-incoming-about');
        
        // Закрываем каждое модальное окно
        modals.forEach(modal => {
            modal.classList.remove('active');
            modal.style.display = 'none';
        });
        
        // Восстанавливаем прокрутку страницы
        document.body.style.overflow = '';
        activeModal = null;
        
        console.log('Modal.js: All modals closed');
    }
    
    /**
     * Настройка модального окна пополнения баланса
     */
    function setupRechargeBalanceModal() {
        const rechargeModal = document.getElementById('modal-recharge-balance');
        
        if (!rechargeModal) {
            console.log('Modal.js: Recharge balance modal not found on this page');
            return;
        }
        
        console.log('Modal.js: Setting up recharge balance modal');
        
        // Инициализация валидации карты для этого модального окна
        const cardNumberInput = rechargeModal.querySelector('.card-number');
        const cardDateInput = rechargeModal.querySelector('.card-date');
        const cardCvvInput = rechargeModal.querySelector('.card-cvv');
        const submitButton = rechargeModal.querySelector('.modal-pay-btn');
        
        if (cardNumberInput && cardDateInput && cardCvvInput) {
            console.log('Modal.js: Card inputs found in recharge balance modal');
            
            // Привязываем валидаторы к полям
            setupCardNumberValidation(cardNumberInput);
            setupCardDateValidation(cardDateInput);
            setupCardCvvValidation(cardCvvInput);
            
            // Проверка всей формы при отправке
            if (submitButton) {
                submitButton.addEventListener('click', function(e) {
                    if (validateCardForm(e, cardNumberInput, cardDateInput, cardCvvInput)) {
                        alert('Баланс успешно пополнен!');
                closeModal('modal-recharge-balance');
                    }
                });
            }
        }
    }
    
    /**
     * Настройка модального окна оплаты встреч
     */
    function setupPayAppointmentsModal() {
        const payAppointmentsModal = document.getElementById('modal-pay-appointments');
        
        if (!payAppointmentsModal) {
            console.log('Modal.js: Pay appointments modal not found on this page');
            return;
        }
        
        console.log('Modal.js: Setting up pay appointments modal');
        
        // Обработка кнопок оплаты внутри модального окна
        const paymentButtons = payAppointmentsModal.querySelectorAll('.payment-btn');
        paymentButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Логируем нажатие на кнопку оплаты
                console.log('Modal.js: Payment button clicked for appointment');
                
                // Закрываем текущее модальное окно перед открытием нового
                closeModal('modal-pay-appointments');
                
                // Открываем модальное окно оплаты конкретной встречи
                openModal('modal-pay-appointment-item');
                
                // Получаем данные о встрече для отображения в модальном окне
                const appointmentItem = button.closest('.payment-appointment-item');
                if (appointmentItem) {
                    // Получаем информацию о встрече
                    const date = appointmentItem.querySelector('.payment-appointment-date p:nth-child(2)').textContent;
                    const time = appointmentItem.querySelector('.payment-appointment-date p:nth-child(4)').textContent;
                    const location = appointmentItem.querySelector('.payment-appointment-date p:nth-child(6)').textContent;
                    const expertName = appointmentItem.querySelector('.payment-expert-info p:first-child').textContent;
                    const expertRole = appointmentItem.querySelector('.payment-expert-info p:last-child').textContent;
                    const cost = appointmentItem.querySelector('.payment-appointment-price p').textContent;
                    const expertImg = appointmentItem.querySelector('.payment-appointment-expert-info img').src;
                    
                    // Заполняем данные в модальном окне оплаты конкретной встречи
                    const payAppointmentItemModal = document.getElementById('modal-pay-appointment-item');
                    if (payAppointmentItemModal) {
                        const targetDate = payAppointmentItemModal.querySelector('.payment-appointment-date p:nth-child(2)');
                        const targetTime = payAppointmentItemModal.querySelector('.payment-appointment-date p:nth-child(4)');
                        const targetLocation = payAppointmentItemModal.querySelector('.payment-appointment-date p:nth-child(6)');
                        const targetExpertName = payAppointmentItemModal.querySelector('.payment-expert-info p:first-child');
                        const targetExpertRole = payAppointmentItemModal.querySelector('.payment-expert-info p:last-child');
                        const targetCost = payAppointmentItemModal.querySelector('.payment-appointment-price p');
                        const targetExpertImg = payAppointmentItemModal.querySelector('.payment-appointment-expert-info img');
                        
                        if (targetDate) targetDate.textContent = date;
                        if (targetTime) targetTime.textContent = time;
                        if (targetLocation) targetLocation.textContent = location;
                        if (targetExpertName) targetExpertName.textContent = expertName;
                        if (targetExpertRole) targetExpertRole.textContent = expertRole;
                        if (targetCost) targetCost.textContent = cost;
                        if (targetExpertImg) targetExpertImg.src = expertImg;
                    }
                }
            });
        });
    }

    /**
     * Настройка модального окна оплаты конкретной встречи
     */
    function setupPayAppointmentItemModal() {
        const payAppointmentItemModal = document.getElementById('modal-pay-appointment-item');
        
        if (!payAppointmentItemModal) {
            console.log('Modal.js: Pay appointment item modal not found on this page');
            return;
        }
        
        console.log('Modal.js: Setting up pay appointment item modal');
        
        // Обработчик для кнопки "Відмінити"
        const cancelButton = payAppointmentItemModal.querySelector('#paymentModalClose');
        if (cancelButton) {
            cancelButton.addEventListener('click', function() {
                closeModal('modal-pay-appointment-item');
            });
        }
        
        // Обработчик для кнопки "Продовжити"
        const confirmButton = payAppointmentItemModal.querySelector('#paymentModalPay');
        if (confirmButton) {
            confirmButton.addEventListener('click', function() {
                // Проверяем, выбран ли способ оплаты с баланса
                const balanceChooser = payAppointmentItemModal.querySelector('.payment-balance-choose');
                if (balanceChooser && balanceChooser.checked) {
                    alert('Оплата с баланса успешно произведена!');
                    closeModal('modal-pay-appointment-item');
                } else {
                    // Если не выбран способ оплаты с баланса, открываем окно оплаты картой
                    closeModal('modal-pay-appointment-item');
                    
                    // Открываем модальное окно ввода данных карты
                    const newCardModal = document.getElementById('payment-modal-newcard');
                    if (newCardModal) {
                        console.log('Modal.js: Opening payment-modal-newcard from continue button');
                        newCardModal.style.display = 'flex';
                        document.body.style.overflow = 'hidden';
                        activeModal = newCardModal;
                    }
                }
            });
        }
    }
    
    /**
     * Настройка модального окна для ввода данных новой карты
     */
    function setupPaymentNewcardModal() {
        const paymentModalNewcard = document.getElementById('payment-modal-newcard');
        
        if (!paymentModalNewcard) {
            console.log('Modal.js: Payment modal newcard not found on this page');
            return;
        }
        
        console.log('Modal.js: Setting up payment modal newcard');
        
        // Инициализация валидации полей карты
        const cardNumberInput = paymentModalNewcard.querySelector('.card-number');
        const cardDateInput = paymentModalNewcard.querySelector('.card-date');
        const cardCvvInput = paymentModalNewcard.querySelector('.card-cvv');
        
        if (cardNumberInput && cardDateInput && cardCvvInput) {
            // Настройка валидации карты
            setupCardNumberValidation(cardNumberInput);
            setupCardDateValidation(cardDateInput);
            setupCardCvvValidation(cardCvvInput);
        }
    }
    
    /**
     * Настройка модального окна информации о транзакции
     */
    function setupIncomingAboutModal() {
        const incomingAboutModal = document.getElementById('modal-incoming-about');
        
        if (!incomingAboutModal) {
            console.log('Modal.js: Incoming about modal not found on this page');
            return;
        }
        
        console.log('Modal.js: Setting up incoming about modal');
        
        // Прямой обработчик для кнопки закрытия
        const closeButton = incomingAboutModal.querySelector('.modal-window-close');
        if (closeButton) {
            // Удаляем все существующие обработчики
            const buttonClone = closeButton.cloneNode(true);
            closeButton.parentNode.replaceChild(buttonClone, closeButton);
            
            // Добавляем новый обработчик
            buttonClone.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Modal.js: Close button clicked in modal-incoming-about');
                closeModal('modal-incoming-about');
            });
        } else {
            console.log('Modal.js: Close button not found in modal-incoming-about');
        }
    }
    
    /* ============== ВАЛИДАЦИЯ КАРТЫ ============== */
    
    /**
     * Настройка валидации номера карты
     * @param {HTMLElement} cardNumberInput - Поле ввода номера карты
     */
    function setupCardNumberValidation(cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            
            // Форматируем номер карты с пробелами каждые 4 цифры
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            
            e.target.value = formattedValue;
            
            // Проверяем валидность номера карты (Luhn алгоритм)
            const isValid = validateCardNumber(value);
            updateValidationStyle(e.target, isValid && value.length >= 13);
        });
    }
    
    /**
     * Настройка валидации срока действия карты
     * @param {HTMLElement} cardDateInput - Поле ввода срока действия
     */
    function setupCardDateValidation(cardDateInput) {
        cardDateInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            
            // Форматируем дату как MM/YY
            if (value.length > 0) {
                // Месяц не может быть больше 12
                let month = parseInt(value.substring(0, 2));
                if (month > 12) {
                    month = 12;
                    value = month.toString() + value.substring(2);
                }
                
                formattedValue = value.substring(0, 2);
                
                if (value.length > 2) {
                    formattedValue += '/' + value.substring(2, 4);
                }
            }
            
            e.target.value = formattedValue;
            
            // Проверяем, что дата не просрочена
            const isValid = validateCardDate(formattedValue);
            updateValidationStyle(e.target, isValid);
        });
    }
    
    /**
     * Настройка валидации CVV кода
     * @param {HTMLElement} cardCvvInput - Поле ввода CVV
     */
    function setupCardCvvValidation(cardCvvInput) {
        cardCvvInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            e.target.value = value;
            
            // CVV должен быть 3-4 цифры
            const isValid = value.length >= 3;
            updateValidationStyle(e.target, isValid);
        });
    }
    
    /**
     * Валидация всей формы карты
     * @param {Event} e - Событие
     * @param {HTMLElement} cardNumberInput - Поле ввода номера карты
     * @param {HTMLElement} cardDateInput - Поле ввода срока действия
     * @param {HTMLElement} cardCvvInput - Поле ввода CVV
     * @returns {boolean} - Результат валидации (true - успех, false - ошибка)
     */
    function validateCardForm(e, cardNumberInput, cardDateInput, cardCvvInput) {
        if (!cardNumberInput || !cardDateInput || !cardCvvInput) {
            console.error('Modal.js: Card inputs not found');
            return false;
        }
        
        const isCardValid = validateCardNumber(cardNumberInput.value.replace(/\D/g, ''));
        const isDateValid = validateCardDate(cardDateInput.value);
        const isCvvValid = cardCvvInput.value.replace(/\D/g, '').length >= 3;
        
        if (!isCardValid || !isDateValid || !isCvvValid) {
            e.preventDefault();
            alert('Пожалуйста, проверьте правильность ввода данных карты');
            
            updateValidationStyle(cardNumberInput, isCardValid);
            updateValidationStyle(cardDateInput, isDateValid);
            updateValidationStyle(cardCvvInput, isCvvValid);
            
            return false;
        }
        
        return true;
    }
    
    /**
     * Алгоритм Луна для проверки номера карты
     * @param {string} cardNumber - Номер карты (только цифры)
     * @returns {boolean} - Валидность номера карты
     */
    function validateCardNumber(cardNumber) {
        if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
            return false;
        }
        
        let sum = 0;
        let double = false;
        
        // Проходим с конца номера
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i));
            
            if (double) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            
            sum += digit;
            double = !double;
        }
        
        return sum % 10 === 0;
    }
    
    /**
     * Проверка даты карты
     * @param {string} date - Дата в формате MM/YY
     * @returns {boolean} - Валидность даты
     */
    function validateCardDate(date) {
        if (!date || date.length !== 5) {
            return false;
        }
        
        const parts = date.split('/');
        if (parts.length !== 2) {
            return false;
        }
        
        const month = parseInt(parts[0]);
        let year = parseInt(parts[1]);
        
        if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
            return false;
        }
        
        // Добавляем 2000 к году (20xx)
        year += 2000;
        
        // Получаем текущую дату
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // JavaScript месяцы с 0 до 11
        
        // Проверяем, не истек ли срок действия
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Обновление стиля поля в зависимости от валидности
     * @param {HTMLElement} element - Элемент для обновления стиля
     * @param {boolean} isValid - Флаг валидности
     */
    function updateValidationStyle(element, isValid) {
        if (!element) return;
        
        if (isValid) {
            element.classList.remove('input-error');
            // Можно добавить класс valid если нужно
            // element.classList.add('input-valid');
        } else {
            element.classList.add('input-error');
            // element.classList.remove('input-valid');
        }
    }

    /**
     * Настройка обработчиков для строк таблицы поступлений эксперта
     */
    function setupExpertIncomingTableHandlers() {
        console.log('Modal.js: Looking for expert-incoming-table...');
        
        // Используем setTimeout чтобы убедиться, что DOM полностью загружен
        setTimeout(function() {
            const expertIncomingTable = document.querySelector('.expert-incoming-table');
            
            if (!expertIncomingTable) {
                console.log('Modal.js: Expert incoming table not found on this page');
                return;
            }
            
            console.log('Modal.js: Found expert-incoming-table, setting up row handlers');
            
            // Получаем все строки в tbody таблицы
            const tableRows = expertIncomingTable.querySelectorAll('tbody tr');
            
            if (tableRows.length === 0) {
                console.log('Modal.js: No rows found in expert-incoming-table');
                return;
            }
            
            console.log(`Modal.js: Found ${tableRows.length} rows in expert-incoming-table`);
            
            // Добавляем обработчик клика для каждой строки
            tableRows.forEach((row, index) => {
                row.style.cursor = 'pointer'; // Меняем курсор, чтобы показать кликабельность
                
                // Удаляем существующие обработчики (на всякий случай)
                const newRow = row.cloneNode(true);
                row.parentNode.replaceChild(newRow, row);
                
                console.log(`Modal.js: Adding click handler to row ${index + 1}`);
                
                newRow.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    console.log('Modal.js: Table row clicked, opening modal-incoming-about');
                    
                    // Открываем модальное окно с информацией о транзакции
                    const modalId = 'modal-incoming-about';
                    
                    // Получаем данные из строки таблицы
                    const userName = this.querySelector('td:first-child p').textContent;
                    const userImg = this.querySelector('td:first-child img').src;
                    
                    // Находим модальное окно
                    const modal = document.getElementById(modalId);
                    
                    if (modal) {
                        // Обновляем данные в модальном окне
                        const modalUserName = modal.querySelector('.modal-incoming-user p');
                        const modalUserImg = modal.querySelector('.modal-incoming-user img');
                        
                        if (modalUserName) modalUserName.textContent = userName;
                        if (modalUserImg) modalUserImg.src = userImg;
                        
                        // Открываем модальное окно
                        openModal(modalId);
                    } else {
                        console.error(`Modal.js: Modal with ID ${modalId} not found`);
                    }
                });
            });
        }, 500); // Даем время на загрузку DOM
    }

    // Дополнительный вызов на случай, если таблица загружается динамически
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(setupExpertIncomingTableHandlers, 1000);
    });
}); 