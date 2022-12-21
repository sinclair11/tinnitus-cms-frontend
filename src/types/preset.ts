export type PresetFormData = {
    name: string;
    category: string;
    description: string;
    file?: string;
    tags?: string[];
    length?: string;
    notification?: string;
};

export type PresetInfo = {
    id?: string;
    name: string;
    description: string;
    tags: string[];
    length: string;
    category: string;
    likes: number;
    reviews: number;
    uploadDate: any;
    favorites: number;
    views: number;
};

export type PresetEditInfo = {
    id: string;
    category: string;
    description: string;
    tags: string[];
};
