import { Category, CategoryDetail } from './types.js';

export class UIService {
    private content: HTMLElement;

    constructor(containerId: string) {
        this.content = document.getElementById(containerId) as HTMLElement;
    }

    renderHome(): void {
        this.content.innerHTML = `
        <div class="flex flex-col items-center pt-6 px-4">
            <h2 class="text-4xl md:text-5xl font-black mb-8 text-center tracking-tighter" style="font-family: sans-serif;">
                <span class="text-znaydy-pink">ζн</span>ÂйДü <span class="text-znaydy-yellow">мĘĦÈ</span> Store
            </h2>

            <div class="bg-white/10 backdrop-blur-md p-8 rounded-[40px] border-4 border-white/20 shadow-2xl max-w-4xl w-full text-center">
                <p class="text-znaydy-yellow text-xl font-bold mb-6 uppercase tracking-widest">Дана сторінка є частиною майбутнього проекту хованок, але зараз хованок немає :( Тому зараз ви можете познайомитися з учасниками (символьний простір проєкту):</p>
                
                <div class="space-y-6 font-mono text-lg md:text-xl text-white leading-relaxed break-words opacity-90">
                    <div class="p-3 bg-black/20 rounded-xl">
                        Α Β Γ Δ Ε Ζ Η Θ Ι Κ Λ Μ Ν Ξ Ο Π Ρ Σ Τ Υ Φ Χ Ψ Ω<br>
                        α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ σ τ υ φ χ ψ ω
                    </div>
                    
                    <div class="p-3 bg-black/20 rounded-xl">
                        А Б В Г Ґ Д Е Є Ж З И І Ї Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ь Ю Я<br>
                        а б в г ґ д е є ж з и і ї й к л м н о п р с т у ф х ц ч ш щ ь ю я
                    </div>
                    
                    <div class="p-3 bg-black/20 rounded-xl text-znaydy-pink">
                        A B C D E F G H I J K L M N O P Q R S T U V W X Y Z<br>
                        a b c d e f g h i j k l m n o p q r s t u v w x y z
                    </div>
                    
                    <div class="p-3 bg-black/20 rounded-xl text-znaydy-green">
                        À Á Â Ã Ä Å Æ Ç È É Ê Ë Ì Í Î Ï Ñ Ò Ó Ô Õ Ö Ø Ù Ú Û Ü Ý<br>
                        à á â ã ä å æ ç è é ê ë ì í î ï ñ ò ó ô õ ö ø ù ú û ü ý
                    </div>

                    <div class="p-3 bg-black/20 rounded-xl font-bold italic">
                        Ą Ć Ę Ł Ń Ó Ś Ź Ż | Ħ ħ Ċ ċ Ġ ġ Ż ż
                    </div>
                </div>

                <div class="mt-8">
                    <p class="text-white text-xl font-medium">
                        А також ознайомитися з <span class="text-znaydy-yellow font-black underline decoration-2 offset-4 cursor-pointer" onclick="document.getElementById('catalogLink').click()">каталогом товарів</span>
                    </p>
                </div>
            </div>
        </div>
        `;
    }

renderCategories(categories: Category[], onCategoryClick: (s: string) => void, onSpecialsClick: () => void): void {

    this.content.innerHTML = `
        <div class="relative min-h-[600px] w-full py-10 overflow-hidden">
            <h2 class="text-4xl font-black text-white mb-16 text-center italic tracking-widest uppercase">
                Досліди категорії, ніби реально щось шукаєш 
            </h2>
            
            <div class="absolute top-100 left-50 text-znaydy-pink opacity-50 rotate-[-15deg] font-bold text-sm max-w-[150px]">
                !!! тут нікого незаконного немає, лише корисна техніка... мабуть
            </div>
            <div class="absolute bottom-20 right-10 text-znaydy-green opacity-40 rotate-[10deg] font-bold text-lg">
                (не натискай сюди) -> ХХХ
            </div>
            <div class="absolute top-1/2 left-0 text-white/20 -rotate-90 font-black text-5xl select-none">
                ZNAYDY MENE
            </div>

            <div id="categories-wrapper" class="relative flex flex-wrap justify-center gap-20 max-w-5xl mx-auto z-10">
                </div>
        </div>
    `;

    const wrapper = document.getElementById('categories-wrapper') as HTMLElement;

    categories.forEach((cat, index) => {
        const itemContainer = document.createElement('div');
        itemContainer.className = 'relative group';

        const rotate = index % 2 === 0 ? 'rotate-3' : '-rotate-3';
        const shiftY = index % 3 === 0 ? 'translate-y-8' : index % 3 === 1 ? '-translate-y-4' : 'translate-y-0';

        itemContainer.innerHTML = `
            <svg class="absolute -top-10 -left-10 w-20 h-20 text-znaydy-yellow opacity-0 group-hover:opacity-100 transition-opacity duration-300" viewBox="0 0 100 100">
            </svg>

            <div class="${rotate} ${shiftY} bg-znaydy-pink hover:bg-znaydy-yellow text-black text-2xl font-black p-10 rounded-3xl 
                        cursor-pointer shadow-[12px_12px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-none 
                        hover:translate-x-2 hover:translate-y-2 transition-all duration-300 min-w-[220px] text-center border-4 border-black">
                ${cat.name}
            </div>

            <div class="absolute -bottom-8 left-0 right-0 text-center text-xs font-mono text-white/60 tracking-tighter italic">
                Сектор з прикольними ${cat.shortname} товарами
            </div>
        `;

        itemContainer.onclick = () => onCategoryClick(cat.shortname);
        wrapper.appendChild(itemContainer);
    });

    const specWrapper = document.createElement('div');
    specWrapper.className = 'w-full flex justify-center mt-24 relative';
    specWrapper.innerHTML = `
        <div class="absolute -top-10 text-znaydy-yellow font-black animate-bounce">↓↓↓ ТУТ ЩОСЬ ЦІКАВЕ ↓↓↓</div>
        <button class="bg-znaydy-green border-4 border-black text-black text-2xl font-black px-16 py-6 rounded-full 
                       shadow-[0_10px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-2 transition-all">
            ЗНАЙТИ SPECIALS
        </button>
    `;
    specWrapper.onclick = onSpecialsClick;
    this.content.querySelector('.relative')?.appendChild(specWrapper);
}

    renderItems(data: CategoryDetail): void {
    this.content.innerHTML = `
        <h2 class="text-2xl font-black text-white/40 mb-20 uppercase tracking-[1em] text-center">
            Шукай, що треба, може знайдеш
        </h2>
    `;

    const container = document.createElement('div');
    container.className = 'relative min-h-[1000px] w-full';

    data.items.forEach((item, index) => {
        const itemNode = document.createElement('div');

        const offsets = [
            'left-[5%] top-0', 
            'left-[40%] top-[100px]', 
            'left-[15%] top-[450px]', 
            'left-[55%] top-[550px]',
            'left-[10%] top-[850px]'
        ];
        const currentOffset = offsets[index % offsets.length];

        itemNode.className = `absolute ${currentOffset} w-[350px] group transition-all duration-500`;

        itemNode.innerHTML = `
            <div class="absolute -inset-6 border-4 border-white/10 rounded-none rotate-2 pointer-events-none"></div>

            <div class="relative">
                <div class="absolute -top-10 -left-6 z-30 transform -rotate-12">
                    <div class="bg-znaydy-pink border-2 border-black p-4 w-24 h-24 flex items-center justify-center shadow-[10px_10px_0_0_rgba(0,0,0,1)]">
                        <span class="text-[14px] leading-[0.8] font-black text-black uppercase break-all">
                            ${item.name}
                        </span>
                    </div>
                </div>

                <div class="ml-10 mt-4 relative z-10">
                    <img src="https://placehold.co/200x200/4F6AFE/white?text=${item.shortname}" 
                         class="w-44 h-56 object-cover border-2 border-white shadow-2xl grayscale hover:grayscale-0 transition-all">
                    <div class="absolute bottom-0 right-0 bg-white text-black text-[8px] px-1 italic">
                        Хаос з номером:${Math.random().toFixed(2)}
                    </div>
                </div>

                <div class="absolute top-20 -right-20 z-20 w-48 rotate-6">
                    <div class="bg-black text-white p-2 border-l-8 border-znaydy-green">
                        <p class="text-[9px] uppercase leading-tight tracking-tighter opacity-80">
                            ${item.description || 'no_description_available_in_this_sector'}
                        </p>
                    </div>
                </div>

                <div class="absolute -bottom-6 left-12 z-40 transform skew-x-12">
                    <div class="bg-znaydy-yellow text-black text-4xl font-black px-2 border-2 border-black italic">
                        ${item.price}<span class="text-xs">грн</span>
                    </div>
                </div>

                <button class="absolute -bottom-12 right-0 bg-white hover:bg-znaydy-pink text-black text-[10px] font-bold px-4 py-1 border border-black uppercase tracking-[3px]">
                    >> get
                </button>

                <div class="absolute top-0 left-0 w-full h-full border-r-2 border-t-2 border-white/20 -z-10"></div>
            </div>
        `;

        container.appendChild(itemNode);
    });

    this.content.appendChild(container);
}
}