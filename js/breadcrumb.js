// Breadcrumb navigation generator
class BreadcrumbGenerator {
    constructor() {
        this.breadcrumbContainer = document.querySelector('.breadcrumb .container');
        this.currentPage = this.getCurrentPage();
        this.breadcrumbData = this.getBreadcrumbData();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop();
        return page || 'index.html';
    }

    getBreadcrumbData() {
        const pages = {
            'index.html': { title: 'Головна', icon: 'home' },
            'dashboard.html': { title: 'Дешборд', icon: 'dashboard', parent: 'index.html' },
            'experts.html': { title: 'Мої Експерти', icon: 'experts', parent: 'index.html' },
            'expert-page.html': { title: 'Антон Багінський', icon: 'expert', parent: 'experts.html' },
            'appointments.html': { title: 'Мої Зустрічі', icon: 'appointments', parent: 'index.html' },
            'appointment.html': { title: 'Антон Багінський. Перша Консультація', icon: 'appointment', parent: 'appointments.html' },
            'calendar.html': { title: 'Календар', icon: 'calendar', parent: 'index.html' }
        };

        return pages;
    }

    generateBreadcrumb() {
        if (!this.breadcrumbContainer) return;

        const ul = document.createElement('ul');
        ul.className = 'breadcrumb-links';

        // Add home link
        ul.appendChild(this.createHomeLink());

        // Get breadcrumb trail
        const trail = this.getBreadcrumbTrail();
        
        // Add trail links (skip index.html as it's already represented by home icon)
        trail.forEach((page, index) => {
            if (page === 'index.html') return;
            
            if (index > 0) {
                ul.appendChild(this.createSeparator());
            }
            ul.appendChild(this.createBreadcrumbItem(page, index === trail.length - 1));
        });

        this.breadcrumbContainer.innerHTML = '';
        this.breadcrumbContainer.appendChild(ul);
    }

    createHomeLink() {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = './index.html';
        a.className = 'breadcrumb-box';
        a.innerHTML = `
            <svg width="20.000000" height="20.999512" viewBox="0 0 20 20.9995" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path id="Vector" d="M13 19.99L13 11.99C13 11.73 12.89 11.47 12.7 11.29C12.51 11.1 12.26 10.99 12 10.99L8 10.99C7.73 10.99 7.48 11.1 7.29 11.29C7.1 11.47 7 11.73 7 11.99L7 19.99M1.18 8.15C1.3 7.89 1.48 7.65 1.7 7.47L8.7 1.47C9.06 1.16 9.52 1 10 1C10.47 1 10.93 1.16 11.29 1.47L18.29 7.47C18.51 7.65 18.69 7.89 18.81 8.15C18.93 8.42 19 8.7 19 8.99L19 17.99C19 18.52 18.78 19.03 18.41 19.41C18.03 19.78 17.53 19.99 17 19.99L3 19.99C2.46 19.99 1.96 19.78 1.58 19.41C1.21 19.03 1 18.52 1 17.99L1 8.99C0.99 8.7 1.06 8.42 1.18 8.15Z" stroke="#000000" stroke-opacity="1.000000" stroke-width="2.000000" stroke-linejoin="round" stroke-linecap="round"/>
            </svg>
        `;
        li.appendChild(a);
        return li;
    }

    createSeparator() {
        const li = document.createElement('li');
        li.className = 'breadcrumb-separator';
        li.textContent = '/';
        return li;
    }

    createBreadcrumbItem(page, isActive) {
        const li = document.createElement('li');
        const pageData = this.breadcrumbData[page];
        
        if (isActive) {
            const div = document.createElement('div');
            div.className = 'breadcrumb-box active';
            div.innerHTML = `
                <div class="breadcrumb-img">
                    <svg width="14.666016" height="15.333328" viewBox="0 0 14.666 15.3333" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path id="Vector" d="M4.33 1L4.33 3.66M9.66 1L9.66 3.66M13 8.33L13 3.66C13 3.31 12.85 2.97 12.6 2.72C12.35 2.47 12.01 2.33 11.66 2.33L2.33 2.33C1.98 2.33 1.64 2.47 1.39 2.72C1.14 2.97 1 3.31 1 3.66L1 13C1 13.35 1.14 13.69 1.39 13.94C1.64 14.19 1.98 14.33 2.33 14.33L7.66 14.33M1 6.33L13 6.33M9.66 12.33L13.66 12.33M11.66 10.33L11.66 14.33" stroke="#2E66E2" stroke-opacity="1.000000" stroke-width="2.000000" stroke-linejoin="round" stroke-linecap="round"/>
                    </svg>
                </div>
                <span class="breadcrumb-text">${pageData.title}</span>
            `;
            li.appendChild(div);
        } else {
            const a = document.createElement('a');
            a.href = `./${page}`;
            a.className = 'breadcrumb-box';
            a.innerHTML = `
                <div class="breadcrumb-img">
                    <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.33333 1.33325V3.99992M9.66667 1.33325V3.99992M13 8.66659V3.99992C13 3.6463 12.8595 3.30716 12.6095 3.05711C12.3594 2.80706 12.0203 2.66659 11.6667 2.66659H2.33333C1.97971 2.66659 1.64057 2.80706 1.39052 3.05711C1.14048 3.30716 1 3.6463 1 3.99992V13.3333C1 13.6869 1.14048 14.026 1.39052 14.2761C1.64057 14.5261 1.97971 14.6666 2.33333 14.6666H7.66667M1 6.66659H13M9.66667 12.6666H13.6667M11.6667 10.6666V14.6666" stroke="black" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <span class="breadcrumb-text">${pageData.title}</span>
            `;
            li.appendChild(a);
        }
        
        return li;
    }

    getBreadcrumbTrail() {
        const trail = [];
        let current = this.currentPage;

        while (current && this.breadcrumbData[current]) {
            trail.unshift(current);
            current = this.breadcrumbData[current].parent;
        }

        return trail;
    }
}

// Initialize breadcrumb when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const breadcrumb = new BreadcrumbGenerator();
    breadcrumb.generateBreadcrumb();
}); 