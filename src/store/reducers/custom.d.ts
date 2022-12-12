import { Category } from '@src/types/general';
import { AlbumInfo } from '@src/types/album';
import { SampleInfo } from '@src/types/sample';
import { PresetInfo } from '@src/types/preset';

export type ResdataState = {
    selected: string;
    info: { name: string; value: unknown }[];
    usage: { name: string; value: unknown }[];
    infoData: any;
    thumbnail: string;
    checks: unknown;
};

export type GeneralState = {
    auth: any;
};

export type AlbumState = {
    categories: Category[];
    albums: AlbumInfo[];
};

export type SampleState = {
    categories: Category[];
    samples: SampleInfo[];
};

export type PresetState = {
    categories: Category[];
    presets: PresetInfo[];
};

export type OciState = {
    config: { prereq: string };
};

export type CombinedStates = {
    ociReducer: OciState;
    resdataReducer: ResdataState;
    progressReducer: ProgState;
    generalReducer: GeneralState;
    albumReducer: AlbumState;
    sampleReducer: SampleState;
    presetReducer: PresetState;
};

export type action = {
    type: string;
    payload: any;
};
