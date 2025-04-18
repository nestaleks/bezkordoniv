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

document.addEventListener('DOMContentLoaded', function() {
    initCategoriesSlider();
    initExpertsSlider();
    initBlogSlider();
    initFaqCategories();
});