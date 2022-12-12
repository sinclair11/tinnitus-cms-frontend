import { action, PresetState } from './custom';
import { Category } from '@src/types/general';
import { PresetInfo } from '@src/types/preset';

const initialState: PresetState = {
    categories: new Array<Category>(),
    presets: new Array<PresetInfo>(),
};

export function presetReducer(state: PresetState = initialState, action: action): PresetState {
    const payload = action.payload;
    switch (action.type) {
        case 'preset/categories':
            return {
                ...state,
                categories: payload,
            };
        case 'preset/category':
            return {
                ...state,
                categories: [...state.categories, payload],
            };
        case 'preset/setPresets':
            return {
                ...state,
                presets: payload,
            };
        default:
            return state;
    }
}
