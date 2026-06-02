export function createDefaultStatistics() {
    const createEmptyRow = () => ({
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        lettersFound: 0,
    });
    return {
        easy: createEmptyRow(),
        medium: createEmptyRow(),
        hard: createEmptyRow(),
        total: createEmptyRow(),
    };
}
export class StorageService {
    USERS_KEY = "users_db";
    CURRENT_USER_KEY = "current_user";
    JSON_PATH = "../../build/data/users.json";
    constructor() {
        if (!localStorage.getItem(this.USERS_KEY)) {
            localStorage.setItem(this.USERS_KEY, JSON.stringify([]));
        }
    }
    async initDatabase() {
        const savedUsers = this.getAllUsers();
        if (savedUsers.length > 0) {
            return;
        }
        try {
            console.log(`[StorageService] Завантаження базових даних користувачів з ${this.JSON_PATH}...`);
            const response = await fetch(this.JSON_PATH);
            if (!response.ok) {
                throw new Error(`Не вдалося завантажити JSON файл: ${response.statusText}`);
            }
            const initialUsers = await response.json();
            localStorage.setItem(this.USERS_KEY, JSON.stringify(initialUsers));
            console.log("[StorageService] Базу даних успішно ініціалізовано з JSON.");
        }
        catch (error) {
            console.error("[StorageService] Помилка завантаження JSON файлу:", error);
            localStorage.setItem(this.USERS_KEY, JSON.stringify([]));
        }
    }
    getAllUsers() {
        const data = localStorage.getItem(this.USERS_KEY);
        if (!data)
            return [];
        try {
            return JSON.parse(data);
        }
        catch {
            return [];
        }
    }
    registerUser(username, passwordHash) {
        const users = this.getAllUsers();
        const userExists = users.some((u) => u.username.toLowerCase() === username.toLowerCase());
        if (userExists) {
            return {
                success: false,
                message: "Користувач з таким нікнеймом вже існує!",
            };
        }
        const createEmptyRow = () => ({
            gamesPlayed: 0,
            gamesWon: 0,
            gamesLost: 0,
            lettersFound: 0,
        });
        const newUser = {
            username,
            passwordHash,
            statistics: {
                easy: createEmptyRow(),
                medium: createEmptyRow(),
                hard: createEmptyRow(),
                total: createEmptyRow(),
            },
        };
        users.push(newUser);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        return {
            success: true,
            message: "Реєстрація успішна! Тепер ви можете увійти.",
        };
    }
    loginUser(username, passwordHash) {
        const users = this.getAllUsers();
        const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
        if (!user) {
            return { success: false, message: "Користувача не знайдено!" };
        }
        if (user.passwordHash !== passwordHash) {
            return { success: false, message: "Невірний пароль!" };
        }
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
        return { success: true, user, message: "Вхід виконано!" };
    }
    getCurrentUser() {
        const data = localStorage.getItem(this.CURRENT_USER_KEY);
        return data ? JSON.parse(data) : null;
    }
    updateCurrentUserStats(updatedStats) {
        const currentUser = this.getCurrentUser();
        if (!currentUser)
            return;
        currentUser.statistics = updatedStats;
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(currentUser));
        if (window.HeaderHUD) {
            window.HeaderHUD.stats = updatedStats;
        }
        const users = this.getAllUsers();
        const userIndex = users.findIndex((u) => u.username.toLowerCase() === currentUser.username.toLowerCase());
        if (userIndex !== -1) {
            users[userIndex].statistics = updatedStats;
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        }
    }
    async getCategoryData(category) {
        const response = await fetch(`./build/data/categories/${category}.json`);
        if (!response.ok) {
            throw new Error(`Не вдалося завантажити категорію ${category}`);
        }
        return await response.json();
    }
}
