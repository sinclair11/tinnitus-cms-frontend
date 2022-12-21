export type SampleFormData = {
    name: string;
    category: string;
    description: string;
    file?: string;
    tags?: string[];
    length?: string;
    notification?: string;
};

export type SampleInfo = {
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

export type SampleInfoEdit = {
    id: string;
    description: string;
    category: string;
    tags: string[];
};
