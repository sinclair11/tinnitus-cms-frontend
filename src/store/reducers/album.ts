import { action, AlbumState } from './custom';
import { Category } from '@src/types/general';
import { AlbumInfo } from '@src/types/album';

const initialState: AlbumState = {
    categories: new Array<Category>(),
    albums: new Array<AlbumInfo>(),
};

export function albumReducer(state: AlbumState = initialState, action: action): AlbumState {
    const payload = action.payload;
    switch (action.type) {
        case 'album/categories':
            return {
                ...state,
                categories: payload,
            };
        case 'album/category':
            return {
                ...state,
                categories: [...state.categories, payload],
            };
        case 'album/setAlbums':
            return {
                ...state,
                albums: payload,
            };
        default:
            return state;
    }
}
