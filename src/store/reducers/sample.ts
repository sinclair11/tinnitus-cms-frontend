import { action, SampleState } from './custom';
import { Category } from '@src/types/general';
import { SampleInfo } from '@src/types/sample';

const initialState: SampleState = {
    categories: new Array<Category>(),
    samples: new Array<SampleInfo>(),
};

export function sampleReducer(state: SampleState = initialState, action: action): SampleState {
    const payload = action.payload;
    switch (action.type) {
        case 'sample/categories':
            return {
                ...state,
                categories: payload,
            };
        case 'sample/category':
            return {
                ...state,
                categories: [...state.categories, payload],
            };
        case 'samples/setSamples':
            return {
                ...state,
                samples: payload,
            };
        default:
            return state;
    }
}
