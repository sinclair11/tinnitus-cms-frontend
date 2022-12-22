const host = 'localhost:8080';

export const Endpoints = {
    API_LOGIN: `http://${host}/login`,
    API_GET_ALBUMS: `http://${host}/api/admin/albums`,
    API_ALBUM: `http://${host}/api/admin/album`,
    API_ALBUM_CHECK: `http://${host}/api/admin/album/check`,
    API_ALBUM_POST_AUDIO: `http://${host}/api/admin/album/audio`,
    API_ALBUM_POST_ARTWORK: `http://${host}/api/admin/album/artwork`,
    API_ALBUM_GET_AUDIO: `http://${host}/api/admin/album/assets/audio`,
    API_ALBUM_GET_ARTWORK: `http://${host}/api/admin/album/assets/artwork`,
    API_GET_PRESETS: `http://${host}/api/admin/presets`,
    API_PRESET: `http://${host}/api/admin/preset`,
    API_PRESET_POST_AUDIO: `http://${host}/api/admin/preset/audio`,
    API_PRESET_POST_ARTWORK: `http://${host}/api/admin/preset/artwork`,
    API_PRESET_GET_AUDIO: `http://${host}/api/admin/preset/assets/audio`,
    API_PRESET_GET_ARTWORK: `http://${host}/api/admin/preset/assets/artwork`,
    API_GET_SAMPLES: `http://${host}/api/admin/samples`,
    API_SAMPLE: `http://${host}/api/admin/sample`,
    API_SAMPLE_POST_AUDIO: `http://${host}/api/admin/sample/audio`,
    API_SAMPLE_POST_ARTWORK: `http://${host}/api/admin/sample/artwork`,
    API_SAMPLE_GET_AUDIO: `http://${host}/api/admin/sample/assets/audio`,
    API_SAMPLE_GET_ARTWORK: `http://${host}/api/admin/sample/assets/artwork`,
};
