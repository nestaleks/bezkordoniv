/**
 * Модуль для управления модальными окнами
 */

// Глобальные переменные для отслеживания состояния модальных окон
let activeModal = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Modal.js: Initializing modal windows');
    
    // Сначала проверим, есть ли на странице нужные элементы
    const paymentCard = document.querySelector('.payment-modal-card');
    const paymentModalNewcard = document.getElementById('payment-modal-newcard');
    
    console.log('Modal.js: Checking for modal elements');
    console.log('Modal.js: paymentCard element:', paymentCard);
    console.log('Modal.js: paymentModalNewcard element:', paymentModalNewcard);
    
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
    
    // Expert Page Modals
    // Description: Expert page verification and founder modals management
    // Functionality: Handles opening and closing of verification and founder modals
    initExpertPageModals();
});

// 1. Modal Core Management
// Description: Core modal window management functionality
// Functionality: Handles opening, closing, and state management of modal windows
function openModal(modalId) {
    console.log(`Modal.js: Opening modal: ${modalId}`);
    
    if (!modalId) {
        console.error('Modal.js: No modal ID provided');
        return;
    }
    
    if (activeModal) {
        console.log(`Modal.js: Closing active modal: ${activeModal.id}`);
        closeModal(activeModal.id);
    }
    
    const modal = document.getElementById(modalId);
    console.log(`Modal.js: Found modal element:`, modal);
    
    if (!modal) {
        console.error(`Modal.js: Modal with ID ${modalId} not found`);
        return;
    }
    
    try {
        modal.classList.add('active');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        activeModal = modal;
        
        console.log(`Modal.js: Modal ${modalId} opened successfully`);
        
        const event = new CustomEvent('modal:opened', { detail: { modalId } });
        document.dispatchEvent(event);
    } catch (error) {
        console.error(`Modal.js: Error opening modal ${modalId}:`, error);
    }
}

function closeModal(modalId) {
    console.log(`Modal.js: Closing modal: ${modalId}`);
    
    const modal = document.getElementById(modalId);
    
    if (!modal) {
        console.error(`Modal.js: Modal with ID ${modalId} not found`);
        return;
    }
    
    modal.classList.remove('active');
    modal.style.display = 'none';
    
    if (activeModal === modal) {
        activeModal = null;
        document.body.style.overflow = '';
    }
    
    console.log(`Modal.js: Modal ${modalId} closed`);
    
    const event = new CustomEvent('modal:closed', { detail: { modalId } });
    document.dispatchEvent(event);
}

function closeAllModals() {
    console.log('Modal.js: Closing all modals');
    
    const modals = document.querySelectorAll('.modal, .modal-recharge-balance, .modal-pay-appointments, .payment-modal, .modal-pay-appointment-item, .payment-modal-newcard, .modal-incoming-about, .modal-request-withdraw, .chat-files-modal');
    
    modals.forEach(modal => {
        modal.classList.remove('active');
        modal.style.display = 'none';
    });
    
    document.body.style.overflow = '';
    activeModal = null;
    
    console.log('Modal.js: All modals closed');
}

// 2. Modal Initialization
// Description: Initial setup of modal windows
// Functionality: Sets up event listeners and initializes modal functionality
function initModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    console.log(`Modal.js: Found ${modalTriggers.length} modal triggers`);
    
    modalTriggers.forEach(trigger => {
        const modalId = trigger.getAttribute('data-modal');
        console.log(`Modal.js: Setting up trigger for modal: ${modalId}`);
        console.log(`Modal.js: Trigger element:`, trigger);
        
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log(`Modal.js: Trigger clicked for modal: ${modalId}`);
            openModal(modalId);
        });
    });
    
    const closeButtons = document.querySelectorAll('.modal-window-close, .modal-close-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal, .modal-recharge-balance, .modal-pay-appointments, .payment-modal, .modal-pay-appointment-item, .payment-modal-newcard, .modal-incoming-about, .modal-request-withdraw');
            if (modal) {
                closeModal(modal.id);
            } else {
                closeAllModals();
            }
        });
    });
    
    document.addEventListener('click', function(e) {
        if ((e.target.classList.contains('modal') || 
             e.target.classList.contains('modal-recharge-balance') || 
             e.target.classList.contains('modal-pay-appointments') ||
             e.target.classList.contains('payment-modal') ||
             e.target.classList.contains('modal-pay-appointment-item') ||
             e.target.classList.contains('modal-incoming-about') ||
             e.target.classList.contains('chat-files-modal') ||
             e.target.classList.contains('modal-request-withdraw')) && 
            e.target.classList.contains('active')) {
            closeModal(e.target.id);
        }
    });
    
    setupRechargeBalanceModal();
    setupPayAppointmentsModal();
    setupPayAppointmentItemModal();
    setupPaymentNewcardModal();
    setupIncomingAboutModal();
    setupRequestWithdrawModal();
    setupChatFilesModal();
    setupSpecificHandlers();
}

// 3. Specific Modal Handlers
// Description: Handlers for specific modal types
// Functionality: Manages specific modal window behaviors and interactions
function setupSpecificHandlers() {
    const cardButtons = document.querySelectorAll('.payment-modal-card');
    cardButtons.forEach(button => {
        const buttonClone = button.cloneNode(true);
        button.parentNode.replaceChild(buttonClone, button);
        
        buttonClone.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Modal.js: Payment card button clicked');
            closeAllModals();
            
            const newCardModal = document.getElementById('payment-modal-newcard');
            if (newCardModal) {
                console.log('Modal.js: Opening payment-modal-newcard');
                newCardModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                activeModal = newCardModal;
            }
        });
    });
    
    const backButtons = document.querySelectorAll('.prev-page-btn:not(.to-prev-page .prev-page-btn)');
    backButtons.forEach(button => {
        const buttonClone = button.cloneNode(true);
        button.parentNode.replaceChild(buttonClone, button);
        
        buttonClone.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Modal.js: Back button clicked');
            closeAllModals();
            openModal('modal-pay-appointment-item');
        });
    });
    
    const paymentCancelButtons = document.querySelectorAll('#payment-modal-newcard #paymentModalClose');
    paymentCancelButtons.forEach(button => {
        const buttonClone = button.cloneNode(true);
        button.parentNode.replaceChild(buttonClone, button);
        
        buttonClone.addEventListener('click', function() {
            console.log('Modal.js: Cancel button clicked in payment-modal-newcard');
            closeAllModals();
        });
    });
    
    const paymentSubmitButtons = document.querySelectorAll('#payment-modal-newcard #paymentModalPay');
    paymentSubmitButtons.forEach(button => {
        const buttonClone = button.cloneNode(true);
        button.parentNode.replaceChild(buttonClone, button);
        
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

// 4. Recharge Balance Modal
// Description: Recharge balance modal management
// Functionality: Handles balance recharge operations and card validation
function setupRechargeBalanceModal() {
    const rechargeModal = document.getElementById('modal-recharge-balance');
    
    if (!rechargeModal) {
        console.log('Modal.js: Recharge balance modal not found on this page');
        return;
    }
    
    console.log('Modal.js: Setting up recharge balance modal');
    
    const cardNumberInput = rechargeModal.querySelector('.card-number');
    const cardDateInput = rechargeModal.querySelector('.card-date');
    const cardCvvInput = rechargeModal.querySelector('.card-cvv');
    const submitButton = rechargeModal.querySelector('.modal-pay-btn');
    
    if (cardNumberInput && cardDateInput && cardCvvInput) {
        console.log('Modal.js: Card inputs found in recharge balance modal');
        
        setupCardNumberValidation(cardNumberInput);
        setupCardDateValidation(cardDateInput);
        setupCardCvvValidation(cardCvvInput);
        
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

// 5. Pay Appointments Modal
// Description: Pay appointments modal management
// Functionality: Handles appointment payment operations
function setupPayAppointmentsModal() {
    const payAppointmentsModal = document.getElementById('modal-pay-appointments');
    
    if (!payAppointmentsModal) {
        console.log('Modal.js: Pay appointments modal not found on this page');
        return;
    }
    
    console.log('Modal.js: Setting up pay appointments modal');
    
    const paymentButtons = payAppointmentsModal.querySelectorAll('.payment-btn');
    paymentButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Modal.js: Payment button clicked for appointment');
            closeModal('modal-pay-appointments');
            openModal('modal-pay-appointment-item');
            
            const appointmentItem = button.closest('.payment-appointment-item');
            if (appointmentItem) {
                const date = appointmentItem.querySelector('.payment-appointment-date p:nth-child(2)').textContent;
                const time = appointmentItem.querySelector('.payment-appointment-date p:nth-child(4)').textContent;
                const location = appointmentItem.querySelector('.payment-appointment-date p:nth-child(6)').textContent;
                const expertName = appointmentItem.querySelector('.payment-expert-info p:first-child').textContent;
                const expertRole = appointmentItem.querySelector('.payment-expert-info p:last-child').textContent;
                const cost = appointmentItem.querySelector('.payment-appointment-price p').textContent;
                const expertImg = appointmentItem.querySelector('.payment-appointment-expert-info img').src;
                
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

// 6. Pay Appointment Item Modal
// Description: Pay appointment item modal management
// Functionality: Handles individual appointment payment operations
function setupPayAppointmentItemModal() {
    const payAppointmentItemModal = document.getElementById('modal-pay-appointment-item');
    
    if (!payAppointmentItemModal) {
        console.log('Modal.js: Pay appointment item modal not found on this page');
        return;
    }
    
    console.log('Modal.js: Setting up pay appointment item modal');
    
    const cancelButton = payAppointmentItemModal.querySelector('#paymentModalClose');
    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            closeModal('modal-pay-appointment-item');
        });
    }
    
    const confirmButton = payAppointmentItemModal.querySelector('#paymentModalPay');
    if (confirmButton) {
        confirmButton.addEventListener('click', function() {
            const balanceChooser = payAppointmentItemModal.querySelector('.payment-balance-choose');
            if (balanceChooser && balanceChooser.checked) {
                alert('Оплата с баланса успешно произведена!');
                closeModal('modal-pay-appointment-item');
            } else {
                closeModal('modal-pay-appointment-item');
                
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

// 7. Payment Newcard Modal
// Description: New card payment modal management
// Functionality: Handles new card payment operations and validation
function setupPaymentNewcardModal() {
    const paymentModalNewcard = document.getElementById('payment-modal-newcard');
    
    if (!paymentModalNewcard) {
        console.log('Modal.js: Payment modal newcard not found on this page');
        return;
    }
    
    console.log('Modal.js: Setting up payment modal newcard');
    
    const cardNumberInput = paymentModalNewcard.querySelector('.card-number');
    const cardDateInput = paymentModalNewcard.querySelector('.card-date');
    const cardCvvInput = paymentModalNewcard.querySelector('.card-cvv');
    
    if (cardNumberInput && cardDateInput && cardCvvInput) {
        setupCardNumberValidation(cardNumberInput);
        setupCardDateValidation(cardDateInput);
        setupCardCvvValidation(cardCvvInput);
    }
}

// 8. Incoming About Modal
// Description: Incoming transaction details modal management
// Functionality: Handles display of transaction details
function setupIncomingAboutModal() {
    const incomingAboutModal = document.getElementById('modal-incoming-about');
    
    if (!incomingAboutModal) {
        console.log('Modal.js: Incoming about modal not found on this page');
        return;
    }
    
    console.log('Modal.js: Setting up incoming about modal');
    
    const closeButton = incomingAboutModal.querySelector('.modal-window-close');
    if (closeButton) {
        const buttonClone = closeButton.cloneNode(true);
        closeButton.parentNode.replaceChild(buttonClone, closeButton);
        
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

// 9. Request Withdraw Modal
// Description: Withdrawal request modal management
// Functionality: Handles withdrawal requests and payment settings
function setupRequestWithdrawModal() {
    const requestWithdrawButton = document.querySelector('.expert-balance-request');
    const requestWithdrawModal = document.getElementById('modal-request-withdraw');
    
    if (!requestWithdrawButton || !requestWithdrawModal) {
        console.log('Modal.js: Request withdraw elements not found');
        return;
    }
    
    console.log('Modal.js: Setting up request withdraw modal');
    
    requestWithdrawButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Modal.js: expert-balance-request clicked');
        
        requestWithdrawModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        activeModal = requestWithdrawModal;
    });
    
    const closeButton = requestWithdrawModal.querySelector('.modal-window-close');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            console.log('Modal.js: Close button clicked in request withdraw modal');
            requestWithdrawModal.classList.remove('active');
            document.body.style.overflow = '';
            activeModal = null;
        });
    }
    
    const settingsButton = requestWithdrawModal.querySelector('.modal-request-payments-setting');
    if (settingsButton) {
        settingsButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Modal.js: Payment settings button clicked');
            
            requestWithdrawModal.classList.remove('active');
            document.body.style.overflow = '';
            activeModal = null;
            
            const walletPage = document.querySelector('.expert-wallet-page');
            if (walletPage) {
                walletPage.classList.add('show-payments-settings');
            }
        });
    }
}

// 10. Chat Files Modal
// Description: Chat files modal management
// Functionality: Handles display and interaction with chat files
function setupChatFilesModal() {
    console.log('Modal.js: Setting up chat files modal');
    
    const filesBtnModals = document.querySelectorAll('[data-modal="chatFileModal"]');
    const chatFileModal = document.getElementById('chatFileModal');
    
    if (!filesBtnModals.length || !chatFileModal) {
        console.log('Modal.js: Chat files modal elements not found on this page');
        return;
    }

    console.log(`Modal.js: Found ${filesBtnModals.length} chat file buttons`);

    filesBtnModals.forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Modal.js: Chat files button clicked');
            
            if (activeModal) {
                activeModal.classList.remove('active');
                activeModal.style.display = 'none';
            }
            
            chatFileModal.classList.add('active');
            chatFileModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            activeModal = chatFileModal;
        });
    });

    const modalClose = chatFileModal.querySelector('.modal-window-close');
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            console.log('Modal.js: Close button clicked in chat files modal');
            chatFileModal.classList.remove('active');
            chatFileModal.style.display = 'none';
            document.body.style.overflow = '';
            activeModal = null;
        });
    }

    chatFileModal.addEventListener('click', function(e) {
        if (e.target === chatFileModal) {
            console.log('Modal.js: Outside click detected in chat files modal');
            chatFileModal.classList.remove('active');
            chatFileModal.style.display = 'none';
            document.body.style.overflow = '';
            activeModal = null;
        }
    });

    const chatFilesTabs = chatFileModal.querySelectorAll('.chat-files-tabs-media, .chat-files-tabs-links, .chat-files-tabs-documents');
    if (chatFilesTabs.length > 0) {
        chatFilesTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                chatFilesTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                const contentBlocks = chatFileModal.querySelectorAll('.modal-tab-content');
                contentBlocks.forEach(block => block.classList.remove('active'));
                
                let targetBlock;
                if (this.classList.contains('chat-files-tabs-media')) {
                    targetBlock = chatFileModal.querySelector('.modal-files-media');
                } else if (this.classList.contains('chat-files-tabs-links')) {
                    targetBlock = chatFileModal.querySelector('.modal-files-links');
                } else if (this.classList.contains('chat-files-tabs-documents')) {
                    targetBlock = chatFileModal.querySelector('.modal-files-documents');
                }
                
                if (targetBlock) {
                    targetBlock.classList.add('active');
                }
            });
        });
    }
}

// 11. Card Validation
// Description: Card validation functionality
// Functionality: Handles validation of card number, date, and CVV
function setupCardNumberValidation(cardNumberInput) {
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';
        
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        
        e.target.value = formattedValue;
        
        const isValid = validateCardNumber(value);
        updateValidationStyle(e.target, isValid && value.length >= 13);
    });
}

function setupCardDateValidation(cardDateInput) {
    cardDateInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';
        
        if (value.length > 0) {
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
        
        const isValid = validateCardDate(formattedValue);
        updateValidationStyle(e.target, isValid);
    });
}

function setupCardCvvValidation(cardCvvInput) {
    cardCvvInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        e.target.value = value;
        
        const isValid = value.length >= 3;
        updateValidationStyle(e.target, isValid);
    });
}

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

function validateCardNumber(cardNumber) {
    if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
        return false;
    }
    
    let sum = 0;
    let double = false;
    
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
    
    year += 2000;
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return false;
    }
    
    return true;
}

function updateValidationStyle(element, isValid) {
    if (!element) return;
    
    if (isValid) {
        element.classList.remove('input-error');
    } else {
        element.classList.add('input-error');
    }
}

// 12. Expert Incoming Table
// Description: Expert incoming transactions table management
// Functionality: Handles interaction with transaction table rows
function setupExpertIncomingTableHandlers() {
    console.log('Modal.js: Looking for expert-incoming-table...');
    
    setTimeout(function() {
        const expertIncomingTable = document.querySelector('.expert-incoming-table');
        
        if (!expertIncomingTable) {
            console.log('Modal.js: Expert incoming table not found on this page');
            return;
        }
        
        console.log('Modal.js: Found expert-incoming-table, setting up row handlers');
        
        const tableRows = expertIncomingTable.querySelectorAll('tbody tr');
        
        if (tableRows.length === 0) {
            console.log('Modal.js: No rows found in expert-incoming-table');
            return;
        }
        
        console.log(`Modal.js: Found ${tableRows.length} rows in expert-incoming-table`);
        
        tableRows.forEach((row, index) => {
            row.style.cursor = 'pointer';
            
            const newRow = row.cloneNode(true);
            row.parentNode.replaceChild(newRow, row);
            
            console.log(`Modal.js: Adding click handler to row ${index + 1}`);
            
            newRow.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('Modal.js: Table row clicked, opening modal-incoming-about');
                
                const modalId = 'modal-incoming-about';
                const userName = this.querySelector('td:first-child p').textContent;
                const userImg = this.querySelector('td:first-child img').src;
                
                const modal = document.getElementById(modalId);
                
                if (modal) {
                    const modalUserName = modal.querySelector('.modal-incoming-user p');
                    const modalUserImg = modal.querySelector('.modal-incoming-user img');
                    
                    if (modalUserName) modalUserName.textContent = userName;
                    if (modalUserImg) modalUserImg.src = userImg;
                    
                    openModal(modalId);
                } else {
                    console.error(`Modal.js: Modal with ID ${modalId} not found`);
                }
            });
        });
    }, 500);
}

// 13. Expert Page Modals
// Description: Expert page verification and founder modals management
// Functionality: Handles opening and closing of verification and founder modals
function initExpertPageModals() {
    const verificationTrigger = document.querySelector('[data-modal="verification"]');
    const verificationModal = document.querySelector('.modal-verification');
    
    if (verificationTrigger && verificationModal) {
        verificationTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            verificationModal.classList.add('active');
            verificationModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
        
        const closeBtn = verificationModal.querySelector('.modal-window-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                verificationModal.classList.remove('active');
                verificationModal.style.display = 'none';
                document.body.style.overflow = '';
            });
        }
        
        verificationModal.addEventListener('click', function(e) {
            if (e.target === verificationModal) {
                verificationModal.classList.remove('active');
                verificationModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
    
    const founderTrigger = document.querySelector('[data-modal="founder"]');
    const founderModal = document.querySelector('.modal-founder');
    
    if (founderTrigger && founderModal) {
        founderTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            founderModal.classList.add('active');
            founderModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
        
        const closeBtn = founderModal.querySelector('.modal-window-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                founderModal.classList.remove('active');
                founderModal.style.display = 'none';
                document.body.style.overflow = '';
            });
        }
        
        founderModal.addEventListener('click', function(e) {
            if (e.target === founderModal) {
                founderModal.classList.remove('active');
                founderModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
}