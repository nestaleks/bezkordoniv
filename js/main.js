// Menu Toggle
document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Находим меню напрямую, без использования closest
        const menuList = document.querySelector('.menu-list');
        menuList.classList.toggle('menu--open');
        document.body.classList.toggle('menu-open');
    });
});

function updateHeader(isLoggedIn) {
    const logoutBlock = document.querySelector('.header-if-logout');
    const loginBlock = document.querySelector('.header-if-login');
    const loginMenuItems = document.querySelectorAll('.menu-if-login');

    if (isLoggedIn) {
        logoutBlock.classList.add('hidden');
        loginBlock.classList.remove('hidden');
        loginMenuItems.forEach(item => item.classList.remove('hidden'));
    } else {
        logoutBlock.classList.remove('hidden');
        loginBlock.classList.add('hidden');
        loginMenuItems.forEach(item => item.classList.add('hidden'));
    }
}

// Category Slider
function initCategoriesSlider() {
    const slider = document.querySelector('.categories-tiles');
    const slides = document.querySelectorAll('.category-tile');
    const prevBtn = document.querySelector('.arrow-prev');
    const nextBtn = document.querySelector('.arrow-next');
    const pagesEl = document.querySelector('.categories-pages');

    if (!slider || !slides.length || !prevBtn || !nextBtn || !pagesEl) {
        console.warn('Categories slider elements not found');
        return;
    }

    console.log(`Found ${slides.length} slides`);

    // Константы для слайдера
    const totalSlides = slides.length;
    let currentIndex = 0; // Индекс первого видимого слайда

    // Функция для определения количества слайдов на экране в зависимости от ширины окна
    function getSlidesPerView() {
        const windowWidth = window.innerWidth;
        if (windowWidth <= 580) {
            return 1; // Мобильные - 1 слайд
        } else if (windowWidth <= 900) {
            return 2; // Планшеты - 2 слайда
        } else {
            return 4; // Десктоп - 4 слайда
        }
    }

    let slidesPerView = getSlidesPerView();

    // Вычисляем общее количество позиций с учетом адаптивности
    function getTotalPositions() {
        return Math.max(1, totalSlides - getSlidesPerView() + 1);
    }

    function updateSlides() {
        // Обновляем slidesPerView на случай, если размер окна изменился
        slidesPerView = getSlidesPerView();

        // Определяем индексы для видимых слайдов
        const visibleIndices = [];
        for (let i = 0; i < slidesPerView; i++) {
            // Убеждаемся, что индекс не выходит за пределы массива слайдов
            if (currentIndex + i < totalSlides) {
                visibleIndices.push(currentIndex + i);
            }
        }

        console.log(`Window width: ${window.innerWidth}px, showing ${slidesPerView} slides`);
        console.log(`Current index: ${currentIndex}, visible slides: ${visibleIndices.join(', ')}`);

        // Скрываем все слайды
        slides.forEach(slide => {
            slide.style.display = 'none';
        });

        // Показываем только те, которые должны быть видны
        visibleIndices.forEach(index => {
            slides[index].style.display = 'flex';

            // Устанавливаем ширину в зависимости от количества отображаемых слайдов
            const slideWidth = `calc(${100/slidesPerView}% - ${(slidesPerView-1)*12/slidesPerView}px)`;
            slides[index].style.width = slideWidth;
        });

        // Обновляем пагинацию (текущая позиция + 1)/(всего позиций)
        const totalPositions = getTotalPositions();
        pagesEl.textContent = `${currentIndex + 1}/${totalPositions}`;

        // Проверяем, не вышли ли мы за пределы после изменения размера окна
        if (currentIndex >= totalPositions) {
            currentIndex = totalPositions - 1;
            // Рекурсивно вызываем updateSlides(), чтобы обновить слайдер с новым индексом
            updateSlides();
        }
    }

    function nextSlide() {
        const totalPositions = getTotalPositions();
        // Переходим к следующему слайду с учетом границ
        if (currentIndex >= totalPositions - 1) {
            currentIndex = 0; // Возвращаемся к началу
        } else {
            currentIndex++;
        }
        updateSlides();
    }

    function prevSlide() {
        const totalPositions = getTotalPositions();
        // Переходим к предыдущему слайду с учетом границ
        if (currentIndex <= 0) {
            currentIndex = totalPositions - 1; // Переходим в конец
        } else {
            currentIndex--;
        }
        updateSlides();
    }

    // Устанавливаем стили для контейнера и слайдов
    slider.style.display = 'flex';
    slider.style.flexWrap = 'wrap';
    slider.style.gap = '12px';

    // Обработчик изменения размера окна
    window.addEventListener('resize', updateSlides);

    // Инициализация
    updateSlides();

    // Обработчики событий
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
}

// Top Experts Slider
function initExpertsSlider() {
    const slider = document.querySelector('.top-experts-list');
    const slides = document.querySelectorAll('.top-experts-card');
    const prevBtn = document.querySelector('.top-experts-arrow.arrow-prev');
    const nextBtn = document.querySelector('.top-experts-arrow.arrow-next');
    const pagesEl = document.querySelector('.top-experts-pages');

    if (!slider || !slides.length || !prevBtn || !nextBtn || !pagesEl) {
        console.warn('Experts slider elements not found');
        return;
    }

    console.log(`Found ${slides.length} expert slides`);

    // Константы для слайдера
    const totalSlides = slides.length;
    let currentIndex = 0; // Индекс первого видимого слайда

    // Функция для определения количества слайдов на экране в зависимости от ширины окна
    function getSlidesPerView() {
        const windowWidth = window.innerWidth;
        if (windowWidth <= 580) {
            return 1; // Мобильные - 1 эксперт
        } else if (windowWidth <= 900) {
            return 2; // Планшеты - 2 эксперта
        } else {
            return 3; // Десктоп - 3 эксперта (по дизайну)
        }
    }

    let slidesPerView = getSlidesPerView();

    // Вычисляем общее количество позиций с учетом адаптивности
    function getTotalPositions() {
        return Math.max(1, totalSlides - getSlidesPerView() + 1);
    }

    function updateSlides() {
        // Обновляем slidesPerView на случай, если размер окна изменился
        slidesPerView = getSlidesPerView();

        // Определяем индексы для видимых слайдов
        const visibleIndices = [];
        for (let i = 0; i < slidesPerView; i++) {
            // Убеждаемся, что индекс не выходит за пределы массива слайдов
            if (currentIndex + i < totalSlides) {
                visibleIndices.push(currentIndex + i);
            }
        }

        console.log(`Experts: window width: ${window.innerWidth}px, showing ${slidesPerView} experts`);
        console.log(`Experts: current index: ${currentIndex}, visible slides: ${visibleIndices.join(', ')}`);

        // Скрываем все слайды
        slides.forEach(slide => {
            slide.style.display = 'none';
        });

        // Показываем только те, которые должны быть видны
        visibleIndices.forEach(index => {
            slides[index].style.display = 'flex';

            // Устанавливаем ширину в зависимости от количества отображаемых слайдов
            const slideWidth = `calc(${100/slidesPerView}% - ${(slidesPerView-1)*12/slidesPerView}px)`;
            slides[index].style.width = slideWidth;
        });

        // Обновляем пагинацию (текущая позиция + 1)/(всего позиций)
        const totalPositions = getTotalPositions();
        pagesEl.textContent = `${currentIndex + 1}/${totalPositions}`;

        // Проверяем, не вышли ли мы за пределы после изменения размера окна
        if (currentIndex >= totalPositions) {
            currentIndex = totalPositions - 1;
            // Рекурсивно вызываем updateSlides(), чтобы обновить слайдер с новым индексом
            updateSlides();
        }
    }

    function nextSlide() {
        const totalPositions = getTotalPositions();
        // Переходим к следующему слайду с учетом границ
        if (currentIndex >= totalPositions - 1) {
            currentIndex = 0; // Возвращаемся к началу
        } else {
            currentIndex++;
        }
        updateSlides();
    }

    function prevSlide() {
        const totalPositions = getTotalPositions();
        // Переходим к предыдущему слайду с учетом границ
        if (currentIndex <= 0) {
            currentIndex = totalPositions - 1; // Переходим в конец
        } else {
            currentIndex--;
        }
        updateSlides();
    }

    // Устанавливаем стили для контейнера и слайдов
    slider.style.display = 'flex';
    slider.style.flexWrap = 'wrap';
    slider.style.gap = '12px';

    // Обработчик изменения размера окна
    window.addEventListener('resize', updateSlides);

    // Инициализация
    updateSlides();

    // Обработчики событий
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
}

// Blog Slider
function initBlogSlider() {
    const slider = document.querySelector('.main-blog-list');
    const slides = document.querySelectorAll('.main-blog-item');
    const prevBtn = document.querySelector('.main-blog-arrow.arrow-prev');
    const nextBtn = document.querySelector('.main-blog-arrow.arrow-next');
    const pagesEl = document.querySelector('.main-blog-pages');

    if (!slider || !slides.length || !prevBtn || !nextBtn || !pagesEl) {
        console.warn('Blog slider elements not found');
        return;
    }

    console.log(`Found ${slides.length} blog posts`);

    // Константы для слайдера
    const totalSlides = slides.length;
    let currentIndex = 0; // Индекс первого видимого слайда

    // Функция для определения количества слайдов на экране в зависимости от ширины окна
    function getSlidesPerView() {
        const windowWidth = window.innerWidth;
        if (windowWidth <= 640) {
            return 1; // Мобильные - 1 пост
        } else if (windowWidth <= 1024) {
            return 2; // Планшеты - 2 поста
        } else {
            return 3; // Десктоп - 3 поста
        }
    }

    let slidesPerView = getSlidesPerView();

    // Вычисляем общее количество позиций с учетом адаптивности
    function getTotalPositions() {
        return Math.max(1, totalSlides - getSlidesPerView() + 1);
    }

    function updateSlides() {
        // Обновляем slidesPerView на случай, если размер окна изменился
        slidesPerView = getSlidesPerView();

        // Определяем индексы для видимых слайдов
        const visibleIndices = [];
        for (let i = 0; i < slidesPerView; i++) {
            // Убеждаемся, что индекс не выходит за пределы массива слайдов
            if (currentIndex + i < totalSlides) {
                visibleIndices.push(currentIndex + i);
            }
        }

        console.log(`Blog: window width: ${window.innerWidth}px, showing ${slidesPerView} posts`);
        console.log(`Blog: current index: ${currentIndex}, visible slides: ${visibleIndices.join(', ')}`);

        // Скрываем все слайды
        slides.forEach(slide => {
            slide.style.display = 'none';
        });

        // Показываем только те, которые должны быть видны
        visibleIndices.forEach(index => {
            slides[index].style.display = 'flex';

            // Устанавливаем ширину в зависимости от количества отображаемых слайдов
            const slideWidth = `calc(${100/slidesPerView}% - ${(slidesPerView-1)*20/slidesPerView}px)`;
            slides[index].style.width = slideWidth;
        });

        // Обновляем пагинацию (текущая позиция + 1)/(всего позиций)
        const totalPositions = getTotalPositions();
        pagesEl.textContent = `${currentIndex + 1}/${totalPositions}`;

        // Проверяем, не вышли ли мы за пределы после изменения размера окна
        if (currentIndex >= totalPositions) {
            currentIndex = totalPositions - 1;
            // Рекурсивно вызываем updateSlides(), чтобы обновить слайдер с новым индексом
            updateSlides();
        }
    }

    function nextSlide() {
        const totalPositions = getTotalPositions();
        // Переходим к следующему слайду с учетом границ
        if (currentIndex >= totalPositions - 1) {
            currentIndex = 0; // Возвращаемся к началу
        } else {
            currentIndex++;
        }
        updateSlides();
    }

    function prevSlide() {
        const totalPositions = getTotalPositions();
        // Переходим к предыдущему слайду с учетом границ
        if (currentIndex <= 0) {
            currentIndex = totalPositions - 1; // Переходим в конец
        } else {
            currentIndex--;
        }
        updateSlides();
    }

    // Устанавливаем стили для контейнера и слайдов
    slider.style.display = 'flex';
    slider.style.flexWrap = 'wrap';
    slider.style.gap = '20px';

    // Обработчик изменения размера окна
    window.addEventListener('resize', updateSlides);

    // Инициализация
    updateSlides();

    // Обработчики событий
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
}

function initFaqCategories() {
    const categories = document.querySelectorAll('.questions-category');
    const questionItems = document.querySelectorAll('.question-list-item[data-category]');

    if (!categories.length || !questionItems.length) {
        console.warn('FAQ categories or questions not found');
        return;
    }

    // Функция для отображения вопросов выбранной категории
    function showCategory(categoryId) {
        // Обновляем активный класс у категорий
        categories.forEach(category => {
            if (category.id === categoryId) {
                category.classList.add('active');
            } else {
                category.classList.remove('active');
            }
        });

        // Показываем/скрываем вопросы
        questionItems.forEach(item => {
            if (item.dataset.category === categoryId) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Добавляем обработчики событий для переключения категорий
    categories.forEach(category => {
        category.addEventListener('click', () => {
            const categoryId = category.id;
            showCategory(categoryId);
        });
    });

    // Инициализация: показываем вопросы для первой категории
    const firstCategoryId = categories[0].id;
    showCategory(firstCategoryId);
}

// Expert card tabs
document.addEventListener('DOMContentLoaded', function() {
    const infoButton = document.querySelector('.expert-card-info-button-info');
    const serviceButton = document.querySelector('.expert-card-info-button-service');
    const infoBox = document.querySelector('.expert-card-info-box');
    const serviceBox = document.querySelector('.expert-card-service-box');

    if (infoButton && serviceButton && infoBox && serviceBox) {
        // По умолчанию показываем информационный таб
        infoBox.style.display = 'block';
        serviceBox.style.display = 'none';
        infoButton.classList.add('active');

        infoButton.addEventListener('click', () => {
            infoBox.style.display = 'block';
            serviceBox.style.display = 'none';
            infoButton.classList.add('active');
            serviceButton.classList.remove('active');
        });

        serviceButton.addEventListener('click', () => {
            infoBox.style.display = 'none';
            serviceBox.style.display = 'block';
            serviceButton.classList.add('active');
            infoButton.classList.remove('active');
        });
    }
});

// Обработка кликов по фильтрам
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.filters-dropdown');

    // Закрываем все дропдауны при клике вне них
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.filters-dropdown')) {
            dropdowns.forEach(dropdown => {
                const button = dropdown.querySelector('.dropbtn');
                const content = dropdown.querySelector('.dropdown-content');
                button.classList.remove('active');
                content.classList.remove('show');
            });
        }
    });

    // Обработка клика по кнопке фильтра
    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.dropbtn');
        const content = dropdown.querySelector('.dropdown-content');

        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Закрываем все остальные дропдауны
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    const otherButton = otherDropdown.querySelector('.dropbtn');
                    const otherContent = otherDropdown.querySelector('.dropdown-content');
                    otherButton.classList.remove('active');
                    otherContent.classList.remove('show');
                }
            });

            // Переключаем текущий дропдаун
            button.classList.toggle('active');
            content.classList.toggle('show');
        });

        // Обработка клика по опции в дропдауне
        content.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                const selectedValue = e.target.textContent;
                button.querySelector('.dropbtn-text').textContent = selectedValue;
                button.classList.remove('active');
                content.classList.remove('show');
            }
        });
    });
});

// Appointment tabs
function initAppointmentTabs() {
    const tabs = document.querySelectorAll('.appointment-item-tab');
    const infoTab = document.getElementById('info-tab');
    const chatTab = document.getElementById('chat-tab');
    
    if (!tabs.length || !infoTab || !chatTab) {
        return; // Если элементы не найдены, выходим из функции
    }
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Удаляем активный класс у всех табов
            tabs.forEach(t => t.classList.remove('active'));
            // Добавляем активный класс к нажатому табу
            this.classList.add('active');
            
            // Переключаем содержимое на основе выбранного таба
            const tabName = this.getAttribute('data-tab');
            if (tabName === 'info') {
                infoTab.classList.add('active');
                chatTab.classList.remove('active');
            } else if (tabName === 'chat') {
                chatTab.classList.add('active');
                infoTab.classList.remove('active');
            }
        });
    });
}

// Expert Profile Tabs
function initExpertProfileTabs() {
    console.log('Initializing expert profile tabs...');
    const mainButton = document.querySelector('.expert-profile-button-main');
    const contactsButton = document.querySelector('.expert-profile-button-contacts');
    const profButton = document.querySelector('.expert-profile-button-prof');
    const passwordButton = document.querySelector('.expert-profile-button-password');
    
    const mainContent = document.querySelector('.expert-profile-main');
    const contactsContent = document.querySelector('.expert-profile-contacts');
    const profContent = document.querySelector('.expert-profile-prof');
    const passwordContent = document.querySelector('.expert-profile-password');
    
    if (!mainButton || !contactsButton || !profButton || !passwordButton || 
        !mainContent || !contactsContent || !profContent || !passwordContent) {
        console.log('Expert profile elements not found');
        return; // Выходим, если какого-то элемента нет на странице
    }
    
    // Функция для активации кнопки и показа соответствующего содержимого
    function activateTab(button, content) {
        console.log('Activating expert tab:', button, content);
        // Сначала удаляем активный класс у всех кнопок
        [mainButton, contactsButton, profButton, passwordButton].forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Скрываем все контенты
        [mainContent, contactsContent, profContent, passwordContent].forEach(cont => {
            cont.classList.add('hidden');
        });
        
        // Активируем выбранную кнопку и показываем соответствующий контент
        button.classList.add('active');
        content.classList.remove('hidden');
        console.log('Expert tab activated');
    }
    
    // Обработчики событий для кнопок
    mainButton.addEventListener('click', () => {
        console.log('Expert main button clicked');
        activateTab(mainButton, mainContent);
    });
    
    contactsButton.addEventListener('click', () => {
        console.log('Expert contacts button clicked');
        activateTab(contactsButton, contactsContent);
    });
    
    profButton.addEventListener('click', () => {
        console.log('Expert prof button clicked');
        activateTab(profButton, profContent);
    });
    
    passwordButton.addEventListener('click', () => {
        console.log('Expert password button clicked');
        activateTab(passwordButton, passwordContent);
    });
    
    // По умолчанию активируем первую вкладку
    console.log('Setting expert default tab');
    activateTab(mainButton, mainContent);
    console.log('Expert profile tabs initialized');
}

// Client Profile Tabs
function initClientProfileTabs() {
    console.log('Initializing client profile tabs...');
    const mainButton = document.querySelector('.client-profile-button-main');
    const contactsButton = document.querySelector('.client-profile-button-contacts');
    const passwordButton = document.querySelector('.client-profile-button-password');
    
    const mainContent = document.querySelector('.client-profile-main');
    const contactsContent = document.querySelector('.client-profile-contacts');
    const passwordContent = document.querySelector('.client-profile-password');
    
    console.log('Main button:', mainButton);
    console.log('Contacts button:', contactsButton);
    console.log('Password button:', passwordButton);
    console.log('Main content:', mainContent);
    console.log('Contacts content:', contactsContent);
    console.log('Password content:', passwordContent);
    
    if (!mainButton || !contactsButton || !passwordButton || 
        !mainContent || !contactsContent || !passwordContent) {
        console.log('Client profile elements not found');
        return; // Выходим, если какого-то элемента нет на странице
    }
    
    // Функция для активации кнопки и показа соответствующего содержимого
    function activateTab(button, content) {
        console.log('Activating tab:', button, content);
        // Сначала удаляем активный класс у всех кнопок
        [mainButton, contactsButton, passwordButton].forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Скрываем все контенты
        [mainContent, contactsContent, passwordContent].forEach(cont => {
            cont.classList.add('hidden');
        });
        
        // Активируем выбранную кнопку и показываем соответствующий контент
        button.classList.add('active');
        content.classList.remove('hidden');
        console.log('Tab activated');
    }
    
    // Обработчики событий для кнопок
    mainButton.addEventListener('click', () => {
        console.log('Main button clicked');
        activateTab(mainButton, mainContent);
    });
    
    contactsButton.addEventListener('click', () => {
        console.log('Contacts button clicked');
        activateTab(contactsButton, contactsContent);
    });
    
    passwordButton.addEventListener('click', () => {
        console.log('Password button clicked');
        activateTab(passwordButton, passwordContent);
    });
    
    // По умолчанию активируем первую вкладку
    console.log('Setting default tab');
    activateTab(mainButton, mainContent);
    console.log('Client profile tabs initialized');
}

// Initialize all components
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация слайдеров, если они есть на странице
    initCategoriesSlider();
    initExpertsSlider();
    initBlogSlider();
    initFaqCategories();
    initAppointmentTabs();
    initExpertProfileTabs();
    initClientProfileTabs();
});

// Modal verification and founder functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const modalVerification = document.querySelector('.modal-verification');
    const modalFounder = document.querySelector('.modal-founder');
    
    // Get verification badge elements
    const verificationBadges = document.querySelectorAll('.expert-card-verification-box');
    
    // Get close buttons
    const closeButtons = document.querySelectorAll('.modal-window-close');
    
    // Check if the elements exist on the page
    if (modalVerification && modalFounder && verificationBadges.length) {
        // Add click event to all verification badges
        verificationBadges.forEach((badge) => {
            const badgeText = badge.querySelector('p').textContent.trim();
            
            badge.addEventListener('click', function() {
                // Close any open modals first
                modalVerification.style.display = 'none';
                modalFounder.style.display = 'none';
                
                // For debugging
                console.log('Badge clicked:', badgeText);
                console.log('Badge data-modal:', badge.dataset.modal);
                
                // Check which badge was clicked using data attribute
                if (badge.dataset.modal === 'verification') {
                    // Show verification modal
                    modalVerification.style.display = 'block';
                } else if (badge.dataset.modal === 'founder') {
                    // Show founder modal
                    modalFounder.style.display = 'block';
                } else {
                    // Fallback to text-based detection
                    if (badgeText.includes('ВЕРИФІКОВАНИЙ ЕКСПЕРТ')) {
                        // Show verification modal
                        modalVerification.style.display = 'block';
                    } else if (
                        badgeText.includes('ЕКСПЕРТ засновник') || 
                        badgeText.includes('ЕКСПЕРТ ЗАСНОВНИК') || 
                        badgeText.includes('ЕКСПЕРТ-ЗАСНОВНИК') || 
                        badgeText.toLowerCase().includes('експерт-засновник')
                    ) {
                        // Show founder modal
                        modalFounder.style.display = 'block';
                    }
                }
            });
            
            // Make badges look clickable
            badge.style.cursor = 'pointer';
        });
        
        // Add click event to close buttons
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                modalVerification.style.display = 'none';
                modalFounder.style.display = 'none';
            });
        });
        
        // Add click handlers to close modals when clicking outside the modal content
        window.addEventListener('click', function(event) {
            if (event.target === modalVerification || event.target === modalFounder) {
                modalVerification.style.display = 'none';
                modalFounder.style.display = 'none';
            }
        });
    }
});