document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const forms = document.querySelectorAll('.signup-form');
    const successContainer = document.querySelector('.signup-container-success');
    const signupContainer = document.querySelector('.signup-container');
    
    // Проверка заполнения всех полей формы без визуальной валидации
    function checkFormFields(form, showErrors = false) {
        const inputs = form.querySelectorAll('input:not([type="checkbox"])');
        const selects = form.querySelectorAll('select');
        
        let allFilled = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                allFilled = false;
                if (showErrors) {
                    input.classList.add('error');
                }
            } else if (showErrors) {
                input.classList.remove('error');
            }
        });
        
        selects.forEach(select => {
            if (!select.value || select.value === '') {
                allFilled = false;
                if (showErrors) {
                    select.classList.add('error');
                }
            } else if (showErrors) {
                select.classList.remove('error');
            }
        });
        
        return allFilled;
    }

    // Очистка ошибок формы
    function clearFormErrors(form) {
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    }

    // Обновление состояния кнопки без визуальной валидации
    function updateButtonState(form) {
        const isExpertTab = document.querySelector('.tab-button[data-tab="expert"].active');
        const isFirstStep = form.classList.contains('step-1');
        const continueButton = form.querySelector('.continue-button');
        const submitButton = form.querySelector('.signup-submit');
        const termsCheckbox = form.querySelector('.checkbox-container input[type="checkbox"]');
        
        if (isExpertTab) {
            if (isFirstStep) {
                // Для экспертов на первом шаге
                const formValid = checkFormFields(form, false);
                if (continueButton) {
                    continueButton.disabled = !formValid;
                    continueButton.style.display = 'block';
                }
                if (submitButton) {
                    submitButton.style.display = 'none';
                }
            } else {
                // Для экспертов на втором шаге
                const formValid = checkFormFields(form, false);
                const termsChecked = termsCheckbox && termsCheckbox.checked;
                
                if (submitButton) {
                    submitButton.disabled = !formValid || !termsChecked;
                    submitButton.style.display = 'block';
                }
                if (continueButton) {
                    continueButton.style.display = 'none';
                }
            }
        } else {
            // Для клиентов
            const formValid = checkFormFields(form, false);
            const termsChecked = termsCheckbox && termsCheckbox.checked;
            
            if (submitButton) {
                submitButton.disabled = !formValid || !termsChecked;
                submitButton.style.display = 'block';
            }
            if (continueButton) {
                continueButton.style.display = 'none';
            }
        }
    }

    // Обработчик для изменения полей формы
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                clearFormErrors(form);
                updateButtonState(form);
            });
            input.addEventListener('change', () => {
                clearFormErrors(form);
                updateButtonState(form);
            });
        });

        // Добавляем обработчик для чекбокса terms
        const termsCheckbox = form.querySelector('.checkbox-container input[type="checkbox"]');
        if (termsCheckbox) {
            termsCheckbox.addEventListener('change', () => {
                if (termsCheckbox.checked) {
                    termsCheckbox.closest('.checkbox-container').classList.remove('error');
                }
                updateButtonState(form);
            });
        }
    });

    // Обработка переключения табов
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Сбрасываем формы и показываем первый шаг
            document.querySelector('.signup-form.step-2').classList.remove('visible');
            document.querySelector('.signup-form.step-1').classList.remove('hidden');
            
            // Очищаем ошибки
            forms.forEach(form => {
                clearFormErrors(form);
                form.reset();
                updateButtonState(form);
            });
        });
    });

    // Обработка нажатия кнопки "Продовжити"
    const continueButton = document.querySelector('.continue-button');
    if (continueButton) {
        continueButton.addEventListener('click', () => {
            const form1 = document.querySelector('.signup-form.step-1');
            if (checkFormFields(form1, true)) { // Показываем ошибки при клике
                form1.classList.add('hidden');
                const form2 = document.querySelector('.signup-form.step-2');
                form2.classList.add('visible');
                updateButtonState(form2);
            }
        });
    }

    // Отправка форм
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const isExpertTab = document.querySelector('.tab-button[data-tab="expert"].active');
            const isFirstStep = form.classList.contains('step-1');
            const termsCheckbox = form.querySelector('.checkbox-container input[type="checkbox"]');
            
            // Проверяем все поля формы с показом ошибок
            const formValid = checkFormFields(form, true);
            
            // Проверяем чекбокс terms если это не первый шаг эксперта
            if (!isExpertTab || !isFirstStep) {
                if (!termsCheckbox || !termsCheckbox.checked) {
                    termsCheckbox.closest('.checkbox-container').classList.add('error');
                    return;
                }
            }
            
            if (!formValid) {
                return;
            }
            
            // Для первого шага эксперта не показываем успешную регистрацию
            if (isExpertTab && isFirstStep) {
                return;
            }
            
            // Показываем сообщение об успешной регистрации
            signupContainer.classList.add('hidden');
            successContainer.classList.remove('hidden');
        });
    });

    // Инициализация начального состояния
    updateButtonState(document.querySelector('.signup-form.step-1'));
});