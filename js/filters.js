// Обработка фильтров
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded for filters.js');
    const showFiltersBtn = document.querySelector('.show-filters-btn');
    const filtersContainer = document.querySelector('.filters-container');
    const dropdowns = document.querySelectorAll('.filters-dropdown');
    
    // Проверка существования элементов
    console.log('showFiltersBtn:', showFiltersBtn);
    console.log('filtersContainer:', filtersContainer);
    console.log('dropdowns:', dropdowns.length);
    
    // Массив для хранения состояния фильтров
    const filterStates = [];
    
    // Инициализация состояний фильтров
    dropdowns.forEach((dropdown, index) => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        const dropbtnText = dropbtn.querySelector('.dropbtn-text');
        const defaultText = dropbtnText ? dropbtnText.textContent : '';
        
        // Сохраняем состояние фильтра
        filterStates[index] = {
            dropdown: dropdown,
            isActive: false, // активен ли фильтр
            defaultText: defaultText, // текст по умолчанию
            currentText: defaultText // текущий выбранный текст
        };
        
        // Сохраняем исходный текст для возможности сброса
        if (dropbtn) {
            dropbtn.setAttribute('data-default-text', defaultText);
        }
    });

    // Показ/скрытие фильтров на мобильных устройствах
    if (showFiltersBtn && filtersContainer) {
        // Добавляем класс hidden к контейнеру фильтров, чтобы он изначально был скрыт на мобильных устройствах
        if (window.innerWidth <= 768) {
            filtersContainer.classList.remove('show');
        }
        
        showFiltersBtn.addEventListener('click', function() {
            console.log('Filter button clicked');
            filtersContainer.classList.toggle('show');
            const buttonText = showFiltersBtn.querySelector('p');
            if (buttonText) {
                buttonText.textContent = filtersContainer.classList.contains('show') ? 
                    'Сховати фільтри' : 'Показати фільтри';
            }
            console.log('Filters container visible:', filtersContainer.classList.contains('show'));
        });
    }

    // Функция для показа выпадающего списка
    function showDropdown(dropdown) {
        const content = dropdown.querySelector('.dropdown-content');
        if (content) {
            content.style.display = 'block';
            content.style.opacity = '1';
            content.style.zIndex = '1000';
            content.style.visibility = 'visible';
            content.style.marginTop = '5px';
            content.style.transform = 'none';
            content.classList.add('show');
            
            // Для гарантии отображения поверх кнопки
            content.style.position = 'absolute';
            content.style.top = '100%';
            content.style.left = '0';
            
            // Увеличиваем z-index родительского фильтра
            dropdown.style.zIndex = '200';
        }
    }

    // Функция для скрытия выпадающего списка БЕЗ изменения активного состояния
    function hideDropdown(dropdown) {
        const content = dropdown.querySelector('.dropdown-content');
        if (content) {
            // Принудительно скрываем выпадающий список с разными стилями для надежности
            content.style.display = 'none';
            content.style.opacity = '0';
            content.style.visibility = 'hidden';
            content.classList.remove('show');
            
            // Дополнительно устанавливаем атрибуты через CSS
            content.setAttribute('style', 'display: none !important; opacity: 0 !important; visibility: hidden !important;');
            
            // НЕ меняем класс active кнопки
            
            // Возвращаем z-index родительского фильтра
            dropdown.style.zIndex = '';
            
            console.log('Dropdown скрыт');
        }
    }

    // Функция для обновления внешнего вида фильтра на основе его состояния
    function updateFilterAppearance(filterState) {
        const dropdown = filterState.dropdown;
        const dropbtn = dropdown.querySelector('.dropbtn');
        const dropbtnText = dropbtn.querySelector('.dropbtn-text');
        
        console.log(`Обновляем внешний вид: isActive=${filterState.isActive}, текст=${filterState.currentText}`);
        
        // Если фильтр активен (выбран вариант, отличный от исходного)
        if (filterState.isActive) {
            console.log('Активируем стили фильтра');
            dropbtn.classList.add('active'); // Добавляем класс active для применения стилей
            dropbtnText.textContent = filterState.currentText; // Устанавливаем текущий текст
            
            // Принудительно устанавливаем стили для корректного отображения
            dropbtnText.style.color = 'var(--primary-01)';
            
            // Показываем иконку крестика
            const activeIcon = dropbtn.querySelector('.dropbtn-img-active');
            const defaultIcon = dropbtn.querySelector('.dropbtn-img-default');
            
            if (activeIcon) {
                activeIcon.style.display = 'block';
                activeIcon.style.filter = 'invert(33%) sepia(97%) saturate(1642%) hue-rotate(197deg) brightness(94%) contrast(95%)';
            }
            
            if (defaultIcon) {
                defaultIcon.style.display = 'none';
            }
            
            // Устанавливаем цвет SVG-иконок
            const svgPaths = dropbtn.querySelectorAll('svg path');
            svgPaths.forEach(path => {
                path.style.stroke = 'var(--primary-01)';
            });
        } else {
            console.log('Деактивируем стили фильтра');
            dropbtn.classList.remove('active'); // Удаляем класс active
            dropbtnText.textContent = filterState.defaultText; // Возвращаем текст по умолчанию
            
            // Сбрасываем стили
            dropbtnText.style.color = '';
            
            // Скрываем иконку крестика
            const activeIcon = dropbtn.querySelector('.dropbtn-img-active');
            const defaultIcon = dropbtn.querySelector('.dropbtn-img-default');
            
            if (activeIcon) {
                activeIcon.style.display = 'none';
            }
            
            if (defaultIcon) {
                defaultIcon.style.display = 'block';
            }
            
            // Сбрасываем цвет SVG-иконок
            const svgPaths = dropbtn.querySelectorAll('svg path');
            svgPaths.forEach(path => {
                path.style.stroke = '';
            });
        }
    }

    // После каждого взаимодействия с фильтрами, обновляем все фильтры
    function updateAllFilters() {
        console.log('Обновляем все фильтры');
        filterStates.forEach(state => {
            updateFilterAppearance(state);
        });
    }

    // Функция для сброса фильтра
    function resetFilter(index) {
        const filterState = filterStates[index];
        const dropdown = filterState.dropdown;
        const dropbtn = dropdown.querySelector('.dropbtn');
        
        // Сбрасываем состояние фильтра
        filterState.isActive = false;
        filterState.currentText = filterState.defaultText;
        
        // Сбрасываем выделение опций
        const options = dropdown.querySelectorAll('.dropdown-content a');
        options.forEach(opt => opt.classList.remove('selected'));
        
        // Обновляем внешний вид
        updateFilterAppearance(filterState);
        
        // Скрываем выпадающий список
        hideDropdown(dropdown);
        
        // Обновляем все фильтры, чтобы сохранить активные стили у других фильтров
        updateAllFilters();
        
        console.log(`Фильтр ${index} сброшен`);
    }

    // Обработка каждого dropdown
    dropdowns.forEach((dropdown, index) => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        const options = dropdownContent.querySelectorAll('a');
        const resetBtn = dropbtn.querySelector('.dropbtn-img-active');
        
        console.log(`Dropdown ${index+1} - button: ${dropbtn ? 'found' : 'not found'}, content: ${dropdownContent ? 'found' : 'not found'}, options: ${options.length}`);
        
        // Проверяем, есть ли уже выбранная опция и активируем фильтр
        const selectedOption = dropdownContent.querySelector('a.selected');
        if (selectedOption) {
            filterStates[index].isActive = true;
            filterStates[index].currentText = selectedOption.textContent;
            updateFilterAppearance(filterStates[index]);
        }

        // Обработчик для сброса фильтра при клике на крестик
        if (resetBtn) {
            resetBtn.addEventListener('click', function(e) {
                console.log('Reset button clicked for filter', index);
                e.preventDefault();
                e.stopPropagation();
                resetFilter(index);
            });
        }

        // Открытие/закрытие dropdown при клике на кнопку
        dropbtn.addEventListener('click', function(e) {
            console.log(`Button ${index+1} clicked`);
            
            // Проверяем, не был ли клик по кнопке сброса
            if (e.target === resetBtn || e.target.closest('.dropbtn-img-active')) {
                return; // Выходим, так как этот клик обрабатывается в другом обработчике
            }
            
            e.preventDefault();
            e.stopPropagation();
            
            // Закрываем все остальные дропдауны без изменения их состояния
            dropdowns.forEach((otherDropdown, otherIndex) => {
                if (otherIndex !== index) {
                    hideDropdown(otherDropdown);
                }
            });

            // Переключаем только видимость dropdown текущего фильтра
            const isContentVisible = dropdownContent.classList.contains('show');
            console.log(`Is content visible: ${isContentVisible}`);
            
            if (isContentVisible) {
                hideDropdown(dropdown);
            } else {
                showDropdown(dropdown);
            }
            
            // Обновляем все фильтры после клика
            updateAllFilters();
        });

        // Обработка выбора опции
        options.forEach(option => {
            option.addEventListener('click', function(e) {
                console.log('Option clicked in filter', index);
                e.preventDefault();
                e.stopPropagation();
                
                // Снятие выделения с других опций
                options.forEach(opt => opt.classList.remove('selected'));
                
                // Выделение выбранной опции
                option.classList.add('selected');
                
                // Сохраняем data-value, если он есть
                const dataValue = option.getAttribute('data-value');
                if (dataValue) {
                    console.log(`Выбрано значение: ${dataValue}`);
                    // Можно сохранить data-value для дальнейшего использования
                    dropdown.setAttribute('data-selected-value', dataValue);
                }
                
                // Обновление состояния фильтра
                filterStates[index].isActive = true;
                filterStates[index].currentText = option.textContent;
                
                // Обновляем внешний вид
                updateFilterAppearance(filterStates[index]);
                
                // Гарантированное закрытие dropdown после выбора опции
                hideDropdown(dropdown);
                
                // Дополнительное закрытие с небольшой задержкой для надежности
                setTimeout(() => {
                    hideDropdown(dropdown);
                    console.log('Повторное закрытие dropdown после выбора');
                }, 50);
                
                // Обновляем все фильтры после выбора опции
                updateAllFilters();
            });
        });
    });

    // Закрытие dropdown при клике вне него без изменения активного состояния
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.filters-dropdown')) {
            dropdowns.forEach(dropdown => {
                hideDropdown(dropdown);
            });
            
            // Обновляем все фильтры после клика вне
            updateAllFilters();
        }
    });
    
    // Принудительно обновляем внешний вид фильтров при загрузке
    filterStates.forEach(state => {
        updateFilterAppearance(state);
    });

    // Инициализация - обновляем все фильтры при загрузке
    updateAllFilters();
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', function() {
        if (showFiltersBtn && filtersContainer) {
            if (window.innerWidth > 768) {
                // На десктопах фильтры всегда видимы
                filtersContainer.classList.remove('show');
            }
        }
    });
}); 