import { GameController } from "./core/gameController.js";
import { GameRouter } from "./routing/gameRouter.js";
import { StorageService } from "./services/storageService.js";
async function bootstrap() {
    console.log("Запуск ігрового ядра ζнÂйДü мĘĦÈ...");
    const storageService = new StorageService();
    await storageService.initDatabase();
    const gameController = new GameController(storageService);
    await gameController.preloadCategories();
    window.AppController = gameController;
    const gameRouter = new GameRouter(gameController, storageService);
    window.AppRouter = gameRouter;
    gameRouter.initGlobalGameListeners();
    gameRouter.init();
    console.log("Додаток успішно ініціалізовано. Роутинг активний.");
}
if (window.HeaderHUD) {
    bootstrap().catch((err) => console.error(err));
}
else {
    document.addEventListener("spa-header-ready", () => {
        bootstrap().catch((err) => console.error(err));
    });
}
document.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link)
        return;
    const href = link.getAttribute("href");
    if (!href?.includes("view="))
        return;
    e.preventDefault();
    history.pushState({}, "", href);
    window.AppRouter?.init();
});
window.addEventListener("popstate", () => {
    window.AppRouter?.init?.();
});
