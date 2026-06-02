import { StorageService } from "../services/storageService.js";
import { CategoryData, Hide, PlayerStatistics } from "../models/userModel.js";

export class GameRenderer {
  private contentContainer: HTMLElement;
  private storageService: StorageService;

  constructor(storageService: StorageService) {
    this.contentContainer = document.getElementById(
      "app-content",
    ) as HTMLElement;
    this.storageService = storageService;
  }

  private escapeHtml(value: string): string {
    const element = document.createElement("div");
    element.textContent = value;
    return element.innerHTML;
  }
  public clear(): void {
    this.contentContainer.innerHTML = "";
  }

  public renderAuthForm(): void {
    this.contentContainer.innerHTML = `
            <div class="w-full min-h-[calc(100vh-5rem)] bg-brand-blue flex items-center justify-center p-4 md:p-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full relative z-10">
                    
                    <div class="bg-slate-900 border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
                        <div>
                            <h3 class="text-2xl font-black text-brand-yellow uppercase tracking-wider mb-6 italic border-b-2 border-slate-800 pb-2">Вхід до системи</h3>
                            <form id="login-form" class="space-y-4">
                                <div>
                                    <label class="block text-brand-light text-xs uppercase font-mono font-bold mb-1">Нікнейм</label>
                                    <input type="text" id="login-username" required class="w-full bg-slate-950 border-2 border-black rounded-xl p-3 text-white font-bold focus:outline-none focus:border-brand-yellow transition-colors" placeholder="Player_1">
                                </div>
                                <div>
                                    <label class="block text-brand-light text-xs uppercase font-mono font-bold mb-1">Пароль</label>
                                    <input type="password" id="login-password" required class="w-full bg-slate-950 border-2 border-black rounded-xl p-3 text-white font-bold focus:outline-none focus:border-brand-yellow transition-colors" placeholder="••••••••">
                                </div>
                                <button type="submit" class="w-full bg-brand-green hover:bg-emerald-600 text-black font-black py-3 rounded-xl uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all">Увійти 🔑</button>
                            </form>
                        </div>
                    </div>

                    <div class="bg-slate-900 border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
                        <div>
                            <h3 class="text-2xl font-black text-brand-orange uppercase tracking-wider mb-6 italic border-b-2 border-slate-800 pb-2">Реєстрація гравця</h3>
                            <form id="register-form" class="space-y-4">
                                <div>
                                    <label class="block text-brand-light text-xs uppercase font-mono font-bold mb-1">Придумати Нікнейм</label>
                                    <input type="text" id="reg-username" required class="w-full bg-slate-950 border-2 border-black rounded-xl p-3 text-white font-bold focus:outline-none focus:border-brand-orange transition-colors" placeholder="New_Hero">
                                </div>
                                <div>
                                    <label class="block text-brand-light text-xs uppercase font-mono font-bold mb-1">Пароль</label>
                                    <input type="password" id="reg-password" required class="w-full bg-slate-950 border-2 border-black rounded-xl p-3 text-white font-bold focus:outline-none focus:border-brand-orange transition-colors" placeholder="••••••••">
                                </div>
                                <button type="submit" class="w-full bg-brand-orange hover:bg-orange-600 text-black font-black py-3 rounded-xl uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all">Створити акаунт 📝</button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        `;

    this.initAuthEventListeners();
  }

  private initAuthEventListeners(): void {
    const loginForm = document.getElementById("login-form") as HTMLFormElement;
    const registerForm = document.getElementById(
      "register-form",
    ) as HTMLFormElement;

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const userInp = (
        document.getElementById("login-username") as HTMLInputElement
      ).value.trim();
      const passInp = (
        document.getElementById("login-password") as HTMLInputElement
      ).value;

      const res = this.storageService.loginUser(userInp, passInp);
      alert(res.message);

      if (res.success && res.user) {
        if ((window as any).HeaderHUD) {
          (window as any).HeaderHUD.username = res.user.username;
        }
        window.location.href = "index.html?view=all";
      }
    });

    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const userInp = (
        document.getElementById("reg-username") as HTMLInputElement
      ).value.trim();
      const passInp = (
        document.getElementById("reg-password") as HTMLInputElement
      ).value;

      if (userInp.length < 3) {
        alert("Нікнейм має бути не коротшим за 3 символи!");
        return;
      }

      const res = this.storageService.registerUser(userInp, passInp);
      alert(res.message);

      if (res.success) {
        registerForm.reset();
      }
    });
  }
  public renderHomeView(): void {
    const appContentElement = document.getElementById("app-content");
    if (!appContentElement) return;

    appContentElement.innerHTML = `
	<div class="w-full max-w-4xl mx-auto p-6">
		
		<div class="bg-amber-400 p-8 md:p-12 rounded-[40px] text-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 text-center md:text-left">
			<h1 class="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4 ">
				Вітаємо у ζнÂйДü мĘĦÈ!
			</h1>
			<p class="text-lg md:text-xl font-bold font-mono text-slate-900 leading-relaxed max-w-2xl">
				Це не просто онлайн-магазин, а зона текстової аномалії. Простір між рядками викривився, і звичайні описи товарів тепер приховують таємничі хайди. Твоє завдання — очистити каталог від збоїв!
			</p>
		</div>

		<div class="bg-white p-8 md:p-10 rounded-[40px] text-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
			<h2 class="text-2xl md:text-3xl font-black uppercase tracking-tight mb-8 flex items-center gap-2">
				Інструкція для Слідопита
			</h2>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
				
				<div class="bg-fuchsia-300 p-6 rounded-[24px] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
					<div>
						<div class="text-3xl font-black mb-2 font-mono">01.</div>
						<h3 class="font-black uppercase text-lg mb-2">Обери Складність</h3>
						<p class="text-sm font-bold text-slate-800">
							Зайди в меню гри та обери свій рівень. <b class="text-red-700">Новачок</b> підсвічує хайди яскравим жовтим кольором, а режим <b class="text-black">Хакер</b> маскує їх ідеально під колір тексту.
						</p>
					</div>
				</div>

				<div class="bg-cyan-400 p-6 rounded-[24px] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
					<div>
						<div class="text-3xl font-black mb-2 font-mono">02.</div>
						<h3 class="font-black uppercase text-lg mb-2">Шукай Аномалії</h3>
						<p class="text-sm font-bold text-slate-800">
							Переглядай категорії та уважно читай назви й описи товарів. Помітив дивний символ, грецьку літеру чи підсвічений знак? Це він!
						</p>
					</div>
				</div>

				<div class="bg-orange-400 p-6 rounded-[24px] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
					<div>
						<div class="text-3xl font-black mb-2 font-mono">03.</div>
						<h3 class="font-black uppercase text-lg mb-2">Клікай та Керуй</h3>
						<p class="text-sm font-bold text-slate-800">
							Тисни мишкою прямо на аномальний символ. Він миттєво перетвориться на нормальну літеру, а твій лічильник у верхній панелі (HUD) оновиться.
						</p>
					</div>
				</div>

			</div>

			<div class="mt-8 bg-slate-950 text-white p-5 rounded-[24px] font-mono text-xs space-y-2">
				<p class="text-amber-400 font-bold uppercase text-sm mb-1">💡 Гарячі поради на замітку:</p>
				<p>• <span class="text-cyan-300">Таймер не чекає:</span> якщо час вийде до того, як ти знайдеш усі хайди, систему заблокує і гру буде програно.</p>
				<p>• <span class="text-fuchsia-300">Прогрес трекається:</span> кожна зіграна гра, перемога чи знайдений символ записуються у твою особисту статистику окремо для кожного рівня.</p>
				<p>• <span class="text-orange-300">Функціонал магазину:</span> його немає, лише аномалії.</p>
			</div>

		</div>
	</div>
    `;
  }

  public renderStatsModal(): void {
    if (!this.contentContainer) return;
    this.contentContainer.innerHTML = "";

    const currentUser = this.storageService.getCurrentUser();

    const createEmptyRow = () => ({
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      lettersFound: 0,
    });

    const defaultStats: PlayerStatistics = {
      easy: createEmptyRow(),
      medium: createEmptyRow(),
      hard: createEmptyRow(),
      total: createEmptyRow(),
    };

    const stats = currentUser?.statistics ?? defaultStats;
    const username = this.escapeHtml(currentUser?.username ?? "Гість");

    const calculateWinRate = (won: number, played: number): string => {
      if (!played) return "0%";
      return `${Math.round((won / played) * 100)}%`;
    };

    const pageWrapper = document.createElement("div");
    pageWrapper.id = "stats-page-wrapper";
    pageWrapper.className = "w-full max-w-6xl mx-auto p-4";

    this.contentContainer.appendChild(pageWrapper);

    pageWrapper.innerHTML = `
		<div class="bg-amber-400 p-8 md:p-12 rounded-[40px] text-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
			
			<div class="flex justify-between items-center mb-10">
				<h3 class="text-4xl font-black uppercase tracking-tight">
					Статистика: <span class="bg-black text-amber-400 px-4 py-1 rounded-2xl ml-2">${username}</span>
				</h3>
			</div>

			<h4 class="text-xl font-black uppercase mb-4 tracking-wide">Загальні досягнення</h4>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
				
				<div class="bg-fuchsia-300 rounded-[32px] p-6 flex flex-col items-center text-center min-h-[220px] justify-between border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
					<div class="font-black text-sm text-slate-900 uppercase">Всього знайдено</div>
					<div class="text-6xl font-black font-mono my-2">${stats.total?.lettersFound ?? 0}</div>
					<div class="text-xs font-bold uppercase text-slate-800">символів</div>
				</div>
				
				<div class="bg-cyan-400 rounded-[32px] p-6 flex flex-col items-center text-center min-h-[220px] justify-between border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
					<div class="font-black text-sm text-slate-900 uppercase">Зіграно ігор</div>
					<div class="text-6xl font-black font-mono my-2">${stats.total?.gamesPlayed ?? 0}</div>
					<div class="text-xs font-bold uppercase text-slate-800">сесій</div>
				</div>
				
				<div class="bg-orange-400 rounded-[32px] p-6 flex flex-col items-center text-center min-h-[220px] justify-between border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
					<div class="font-black text-sm text-slate-900 uppercase">Успішні ігри</div>
					<div class="text-6xl font-black font-mono my-2">${stats.total?.gamesWon ?? 0}</div>
					<div class="text-xs font-bold uppercase text-slate-800">перемог</div>
				</div>
				
				<div class="bg-purple-400 rounded-[32px] p-6 flex flex-col items-center justify-center text-center min-h-[220px] border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
					<div class="font-black text-sm text-slate-900 uppercase mb-2">Вінрейт</div>
					<div class="text-5xl font-black font-mono">${calculateWinRate(stats.total?.gamesWon ?? 0, stats.total?.gamesPlayed ?? 0)}</div>
					<div class="text-xs font-bold uppercase mt-2 text-slate-800">ефективність</div>
				</div>

			</div>

			<h4 class="text-xl font-black uppercase mb-4 tracking-wide">Прогрес по рівнях складності</h4>
			<div class="space-y-4">
				
				<div class="bg-white p-4 rounded-[24px] border-4 border-black flex flex-col md:flex-row justify-between items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
					<div class="flex items-center gap-3 min-w-[200px]">
						<div>
							<div class="font-black uppercase text-lg leading-tight">Новачок</div>
							<div class="text-xs font-mono text-slate-600">Легкий рівень</div>
						</div>
					</div>
					<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full justify-items-center md:justify-items-end text-center md:text-right font-mono font-bold text-sm">
						<div><span class="block text-xs uppercase font-sans font-black text-slate-500">Ігри:</span> ${stats.easy?.gamesPlayed ?? 0}</div>
						<div><span class="block text-xs uppercase font-sans font-black text-emerald-600">Виграно:</span> ${stats.easy?.gamesWon ?? 0}</div>
						<div><span class="block text-xs uppercase font-sans font-black text-rose-600">Програно:</span> ${stats.easy?.gamesLost ?? 0}</div>
						<div><span class="block text-xs uppercase font-sans font-black text-purple-600">Хайди:</span> ${stats.easy?.lettersFound ?? 0}</div>
					</div>
				</div>

				<div class="bg-white p-4 rounded-[24px] border-4 border-black flex flex-col md:flex-row justify-between items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
					<div class="flex items-center gap-3 min-w-[200px]">
						<div>
							<div class="font-black uppercase text-lg leading-tight">Слідопит</div>
							<div class="text-xs font-mono text-slate-600">Середній рівень</div>
						</div>
					</div>
					<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full justify-items-center md:justify-items-end text-center md:text-right font-mono font-bold text-sm">
						<div><span class="block text-xs uppercase font-sans font-black text-slate-500">Ігри:</span> ${stats.medium?.gamesPlayed ?? 0}</div>
						<div><span class="block text-xs uppercase font-sans font-black text-emerald-600">Виграно:</span> ${stats.medium?.gamesWon ?? 0}</div>
						<div><span class="block text-xs uppercase font-sans font-black text-rose-600">Програно:</span> ${stats.medium?.gamesLost ?? 0}</div>
						<div><span class="block text-xs uppercase font-sans font-black text-purple-600">Хайди:</span> ${stats.medium?.lettersFound ?? 0}</div>
					</div>
				</div>

				<div class="bg-white p-4 rounded-[24px] border-4 border-black flex flex-col md:flex-row justify-between items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
					<div class="flex items-center gap-3 min-w-[200px]">
						<div>
							<div class="font-black uppercase text-lg leading-tight">Хакер</div>
							<div class="text-xs font-mono text-slate-600">Важкий рівень</div>
						</div>
					</div>
					<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full justify-items-center md:justify-items-end text-center md:text-right font-mono font-bold text-sm">
						<div><span class="block text-xs uppercase font-sans font-black text-slate-500">Ігри:</span> ${stats.hard?.gamesPlayed ?? 0}</div>
						<div><span class="block text-xs uppercase font-sans font-black text-emerald-600">Виграно:</span> ${stats.hard?.gamesWon ?? 0}</div>
						<div><span class="block text-xs uppercase font-sans font-black text-rose-600">Програно:</span> ${stats.hard?.gamesLost ?? 0}</div>
						<div><span class="block text-xs uppercase font-sans font-black text-purple-600">Хайди:</span> ${stats.hard?.lettersFound ?? 0}</div>
					</div>
				</div>

			</div>
		</div>
	`;
  }

  public renderGameStartMenu(onStart: (difficulty: string) => void): void {
    this.contentContainer.innerHTML = `
            <div class="w-full max-w-3xl mx-auto p-6">
                <div class="bg-brand-light text-black p-8 rounded-[32px] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">

                    <h2 class="text-3xl font-black uppercase mb-6">
                        Налаштування гри
                    </h2>

                    <div class="mb-6">
                        <label class="block font-black uppercase text-sm mb-2">
                            Оберіть рівень складності
                        </label>
                        <select id="gameDifficulty" 
                            class="w-full p-3 rounded-xl border-2 border-black font-black text-lg bg-white cursor-pointer focus:outline-none">
                            <option value="easy" selected>Новачок (5 хайдів / 5 хв)</option>
                            <option value="medium">Слідопит (10 хайдів / 4 хв)</option>
                            <option value="hard">Хакер (15 хайдів / 2 хв)</option>
                        </select>
                    </div>

                    <button id="startGameBtn"
                        class="w-full bg-brand-orange hover:bg-orange-600 text-black font-black uppercase text-xl py-4 rounded-2xl border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 transition-all">
                        Почати гру
                    </button>

                </div>
            </div>
        `;

    this.initGameStartMenuListeners(onStart);
  }

  private initGameStartMenuListeners(
    onStart: (difficulty: string) => void,
  ): void {
    const btn = document.getElementById("startGameBtn") as HTMLButtonElement;

    btn?.addEventListener("click", () => {
      const difficultySelect = document.getElementById(
        "gameDifficulty",
      ) as HTMLSelectElement;
      const difficulty = difficultySelect?.value || "easy";

      onStart(difficulty);
    });
  }

  private applyHides(
    text: string,
    itemId: string | number,
    fieldName: string,
    category: string,
    hides: Hide[],
  ): string {
    if (!text) return "";
    if (!hides || hides.length === 0) return text;

    const chars = text.split("");

    const itemFieldHides = hides.filter(
      (h) =>
        String(h.itemId) === String(itemId) &&
        h.field === fieldName &&
        h.locationId === category,
    );

    const activeDifficulty =
      (window.AppController as any)?.currentDifficulty || "easy";
    const difficultySettings = (window.AppController as any)
      ?.difficultySettings || {
      easy: {
        cssClass:
          "hide-trigger text-red-600 font-black cursor-pointer bg-yellow-200 rounded px-0.5 animate-pulse",
      },
      medium: {
        cssClass:
          "hide-trigger text-blue-800 font-bold cursor-pointer hover:bg-blue-100 transition-colors",
      },
      hard: { cssClass: "hide-trigger text-black font-normal cursor-pointer" },
    };

    const currentClass =
      difficultySettings[activeDifficulty]?.cssClass ||
      difficultySettings.easy.cssClass;

    for (const hide of itemFieldHides) {
      if (hide.charPosition < chars.length) {
        const randomSymbol =
          (hide as any).randomSymbol || chars[hide.charPosition];

        chars[hide.charPosition] = `<span class="${currentClass}" 
                    data-location="${category}" 
                    data-item="${itemId}" 
                    data-field="${fieldName}" 
                    data-pos="${hide.charPosition}">${randomSymbol}</span>`;
      }
    }

    return chars.join("");
  }

  public renderProductsView(data: CategoryData, hides: Hide[] = []): void {
    const bgColors = ["bg-fuchsia-300", "bg-cyan-400", "bg-orange-400"];
    const categoryKey = data.shortname || "";

    const itemsHtml = data.items
      .map((item, index) => {
        const currentBg = bgColors[index % bgColors.length];

        return `
            <div class="${currentBg} p-6 md:p-8 rounded-[32px] text-black flex flex-col justify-between transition-transform hover:scale-[1.01]">

                <div>
                    <div class="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                        <h3 class="text-2xl font-black tracking-tight leading-tight uppercase font-sans">
                            ${this.applyHides(item.name, item.id, "name", categoryKey, hides)}
                        </h3>

                        <span class="bg-slate-950 text-white text-lg font-mono font-bold px-5 py-2 rounded-full">
                            ${item.price}
                        </span>
                    </div>

                    <p class="text-sm font-mono font-bold bg-white/40 px-4 py-2 rounded-xl inline-block mb-6">
                        ${this.applyHides(item.shortDescription, item.id, "shortDescription", categoryKey, hides)}
                    </p>

                    <div class="space-y-4 text-slate-900 text-sm md:text-base">

                        <div class="bg-white/20 p-4 rounded-2xl">
                            <span class="block text-xs uppercase font-mono font-black mb-1">
                                Основне використання:
                            </span>
                            <p>
                                ${this.applyHides(item.extendedDescription.mainUsage, item.id, "extendedDescription.mainUsage", categoryKey, hides)}
                            </p>
                        </div>

                        <div class="bg-white/20 p-4 rounded-2xl">
                            <span class="block text-xs uppercase font-mono font-black mb-1">
                                Дозволи та сумісність:
                            </span>
                            <p>
                                ${this.applyHides(item.extendedDescription.permissions, item.id, "extendedDescription.permissions", categoryKey, hides)}
                            </p>
                        </div>

                        <div class="bg-white/20 p-4 rounded-2xl">
                            <span class="block text-xs uppercase font-mono font-black mb-1">
                                Розміри та габарити:
                            </span>
                            <p>
                                ${this.applyHides(item.extendedDescription.dimensions, item.id, "extendedDescription.dimensions", categoryKey, hides)}
                            </p>
                        </div>

                    </div>
                </div>

                <div class="mt-6 flex justify-end">
                    <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-full"
                        onclick="console.log('BUY:', '${item.id}')">
                        Замовити товар
                    </button>
                </div>

            </div>
            `;
      })
      .join("");

    this.contentContainer.innerHTML = `
        <div class="w-full max-w-6xl mx-auto pt-4 px-4 pb-12">

            <div class="bg-amber-400 p-6 rounded-[32px] mb-8 flex justify-between items-center">
                <h2 class="text-3xl font-black text-black uppercase">
                    Каталог: ${data.categoryName}
                </h2>

                <button
                    class="bg-slate-950 text-white px-6 py-2 rounded-full"
                    onclick="window.location.search=''">
                    Назад
                </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                ${itemsHtml}
            </div>

        </div>
        `;
  }
}
