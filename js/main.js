// 1. Menu Toggle
// Description: Handles mobile menu opening/closing
// Functionality: Toggles menu and body classes on menu button click
document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const menuList = document.querySelector('.menu-list');
        menuList.classList.toggle('menu--open');
        document.body.classList.toggle('menu-open');
    });
});

// 2. Header Update
// Description: Updates header state based on authentication
// Functionality: Shows/hides header elements based on login status
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

// 3. Categories Slider
// Description: Main page categories slider
// Functionality: Adaptive slider with pagination and navigation
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

// 4. Top Experts Slider
// Description: Top experts slider
// Functionality: Adaptive slider for displaying experts
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

// 5. Blog Slider
// Description: Blog posts slider
// Functionality: Adaptive slider for displaying blog posts
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

// 6. FAQ Categories
// Description: FAQ categories management
// Functionality: Switching between question categories
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

// 7. Filters Dropdown
// Description: Filters dropdown management
// Functionality: Handling filter clicks and states
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

// 8. Appointment Tabs
// Description: Appointment section tabs management
// Functionality: Switching between information and chat
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

// 9. Expert Card Tabs
// Description: Expert card tabs management
// Functionality: Switching between information and services
document.addEventListener('DOMContentLoaded', function() {
    const infoButton = document.querySelector('.expert-card-tabs-info');
    const serviceButton = document.querySelector('.expert-card-tabs-service');
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

// 10. Client Profile Tabs
// Description: Client profile tabs management
// Functionality: Switching between main info, contacts, and password
function initClientProfileTabs() {
    console.log('Initializing client profile tabs...');
    const mainButton = document.querySelector('.client-profile-tabs-main');
    const contactsButton = document.querySelector('.client-profile-tabs-contacts');
    const passwordButton = document.querySelector('.client-profile-tabs-password');

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

// 11. Client Page Tabs
// Description: Client page tabs management
// Functionality: Switching between main info and history
function initClientPageTabs() {
    const mainTabBtn = document.querySelector('.client-tabs-main');
    const historyTabBtn = document.querySelector('.client-tabs-history');
    const mainInfoContent = document.querySelector('.client-main-info');
    const historyContent = document.querySelector('.client-history');
    
    if (!mainTabBtn || !historyTabBtn || !mainInfoContent || !historyContent) {
        console.warn('Client page tabs elements not found');
        return;
    }
    
    function activateTab(activeButton, inactiveButton, activeContent, inactiveContent) {
        activeButton.classList.add('active');
        inactiveButton.classList.remove('active');
        activeContent.classList.remove('hidden');
        inactiveContent.classList.add('hidden');
    }
    
    mainTabBtn.addEventListener('click', () => {
        activateTab(mainTabBtn, historyTabBtn, mainInfoContent, historyContent);
    });
    
    historyTabBtn.addEventListener('click', () => {
        activateTab(historyTabBtn, mainTabBtn, historyContent, mainInfoContent);
    });
}

// 12. FAQ Tabs
// Description: FAQ tabs management
// Functionality: Switching between different question categories
function initFaqTabs() {
    const allTab = document.querySelector('.faq-tabs-all');
    const generalTab = document.querySelector('.faq-tabs-for-all');
    const clientsTab = document.querySelector('.faq-tabs-for-clients');
    const expertsTab = document.querySelector('.faq-tabs-for-experts');
    
    const allContent = document.querySelectorAll('.faq-for-all');
    const clientsContent = document.querySelectorAll('.faq-for-clients');
    const expertsContent = document.querySelectorAll('.faq-for-experts');
    
    if (!allTab || !generalTab || !clientsTab || !expertsTab) {
        console.warn('FAQ tab elements not found');
        return;
    }
    
    function activateTab(activeTab, activeContents, inactiveContents1, inactiveContents2) {
        // Remove active class from all tabs
        [allTab, generalTab, clientsTab, expertsTab].forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Add active class to clicked tab
        activeTab.classList.add('active');
        
        // Hide all content
        [...allContent, ...clientsContent, ...expertsContent].forEach(content => {
            content.style.display = 'none';
        });
        
        // Show active content
        activeContents.forEach(content => {
            content.style.display = 'flex';
        });
    }
    
    function showAllContent() {
        // Remove active class from all tabs
        [allTab, generalTab, clientsTab, expertsTab].forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Add active class to "All" tab
        allTab.classList.add('active');
        
        // Show all content
        [...allContent, ...clientsContent, ...expertsContent].forEach(content => {
            content.style.display = 'flex';
        });
    }
    
    // Event listeners for tabs
    allTab.addEventListener('click', () => {
        showAllContent();
    });
    
    generalTab.addEventListener('click', () => {
        activateTab(generalTab, allContent, clientsContent, expertsContent);
    });
    
    clientsTab.addEventListener('click', () => {
        activateTab(clientsTab, clientsContent, allContent, expertsContent);
    });
    
    expertsTab.addEventListener('click', () => {
        activateTab(expertsTab, expertsContent, allContent, clientsContent);
    });
    
    // Set default view - show all content
    showAllContent();
}

// 13. FAQ Navigation
// Description: FAQ navigation management
// Functionality: Switching between questions and answers
function initFaqNavigation() {
    const faqContent = document.querySelector('.faq-content');
    const faqAnswers = document.querySelectorAll('.faq-answers');
    const backButtons = document.querySelectorAll('.faq-back-button');
    
    if (!faqContent || !faqAnswers.length) {
        console.warn('FAQ navigation elements not found');
        return;
    }
    
    // Hide all answers sections initially
    faqAnswers.forEach(section => {
        section.style.display = 'none';
    });
    
    // Handle click on FAQ content items
    document.querySelectorAll('.faq-content-item').forEach(item => {
        item.addEventListener('click', () => {
            const answersId = item.getAttribute('data-answers');
            if (answersId) {
                // Hide FAQ content
                faqContent.style.display = 'none';
                
                // Show corresponding answers section
                const answersSection = document.getElementById(answersId);
                if (answersSection) {
                    answersSection.style.display = 'block';
                }
            }
        });
    });
    
    // Handle back button clicks
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Hide all answers sections
            faqAnswers.forEach(section => {
                section.style.display = 'none';
            });
            
            // Show FAQ content
            faqContent.style.display = 'grid';
        });
    });
}

// 14. Expert Profile Tabs
// Description: Expert profile tabs management
// Functionality: Switching between main info, contacts, profession, and password
function initExpertProfileTabs() {
    console.log('Initializing expert profile tabs...');
    const mainButton = document.querySelector('.expert-profile-tabs-main');
    const contactsButton = document.querySelector('.expert-profile-tabs-contacts');
    const profButton = document.querySelector('.expert-profile-tabs-prof');
    const passwordButton = document.querySelector('.expert-profile-tabs-password');

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

// 15. Expert Chat Tabs
// Description: Expert chat tabs management
// Functionality: Switching between different chat types
function initExpertChatTabs() {
    console.log('Initializing expert chat tabs...');
    
    const expertChatTabs = document.querySelectorAll('.expert-chat-tabs .tabs-item');
    const expertRemind = document.querySelector('.expert-remind');
    const expertChatContent = document.querySelector('.expert-chat-content');

    console.log('Found elements:', {
        tabs: expertChatTabs.length,
        remind: !!expertRemind,
        chatContent: !!expertChatContent
    });

    if (expertChatTabs.length && expertRemind && expertChatContent) {
        // Initially hide the remind content
        expertRemind.style.display = 'none';
        
        expertChatTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                console.log('Tab clicked:', this.classList.toString());
                
                // Remove active class from all tabs
                expertChatTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');

                // Show/hide content based on clicked tab
                if (this.classList.contains('expert-chat-tabs-remind')) {
                    console.log('Switching to remind view');
                    expertChatContent.style.display = 'none';
                    expertRemind.style.display = 'grid';
                } else {
                    console.log('Switching to chat view');
                    expertChatContent.style.display = 'flex';
                    expertRemind.style.display = 'none';
                }
            });
        });
    } else {
        console.error('Some required elements were not found:', {
            tabs: expertChatTabs.length,
            remind: !!expertRemind,
            chatContent: !!expertChatContent
        });
    }
}

// 16. Expert Wallet Tabs
// Description: Expert wallet tabs management
// Functionality: Switching between incoming and outgoing transactions
document.addEventListener('DOMContentLoaded', function() {
    const incomingTab = document.querySelector('.expert-wallet-tabs-incoming');
    const outcomingTab = document.querySelector('.expert-wallet-tabs-outcoming');
    
    const incomingContent = document.querySelector('.expert-wallet-incoming');
    const outcomingContent = document.querySelector('.expert-wallet-outcoming');
    
    if (incomingTab && outcomingTab && incomingContent && outcomingContent) {
        // Устанавливаем активную вкладку по умолчанию (Поповнення)
        incomingTab.classList.add('tabs-item-active');
        incomingContent.style.display = 'block';
        outcomingContent.style.display = 'none';
        
        // Обработчик для вкладки "Поповнення"
        incomingTab.addEventListener('click', function() {
            incomingTab.classList.add('tabs-item-active');
            outcomingTab.classList.remove('tabs-item-active');
            
            incomingContent.style.display = 'block';
            outcomingContent.style.display = 'none';
        });
        
        // Обработчик для вкладки "Виплати"
        outcomingTab.addEventListener('click', function() {
            outcomingTab.classList.add('tabs-item-active');
            incomingTab.classList.remove('tabs-item-active');
            
            outcomingContent.style.display = 'block';
            incomingContent.style.display = 'none';
        });
    }
});

// 17. Expert Call
// Description: Call functionality management
// Functionality: Switching between chat and call
document.addEventListener('DOMContentLoaded', function() {
    const callButton = document.querySelector('.expert-chat-client-call');
    const backButton = document.querySelector('.call-back-button');
    const expertChatSection = document.querySelector('.expert-chat');
    const expertCallSection = document.querySelector('.expert-call');
    
    if (callButton && backButton && expertChatSection && expertCallSection) {
        // Обработчик для кнопки вызова
        callButton.addEventListener('click', function() {
            expertChatSection.style.display = 'none';
            expertCallSection.style.display = 'block';
        });
        
        // Обработчик для кнопки возврата
        backButton.addEventListener('click', function() {
            expertCallSection.style.display = 'none';
            expertChatSection.style.display = 'block';
        });
        
        // По умолчанию скрываем секцию звонка при загрузке страницы
        expertCallSection.style.display = 'none';
    }
});

// 18. Categories Toggle
// Description: Blog categories toggle management
// Functionality: Showing/hiding blog categories
const categoriesToggle = document.querySelector('.blog-page-categories-toggle');
const categoriesContainer = document.querySelector('.blog-page-categories');

if (categoriesToggle && categoriesContainer) {
    categoriesToggle.addEventListener('click', () => {
        categoriesToggle.classList.toggle('active');
        categoriesContainer.classList.toggle('active');
        
        // Update button text
        const buttonText = categoriesToggle.querySelector('span');
        buttonText.textContent = categoriesContainer.classList.contains('active') 
            ? 'Сховати категорії' 
            : 'Показати категорії';
    });
}

// 19. Chat Mobile Navigation
// Description: Mobile chat navigation management
// Functionality: Handles chat list and back button interactions on mobile devices
function initChatMobileNavigation() {
    const chatContent = document.querySelector('.client-chat-content');
    const chatItems = document.querySelectorAll('.chat-list-item');
    const backButton = document.querySelector('.chat-back-button');
    
    if (!chatContent || !chatItems.length || !backButton) {
        console.warn('Chat mobile navigation elements not found');
        return;
    }
    
    // Add click event to chat items
    chatItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                chatContent.classList.add('chat-is-active');
            }
        });
    });
    
    // Add click event to back button
    backButton.addEventListener('click', function() {
        chatContent.classList.remove('chat-is-active');
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            chatContent.classList.remove('chat-is-active');
        }
    });
}

// 20. Chat Files Modal
// Description: Chat files modal management
// Functionality: Handles file modal tabs and content switching
function initChatFilesModal() {
    const chatFilesTabs = document.querySelectorAll('.chat-files-tabs-media, .chat-files-tabs-links, .chat-files-tabs-documents');
    
    if (!chatFilesTabs.length) {
        console.warn('Chat files modal elements not found');
        return;
    }
    
    chatFilesTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            chatFilesTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all content blocks
            const contentBlocks = document.querySelectorAll('.modal-tab-content');
            contentBlocks.forEach(block => block.classList.remove('active'));
            
            // Show the corresponding content block
            let targetBlock;
            if (this.classList.contains('chat-files-tabs-media')) {
                targetBlock = document.querySelector('.modal-files-media');
            } else if (this.classList.contains('chat-files-tabs-links')) {
                targetBlock = document.querySelector('.modal-files-links');
            } else if (this.classList.contains('chat-files-tabs-documents')) {
                targetBlock = document.querySelector('.modal-files-documents');
            }
            
            if (targetBlock) {
                targetBlock.classList.add('active');
            }
        });
    });
}

// 21. Chat File Input
// Description: Chat file input management
// Functionality: Handles file selection and upload in chat
function initChatFileInput() {
    const chatFileBtn = document.querySelector('.client-chat-file');
    const chatFileInput = document.querySelector('.client-chat-file-input');
    
    if (!chatFileBtn || !chatFileInput) {
        console.warn('Chat file input elements not found');
        return;
    }
    
    chatFileBtn.addEventListener('click', function() {
        chatFileInput.click();
    });
    
    chatFileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            console.log('File selected:', this.files[0].name);
            // Additional file handling logic can be added here
        }
    });
}

// 22. Expert Chat Mobile Navigation
// Description: Expert chat mobile navigation management
// Functionality: Handles chat list and back button interactions on mobile devices
function initExpertChatMobileNavigation() {
    const chatContent = document.querySelector('.expert-chat-content');
    const chatItems = document.querySelectorAll('.chat-list-item');
    const backButton = document.querySelector('.chat-back-button');
    
    if (!chatContent || !chatItems.length || !backButton) {
        console.warn('Expert chat mobile navigation elements not found');
        return;
    }
    
    // Add click event to chat items
    chatItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                chatContent.classList.add('chat-is-active');
            }
        });
    });
    
    // Add click event to back button
    backButton.addEventListener('click', function() {
        chatContent.classList.remove('chat-is-active');
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            chatContent.classList.remove('chat-is-active');
        }
    });
}

// 23. Expert Wallet Payment Settings
// Description: Expert wallet payment settings management
// Functionality: Handles showing/hiding payment settings section
function initExpertWalletPaymentSettings() {
    console.log('=== Инициализация настроек платежей эксперта ===');
    
    const settingsButton = document.querySelector('.expert-balance-settings');
    const walletPage = document.querySelector('.expert-wallet-page');
    const backButton = document.querySelector('.to-prev-page .prev-page-btn');
    const paymentsSettings = document.querySelector('.payments-settings');
    
    console.log('Найденные элементы:', {
        settingsButton: settingsButton ? 'Да' : 'Нет',
        walletPage: walletPage ? 'Да' : 'Нет',
        backButton: backButton ? 'Да' : 'Нет',
        paymentsSettings: paymentsSettings ? 'Да' : 'Нет'
    });
    
    if (!settingsButton || !walletPage || !backButton || !paymentsSettings) {
        console.error('Не найдены необходимые элементы для настроек платежей');
        return;
    }
    
    // Обработчик для кнопки настроек
    settingsButton.addEventListener('click', function(e) {
        console.log('=== Клик по кнопке настроек ===');
        e.preventDefault();
        e.stopPropagation();
        
        walletPage.classList.add('show-payments-settings');
        paymentsSettings.style.display = 'block';
    });
    
    // Обработчик для кнопки "Назад"
    backButton.addEventListener('click', function(e) {
        console.log('=== Клик по кнопке "Назад" ===');
        e.preventDefault();
        e.stopPropagation();
        
        walletPage.classList.remove('show-payments-settings');
        paymentsSettings.style.display = 'none';
        
        // Добавляем небольшую задержку для плавного перехода
        setTimeout(() => {
            paymentsSettings.style.display = 'none';
        }, 300);
    });
    
    console.log('=== Инициализация настроек платежей завершена ===');
}

// 24. Signup Form Management
// Description: Registration form management for clients and experts
// Functionality: Handles form validation, tab switching, and form submission

function initSignupForm() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const forms = document.querySelectorAll('.signup-form');
    const successContainer = document.querySelector('.signup-container-success');
    const signupContainer = document.querySelector('.signup-container');
    
    if (!tabButtons.length || !forms.length || !successContainer || !signupContainer) {
        console.warn('Signup form elements not found');
        return;
    }

    // Check if all form fields are filled without visual validation
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

    // Clear form errors
    function clearFormErrors(form) {
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    }

    // Update button state without visual validation
    function updateButtonState(form) {
        const isExpertTab = document.querySelector('.tab-button[data-tab="expert"].active');
        const isFirstStep = form.classList.contains('step-1');
        const continueButton = form.querySelector('.continue-button');
        const submitButton = form.querySelector('.signup-submit');
        const termsCheckbox = form.querySelector('.checkbox-container input[type="checkbox"]');
        
        if (isExpertTab) {
            if (isFirstStep) {
                // For experts on first step
                const formValid = checkFormFields(form, false);
                if (continueButton) {
                    continueButton.disabled = !formValid;
                    continueButton.style.display = 'block';
                }
                if (submitButton) {
                    submitButton.style.display = 'none';
                }
            } else {
                // For experts on second step
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
            // For clients
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

    // Form field change handlers
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

        // Terms checkbox handler
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

    // Tab switching handlers
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Reset forms and show first step
            document.querySelector('.signup-form.step-2').classList.remove('visible');
            document.querySelector('.signup-form.step-1').classList.remove('hidden');
            
            // Clear errors
            forms.forEach(form => {
                clearFormErrors(form);
                form.reset();
                updateButtonState(form);
            });
        });
    });

    // Continue button handler
    const continueButton = document.querySelector('.continue-button');
    if (continueButton) {
        continueButton.addEventListener('click', () => {
            const form1 = document.querySelector('.signup-form.step-1');
            if (checkFormFields(form1, true)) { // Show errors on click
                form1.classList.add('hidden');
                const form2 = document.querySelector('.signup-form.step-2');
                form2.classList.add('visible');
                updateButtonState(form2);
            }
        });
    }

    // Form submission handlers
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const isExpertTab = document.querySelector('.tab-button[data-tab="expert"].active');
            const isFirstStep = form.classList.contains('step-1');
            const termsCheckbox = form.querySelector('.checkbox-container input[type="checkbox"]');
            
            // Check all form fields with error display
            const formValid = checkFormFields(form, true);
            
            // Check terms checkbox if not expert's first step
            if (!isExpertTab || !isFirstStep) {
                if (!termsCheckbox || !termsCheckbox.checked) {
                    termsCheckbox.closest('.checkbox-container').classList.add('error');
                    return;
                }
            }
            
            if (!formValid) {
                return;
            }
            
            // Don't show success message for expert's first step
            if (isExpertTab && isFirstStep) {
                return;
            }
            
            // Show success message
            signupContainer.classList.add('hidden');
            successContainer.classList.remove('hidden');
        });
    });

    // Initialize initial state
    updateButtonState(document.querySelector('.signup-form.step-1'));
}

// 14. Payment Management
// Description: Payment modal and card validation functionality
// Functionality: Handles payment processing, card validation, and payment modal interactions

function initPaymentModal() {
    const paymentBtns = document.querySelectorAll('.client-meeting-item-pay, .client-meetings-item-pay, .button-pay, [data-action="pay"]');
    const paymentModal = document.getElementById('paymentModal');
    const paymentModalContent = document.querySelector('.payment-modal-content');
    const paymentModalNewcard = document.querySelector('.payment-modal-newcard');
    const closeBtn = document.querySelectorAll('.modal-window-close');
    const backBtn = document.querySelector('.prev-page-btn');
    const paymentMethods = document.querySelectorAll('.payment-method');
    const cardPaymentBtn = document.querySelector('.payment-modal-card');
    
    if (!paymentModal) {
        console.warn('Payment modal not found on page');
        return;
    }
    
    if (!paymentBtns.length) {
        console.warn('Payment buttons not found on page');
    } else {
        paymentBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                openPaymentModal();
                
                if (btn.dataset.amount) {
                    updatePaymentAmount(btn.dataset.amount);
                } else {
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
    
    if (cardPaymentBtn) {
        cardPaymentBtn.addEventListener('click', function() {
            showCardDetailsModal();
        });
    }
    
    if (backBtn) {
        backBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showMainPaymentModal();
        });
    }
    
    if (!closeBtn.length) {
        console.warn('Modal close buttons not found');
    } else {
        closeBtn.forEach(btn => {
            btn.addEventListener('click', closePaymentModal);
        });
    }
    
    paymentModal.addEventListener('click', function(e) {
        if (e.target === paymentModal) {
            closePaymentModal();
        }
    });
    
    if (!paymentMethods.length) {
        console.warn('Payment methods not found');
    } else {
        paymentMethods.forEach(method => {
            method.addEventListener('click', function() {
                paymentMethods.forEach(m => m.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    const closeModalBtns = document.querySelectorAll('#paymentModalCloseMain, #paymentModalCloseCard');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closePaymentModal);
    });

    const payModalBtns = document.querySelectorAll('#paymentModalPayMain, #paymentModalPayCard');
    payModalBtns.forEach(btn => {
        btn.addEventListener('click', processPayment);
    });

    initCardValidation();
}

function initCardValidation() {
    const cardNumberInput = document.querySelector('.payment-modal-newcard input[placeholder="Номер картки"]');
    const cardExpiryInput = document.querySelector('.payment-modal-newcard input[placeholder="Термін дії картки"]');
    const cardCvvInput = document.querySelector('.payment-modal-newcard input[placeholder="CVV код"]');
    const cardPayButton = document.querySelector('#paymentModalPayCard');

    if (!cardNumberInput || !cardExpiryInput || !cardCvvInput || !cardPayButton) {
        console.warn('Card form elements not found');
        return;
    }

    cardNumberInput.addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        
        if (value.length > 16) {
            value = value.slice(0, 16);
        }
        
        let formattedValue = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        
        this.value = formattedValue;
        
        validateCardNumber(this);
    });

    cardExpiryInput.addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        
        if (value.length > 4) {
            value = value.slice(0, 4);
        }
        
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        
        this.value = value;
    });

    cardCvvInput.addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        
        if (value.length > 3) {
            value = value.slice(0, 3);
        }
        
        this.value = value;
        
        validateCVV(this);
    });

    cardPayButton.addEventListener('click', function(e) {
        if (!validateCardNumber(cardNumberInput)) {
            e.preventDefault();
            return false;
        }
        
        if (!validateCVV(cardCvvInput)) {
            e.preventDefault();
            return false;
        }
        
        if (cardExpiryInput.value.length < 5) {
            showError(cardExpiryInput, "Введіть термін дії у форматі MM/YY");
            e.preventDefault();
            return false;
        }
        
        processPayment();
    });
}

function validateCardNumber(input) {
    const digitsOnly = input.value.replace(/\D/g, '');
    
    if (digitsOnly.length !== 16) {
        showError(input, "Номер картки повинен містити 16 цифр");
        return false;
    }
    
    hideError(input);
    return true;
}

function validateCVV(input) {
    if (input.value.length !== 3) {
        showError(input, "CVV код повинен містити 3 цифри");
        return false;
    }
    
    hideError(input);
    return true;
}

function showError(input, message) {
    let errorElement = input.nextElementSibling;
    
    if (errorElement && errorElement.classList.contains('form-undertext')) {
        errorElement = errorElement.nextElementSibling;
    }
    
    if (!errorElement || !errorElement.classList.contains('form-error')) {
        errorElement = document.createElement('p');
        errorElement.classList.add('form-error');
        
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

function hideError(input) {
    input.classList.remove('input-error');
    
    let errorElement = input.nextElementSibling;
    
    if (errorElement && errorElement.classList.contains('form-undertext')) {
        errorElement = errorElement.nextElementSibling;
    }
    
    if (errorElement && errorElement.classList.contains('form-error')) {
        errorElement.remove();
    }
}

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

function openPaymentModal() {
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) {
        paymentModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        showMainPaymentModal();
    }
}

function closePaymentModal() {
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) {
        paymentModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

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

function updatePaymentService(service) {
    const modalHeader = document.querySelector('.payment-modal-header h3');
    if (modalHeader) {
        modalHeader.textContent = `Оплата: ${service}`;
    }
}

function processPayment() {
    const activeMethod = document.querySelector('.payment-method.active');
    let paymentMethod = 'карта';
    
    if (activeMethod) {
        paymentMethod = activeMethod.querySelector('p').textContent;
    }
    
    alert(`Оплата успішно виконана "${paymentMethod}"!`);
    closePaymentModal();
    
    updatePaymentStatus();
}

function updatePaymentStatus() {
    const clickedPayButton = document.activeElement;
    let statusImg;
    
    if (clickedPayButton) {
        const appointmentItem = clickedPayButton.closest('.client-meetings-item, .client-meeting-item');
        if (appointmentItem) {
            statusImg = appointmentItem.querySelector('.client-meetings-item-payment-status img, .client-meeting-item-payment-status img');
        }
    }
    
    if (!statusImg) {
        statusImg = document.querySelector('.client-meetings-item-payment-status img, .client-meeting-item-payment-status img');
    }
    
    if (statusImg) {
        statusImg.src = './img/icons/approoved.svg';
    }
    
    if (clickedPayButton && 
        (clickedPayButton.classList.contains('client-meeting-item-pay') || 
        clickedPayButton.classList.contains('client-meetings-item-pay'))) {
        clickedPayButton.style.display = 'none';
    }
}

function initPaymentModalHandlers() {
    console.log('Initializing payment modal handlers');
    
    // Проверяем, находимся ли мы на странице, где должен быть payment modal
    const shouldHavePaymentModal = document.querySelector('.client-meeting-item-pay, .client-meetings-item-pay, .button-pay, [data-action="pay"]');
    if (!shouldHavePaymentModal) {
        console.log('Payment modal not needed on this page');
        return;
    }
    
    const paymentModal = document.querySelector('.payment-modal');
    if (!paymentModal) {
        console.warn('Payment modal not found in DOM');
        return;
    }
    
    console.log('Payment modal found in DOM, setting up handlers');
    
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

// Initialize payment functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting payment initialization');
    initPaymentModalHandlers();
    initPaymentModal();
});

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCategoriesSlider();
    initExpertsSlider();
    initBlogSlider();
    initFaqCategories();
    initAppointmentTabs();
    initClientProfileTabs();
    initExpertProfileTabs();
    initClientPageTabs();
    initExpertChatTabs();
    initFaqTabs();
    initFaqNavigation();
    initChatMobileNavigation();
    initChatFilesModal();
    initChatFileInput();
    initExpertChatMobileNavigation();
    initExpertWalletPaymentSettings();
    initSignupForm();
});

// Call updateHeader initially with default value (not logged in)
updateHeader(false);