export interface Hide {
    locationId: string;
    itemId: string | number;
    field: string;
    charPosition: number;
    originalChar: string;
}
export type TextNode = {
    locationId: string;
    itemId: string | number;
    field: string; 
    text: string;
};

export interface LevelStats {
    gamesPlayed: number;
    gamesWon: number;
    gamesLost: number;
    lettersFound: number;
}

export interface PlayerStatistics {

    easy: LevelStats;
    medium: LevelStats;
    hard: LevelStats;
    
    total: LevelStats;
}
export interface User {
    username: string;
    passwordHash: string; 
    statistics: PlayerStatistics;
}
interface IHeaderHUD {
    isGameActive: boolean;
    username: string;
    timeRemaining: string;
    foundHides: number;
    totalHides: number;
    stats: PlayerStatistics;
}

declare global {
    interface Window {
        HeaderHUD: IHeaderHUD;
        AppController: any; 
        AppRouter:any;
    }
}

export interface ProductItem {
    id: number;
    name: string;
    shortname: string;
    shortDescription: string;
    price: string;
    extendedDescription: {
        mainUsage: string;
        permissions: string;
        dimensions: string;
    };
}

export interface CategoryData {
    categoryName: string;
    shortname: string;
    items: ProductItem[];
}
interface GameState {
    isActive: boolean;
    hidesCount: number;
    found: number;
    timeLeft: number;
    currentView: string;
}