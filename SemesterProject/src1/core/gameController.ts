import { StorageService, createDefaultStatistics } from "../services/storageService.js";
import {
  CategoryData,
  ProductItem,
  Hide,
  TextNode,
} from "../models/userModel.js";

const SYMBOL_POOL = [
    'Α','Β','Γ','Δ','Ε','Ζ','Η','Θ','Ι','Κ','Λ','Μ','Ν','Ξ','Ο','Π','Ρ','Σ','Τ','Υ','Φ','Χ','Ψ','Ω',
    'α','β','γ','δ','ε','ζ','η','θ','ι','κ','λ','μ','ν','ξ','ο','π','ρ','σ','τ','υ','φ','χ','ψ','ω',
    'À','Á','Â','Ã','Ä','Å','Æ','Ç','È','É','Ê','Ë','Ì','Í','Î','Ï','Ñ',
    'Ò','Ó','Ô','Õ','Ö','Ø','Ù','Ú','Û','Ü','Ý',
    'à','á','â','ã','ä','å','æ','ç','è','é','ê','ë','ì','í','î','ï','ñ',
    'ò','ó','ô','õ','ö','ø','ù','ú','û','ý',
    'Ą','Ć','Ę','Ł','Ń','Ó','Ś','Ź','Ż'
];

export class GameController {
  private storageService: StorageService;
  private isGameActive: boolean = false;
  private totalHidesToFind: number = 0;
  private foundHidesCount: number = 0;
  private timerInterval: any = null;
  private currentDifficulty: string = "easy";

  private categoryCache: Record<string, CategoryData> = {};
  private activeHidingMap: Hide[] = [];

  constructor(storageService: StorageService) {
    this.storageService = storageService;
  }

  private difficultySettings: Record<string, { hides: number; time: number; cssClass: string }> = {
    easy: {
      hides: 5,
      time: 5,
      cssClass:
        "hide-trigger text-red-600 font-black cursor-pointer bg-yellow-200 rounded px-0.5 animate-pulse",
    },
    medium: {
      hides: 10,
      time: 4,
      cssClass:
        "hide-trigger text-blue-800 font-bold cursor-pointer hover:bg-blue-100 transition-colors",
    },
    hard: {
      hides: 15,
      time: 2,
      cssClass: "hide-trigger text-black font-normal cursor-pointer",
    },
  };

  public getCategoryDataSync(category: string): CategoryData {
    return this.categoryCache[category];
  }

  public async preloadCategories(): Promise<void> {
    const cats = ["home", "computers", "outdoors"];
    for (const cat of cats) {
      const data = await this.storageService.getCategoryData(cat);
      this.categoryCache[cat] = data;
    }
  }

  public initializeGameWorld(hidesCount: number, timeLimit: number): void {
    const categories = ["home", "computers", "outdoors"];
    const allTexts: TextNode[] = [];

    for (const cat of categories) {
      const data = this.categoryCache[cat];
      if (!data?.items?.length) continue;

      for (const item of data.items) {
        const pushNode = (text: string, fieldName: string) => {
          if (!text || text.trim().length === 0) return;

          allTexts.push({
            locationId: cat,
            itemId: item.id,
            field: fieldName,
            text,
          });
        };

        pushNode(item.name, "name");
        pushNode(item.shortDescription, "shortDescription");

        if (item.extendedDescription) {
          pushNode(item.extendedDescription.mainUsage, "mainUsage");
          pushNode(item.extendedDescription.permissions, "permissions");
          pushNode(item.extendedDescription.dimensions, "dimensions");
        }
      }
    }

    this.activeHidingMap = this.generateHides(allTexts, hidesCount);

    this.startCountdown(timeLimit * 60);

    console.log(
      "GAME WORLD BUILT. Hides generated:",
      this.activeHidingMap.length,
    );
  }

  private generateHides(pool: TextNode[], count: number): Hide[] {
    const hides: Hide[] = [];
    if (!pool.length) return hides;

    for (let i = 0; i < count; i++) {
      const randomNode = pool[Math.floor(Math.random() * pool.length)];
      if (!randomNode?.text || randomNode.text.length === 0) continue;

      const charPosition = Math.floor(Math.random() * randomNode.text.length);
      const originalChar = randomNode.text[charPosition];

      if (!originalChar || originalChar === " ") {
        i--;
        continue;
      }

      hides.push({
        locationId: randomNode.locationId,
        itemId: randomNode.itemId,
        field: randomNode.field,
        charPosition,
        originalChar,
      });
    }

    return hides;
  }

  public prepareDataForRender(category: string): CategoryData {
    const originalData = this.categoryCache[category];

    if (!this.isGameActive || !originalData) return originalData;

    const processedItems = originalData.items.map((item) => {

      const itemHides = this.activeHidingMap.filter(
        (h) => h.locationId === category && h.itemId === item.id,
      );

      const injectHidesIntoString = (
        text: string,
        fieldName: string,
      ): string => {
        if (!text) return text;

        const fieldHides = itemHides.filter((h) => h.field === fieldName);
        if (!fieldHides.length) return text;

        const sortedHides = [...fieldHides].sort(
          (a, b) => b.charPosition - a.charPosition,
        );

        let charArray = text.split("");

        for (const hide of sortedHides) {
          const pos = hide.charPosition;

          const randomSymbol =
            SYMBOL_POOL[Math.floor(Math.random() * SYMBOL_POOL.length)];
          const currentClass =
            this.difficultySettings[this.currentDifficulty].cssClass;

          charArray[pos] = `<span class="${currentClass}" 
                        data-location="${category}" 
                        data-item="${item.id}" 
                        data-field="${fieldName}" 
                        data-pos="${pos}">${randomSymbol}</span>`;
        }

        return charArray.join("");
      };

      return {
        ...item,
        name: injectHidesIntoString(item.name, "name"),
        shortDescription: injectHidesIntoString(
          item.shortDescription,
          "shortDescription",
        ),
        extendedDescription: item.extendedDescription
          ? {
              mainUsage: injectHidesIntoString(
                item.extendedDescription.mainUsage,
                "mainUsage",
              ),
              permissions: injectHidesIntoString(
                item.extendedDescription.permissions,
                "permissions",
              ),
              dimensions: injectHidesIntoString(
                item.extendedDescription.dimensions,
                "dimensions",
              ),
            }
          : item.extendedDescription,
      };
    });

    return {
      ...originalData,
      items: processedItems,
    };
  }

  public isGameSessionActive(): boolean {
    return this.isGameActive;
  }

  public getHidesForLocation(locationId: string): Hide[] {
    if (!this.isGameActive) return [];
    return this.activeHidingMap.filter((h) => h.locationId === locationId);
  }

  public startNewGame(difficulty: string): void {
    const currentUser = this.storageService.getCurrentUser();
    if (!currentUser) return;

    this.currentDifficulty = difficulty;
    
    const settings = this.difficultySettings[difficulty] || this.difficultySettings.easy;

    this.isGameActive = true;
    this.totalHidesToFind = settings.hides;
    this.foundHidesCount = 0;

    if (window.HeaderHUD) {
      window.HeaderHUD.isGameActive = true;
      window.HeaderHUD.totalHides = settings.hides;
      window.HeaderHUD.foundHides = 0;
    }

    const stats = currentUser.statistics;
    const diffKey = this.currentDifficulty as 'easy' | 'medium' | 'hard';

    if (!stats[diffKey]) {
		Object.assign(stats, createDefaultStatistics());
	}

    stats[diffKey].gamesPlayed += 1;
	stats.total.gamesPlayed += 1;

    this.storageService.updateCurrentUserStats(stats);

    this.initializeGameWorld(settings.hides, settings.time);
    console.log(`Game started for: ${currentUser.username}`);
  }

  private startCountdown(seconds: number): void {
    if (this.timerInterval) clearInterval(this.timerInterval);

    const update = (s: number) => {
      const m = Math.floor(s / 60);
      const r = s % 60;

      if (window.HeaderHUD) {
        window.HeaderHUD.timeRemaining = `${m.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`;
      }
    };

    update(seconds);

    this.timerInterval = setInterval(() => {
      seconds--;
      update(seconds);

      if (seconds <= 0) {
        clearInterval(this.timerInterval);
        this.endGameSession(false);
      }
    }, 1000);
  }

  public handleHideFound(
    locationId: string | null,
    itemId: string | null,
    field: string | null,
    pos: number,
    element: HTMLElement,
  ): void {
    if (!this.isGameActive || !locationId || !itemId || !field) return;

    const hideIndex = this.activeHidingMap.findIndex(
      (h) =>
        h.locationId === locationId &&
        String(h.itemId) === String(itemId) &&
        h.field === field &&
        h.charPosition === pos,
    );

    if (hideIndex !== -1) {

      const originalChar = this.activeHidingMap[hideIndex].originalChar;

      this.activeHidingMap.splice(hideIndex, 1);

      element.replaceWith(document.createTextNode(originalChar));

      this.registerHideFound();
    }
  }

  public registerHideFound(): void {
    if (!this.isGameActive) return;

    this.foundHidesCount++;

    if (window.HeaderHUD) {
      window.HeaderHUD.foundHides = this.foundHidesCount;
    }

    const user = this.storageService.getCurrentUser();
    if (user) {
      const stats = user.statistics;
	  const diffKey = this.currentDifficulty as 'easy' | 'medium' | 'hard';

	  stats[diffKey].lettersFound += 1;
	  stats.total.lettersFound += 1;

	  this.storageService.updateCurrentUserStats(stats);
    }

    if (this.foundHidesCount >= this.totalHidesToFind) {
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.endGameSession(true);
    }
  }

  private endGameSession(isWin: boolean): void {
    this.isGameActive = false;

    if (window.HeaderHUD) {
      window.HeaderHUD.isGameActive = false;
      window.HeaderHUD.timeRemaining = "00:00";
    }

    const user = this.storageService.getCurrentUser();
    if (user) {
      const stats = user.statistics;
		const diffKey = this.currentDifficulty as 'easy' | 'medium' | 'hard';

		if (isWin) {
			stats[diffKey].gamesWon += 1;
			stats.total.gamesWon += 1;
			console.log(`Перемога на рівні ${this.currentDifficulty}!`);
            alert(`Перемога на рівні ${this.currentDifficulty}!`)
		} else {
			stats[diffKey].gamesLost += 1;
			stats.total.gamesLost += 1;
			console.log(`Поразка на рівні ${this.currentDifficulty}!`);
            alert(`Поразка на рівні ${this.currentDifficulty}!`);
		}

		this.storageService.updateCurrentUserStats(stats);
    }

    window.location.href = "index.html?view=home";
  }
}
