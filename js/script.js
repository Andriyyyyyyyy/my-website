// Завантаження даних із JSON-файлу
fetch('js/sample.json')
    .then(response => response.json())
    .then(data => initialize(data))
    .catch(error => console.error('Error loading JSON:', error));

// Ініціалізація меню
function initialize(data) {
    const brandMenu = document.getElementById('brand-menu');
    const modelMenu = document.getElementById('model-menu');
    const yearMenu = document.getElementById('year-menu');
    const gallery = document.getElementById('gallery');

    // Функція для створення кнопок
    function createButtons(container, items, onClick) {
        container.innerHTML = '';
        Object.keys(items).forEach(item => {
            const button = document.createElement('button');
            button.textContent = item;
            button.addEventListener('click', () => onClick(item));
            container.appendChild(button);
        });
    }

    // Відображення моделей
    function showModels(brand) {
        const models = Object.keys(data).filter(key => key.startsWith(`${brand}/`));
        const groupedModels = models.reduce((acc, model) => {
            const modelName = model.split('/')[1];
            acc[modelName] = true;
            return acc;
        }, {});
        createButtons(modelMenu, groupedModels, model => showYears(brand, model));
        yearMenu.innerHTML = '';
        gallery.innerHTML = '';
    }

    // Відображення років
    function showYears(brand, model) {
        const years = Object.keys(data).filter(key => key.startsWith(`${brand}/${model}/`));
        const groupedYears = years.reduce((acc, key) => {
            const yearValue = key.split('/')[2]; // Змінено назву змінної
            acc[yearValue] = true;
            return acc;
        }, {});
        createButtons(yearMenu, groupedYears, year => showGallery(brand, model, year));
        gallery.innerHTML = '';
    }

    // Відображення галереї
    function showGallery(brand, model, year) {
        const images = Object.keys(data).filter(key => key.startsWith(`${brand}/${model}/${year}/`));
        gallery.innerHTML = '';
        images.forEach(imageKey => {
            const img = document.createElement('img');
            img.src = data[imageKey];
            img.alt = `${brand} ${model} ${year}`;
            img.style.objectFit = 'cover'; // Забезпечує пропорції 1:1
            img.style.width = '150px'; // Фіксована ширина
            img.style.height = '150px'; // Фіксована висота

            // Перевірка, чи зображення завантажується
            img.onload = () => {
                gallery.appendChild(img); // Додаємо тільки якщо зображення завантажилося
            };
            img.onerror = () => {
                console.warn(`Image not found: ${data[imageKey]}`); // Лог помилки
            };
        });
    }

    // Відображення брендів
    const brands = Object.keys(data).reduce((acc, key) => {
        const brand = key.split('/')[0];
        acc[brand] = true;
        return acc;
    }, {});
    createButtons(brandMenu, brands, showModels);
}