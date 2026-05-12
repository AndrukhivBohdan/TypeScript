import { UIService } from './UIService.js';
const ui = new UIService('content');
const $ajax = window.$ajaxUtils;
document.getElementById('homeLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    ui.renderHome();
});
document.getElementById('catalogLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    loadCategories();
});
function loadCategories() {
    $ajax.sendGetRequest("../build/data/categories.json", (data) => {
        ui.renderCategories(data, loadCategory, loadRandomCat);
    });
}
function loadCategory(shortname) {
    $ajax.sendGetRequest(`./build/data/categories/${shortname}.json`, (data) => {
        ui.renderItems(data);
    });
}
function loadRandomCat() {
    $ajax.sendGetRequest("./build/data/categories.json", (categories) => {
        const random = categories[Math.floor(Math.random() * categories.length)];
        loadCategory(random.shortname);
    });
}
ui.renderHome();
