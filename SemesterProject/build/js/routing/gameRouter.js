import { GameRenderer } from "../ui/gameRenderer.js";
export class GameRouter {
    controller;
    storageService;
    renderer;
    constructor(controller, storageService) {
        this.controller = controller;
        this.storageService = storageService;
        this.renderer = new GameRenderer(storageService);
    }
    async init() {
        const urlParams = new URLSearchParams(window.location.search);
        const viewType = urlParams.get("view");
        const currentUser = this.storageService.getCurrentUser();
        if (!currentUser && viewType !== "auth") {
            history.pushState({}, "", "?view=auth");
            this.init();
            return;
        }
        if (viewType === "start") {
            this.renderer.renderGameStartMenu((difficulty) => {
                console.log("START GAME WITH DIFFICULTY:", difficulty);
                this.controller.startNewGame(difficulty);
                history.pushState({}, "", "?view=home");
                const urlParams = new URLSearchParams(window.location.search);
                this.init();
            });
            return;
        }
        if (viewType === "auth") {
            this.renderer.renderAuthForm();
            return;
        }
        if (viewType === "stats") {
            this.renderer.renderStatsModal();
            return;
        }
        const isGameRoute = viewType === "computers" ||
            viewType === "home" ||
            viewType === "outdoors";
        if (isGameRoute) {
            if (this.controller.isGameSessionActive()) {
                const preparedData = this.controller.prepareDataForRender(viewType);
                this.renderer.renderProductsView(preparedData);
            }
            else {
                const data = await this.storageService.getCategoryData(viewType);
                this.renderer.renderProductsView(data);
            }
            return;
        }
        this.renderer.renderHomeView();
    }
    initGlobalGameListeners() {
        const container = document.getElementById("app-content") || document.body;
        container.addEventListener("click", (event) => {
            const target = event.target;
            if (target.classList.contains("hide-trigger") &&
                this.controller.isGameSessionActive()) {
                const locationId = target.getAttribute("data-location");
                const itemId = target.getAttribute("data-item");
                const field = target.getAttribute("data-field");
                const pos = parseInt(target.getAttribute("data-pos") || "", 10);
                console.log(`Знайдено хайд на позиції ${pos} у товарі ${itemId} (${field})`);
                this.controller.handleHideFound(locationId, itemId, field, pos, target);
            }
        });
    }
}
