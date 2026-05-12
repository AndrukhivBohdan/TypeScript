export interface Category {
    name: string;
    shortname: string;
}

export interface Item {
    name: string;
    shortname: string;
    description?: string;
    price: string | number;
}

export interface CategoryDetail {
    categoryName: string;
    items: Item[];
}

declare global {
interface Window {
    $ajaxUtils: {
        sendGetRequest: (
            url: string, 
            handler: (response: any) => void, 
            isJsonResponse?: boolean
        ) => boolean;
    };
}
}