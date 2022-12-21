import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { PresetFormData } from '@src/types/preset';
import { useSelector } from 'react-redux';
import { Category } from '@src/types/general';
import { createObjectStoragePath, getDurationFormat, parseTags } from '@utils/helpers';
import { InputGroup, FormControl } from 'react-bootstrap';
import Dropdown from '@components/dropdown/dropdown';
import Artwork from '@components/artwork/artwork';
import { CombinedStates } from '@store/reducers/custom';
import {
    deletePreset,
    editPresetData,
    uploadPresetArtwork,
    uploadPresetFile,
    uploadPresetInfo,
} from '@services/preset-services';
import ProgressbarUpload from '@components/progressbar/progressbar-upload';
import axios from 'axios';

type FormProps = {
    type: string;
    data?: PresetFormData;
    id?: string;
};

const PresetForm = forwardRef((props: FormProps, ref?: any) => {
    const categories = useSelector<CombinedStates>((state) => state.presetReducer.categories) as Category[];
    const preauthreq = useSelector<CombinedStates>((state: CombinedStates) => state.ociReducer.config.prereq) as string;
    const [name, setName] = useState('');
    const [nameinvalid, setNameInvalid] = useState('');
    const [description, setDescription] = useState('');
    const [descInvalid, setDescInvalid] = useState('');
    const [notification, setNotification] = useState('');
    const [category, setCategory] = useState(categories[0].name);
    const [tags, setTags] = useState([]);
    const [length, setLength] = useState('');
    const file = useRef<any>(null);
    const [fileInvalid, setFileInvalid] = useState('');
    const artworkRef = useRef<any>(null);
    const progressbarRef = useRef<any>(null);
    const cancelSource = useRef(axios.CancelToken.source());

    useEffect(() => {
        if (props.data !== undefined && props.type === 'edit') {
            setName(props.data.name);
            setDescription(props.data.description);
            setTags(parseTags('string', props.data.tags));
            setLength(props.data.length as string);
            setCategory(props.data.category);
        }
    }, []);

    useImperativeHandle(ref, () => ({
        getData: (): PresetFormData => {
            return {
                name: name,
                description: description,
                tags: parseTags('array', tags),
                length: length,
                notification: notification,
                category: category,
            };
        },

        setTotalDuration: (value: Array<string>): void => {
            setLength(getDurationFormat(calculateTotalLength(value)));
        },

        clearInternalStates: (): void => {
            setName('');
            setDescription('');
            setTags([]);
            setLength('');
            setNotification('');
            setCategory(categories[0].name);
        },

        getInputValidation: async (): Promise<boolean> => {
            let retVal = 0;

            if (name === '') {
                setNameInvalid('This field is mandatory');
                retVal++;
            } else {
            }
            if (description === '') {
                setDescInvalid('This field is mandatory');
                retVal++;
            } else {
                setDescInvalid('');
            }
            if (retVal === 0) {
                return true;
            } else {
                return false;
            }
        },
    }));

    function onCategoryChange(value: string): void {
        const temp = categories.find((c) => c.name === value);
        setCategory(temp!.name);
    }

    function calculateTotalLength(songs: Array<string>): number {
        let seconds = 0;
        let minutes = 0;
        let hours = 0;
        //Extract hours, minutes and seconds
        for (let i = 0; i < songs.length; i++) {
            hours += parseInt(songs[i].slice(0, 2));
            minutes += parseInt(songs[i].slice(3, 5));
            seconds += parseInt(songs[i].slice(6));
        }
        //Calculate total length in seconds
        return hours * 3600 + minutes * 60 + seconds;
    }

    async function onBrowseClick(): Promise<void> {
        const input = document.createElement('input')!;
        input.setAttribute('type', 'file');
        input.setAttribute('multiple', 'true');
        input.setAttribute('accept', 'audio/*');
        input.addEventListener('change', () => {
            if (input.files && input.files.length > 0) {
                const audioFile = input.files[0];
                const audio = new Audio();
                audio.src = URL.createObjectURL(audioFile);
                audio.addEventListener('loadedmetadata', () => {
                    setFileInvalid('');
                    setLength(getDurationFormat(audio.duration));
                    file.current = audioFile;
                });
            }
        });
        input.showPicker();
    }

    function onUploadSaveClick(): void {
        if (props.type === 'create') {
            onUploadClick();
        } else if (props.type === 'edit') {
            onSaveClick();
        }
    }

    async function onSaveClick(): Promise<void> {
        let counter = 0;

        if (name === '') {
            setNameInvalid('This field is mandatory');
            counter++;
        }

        if (description === '') {
            setDescInvalid('This field is mandatory');
            counter++;
        }

        if (counter === 0) {
            const formData = {
                id: props.id!,
                name: name,
                description: description,
                tags: parseTags('array', tags),
                category: category,
            };
            try {
                await editPresetData(formData);
            } catch (error: any) {
                alert(error.message);
            }
        }
    }

    function validateInputs(): boolean {
        let counter = 0;
        const artworkValidation = artworkRef.current.getInputValidation();

        if (name === '') {
            setNameInvalid('This field is mandatory');
            counter++;
        }
        if (description === '') {
            setDescInvalid('This field is mandatory');
            counter++;
        }
        if (file === undefined || file.current === null) {
            setFileInvalid('Please select an audio file');
            counter++;
        }
        if (artworkValidation === false) {
            counter++;
        }

        if (counter === 0) {
            return true;
        } else {
            return false;
        }
    }

    async function registerPresetInDb(): Promise<string> {
        const info = {
            name: name,
            category: category,
            description: description,
            tags: tags,
            length: length,
            likes: 0,
            views: 0,
            favorites: 0,
            reviews: 0,
            uploadDate: '',
        };

        return await uploadPresetInfo(info);
    }

    async function uploadPresetAudio(id: string): Promise<string> {
        const form = new FormData();
        const extension = file.current.name.split('.').pop();
        form.append('id', id);
        form.append('name', name + '.' + extension);
        form.append('file', file.current);

        try {
            const response = await uploadPresetFile(form);

            return response;
        } catch (error: any) {
            throw error;
        }
    }

    async function uploadPresetArtworkFile(id: string): Promise<string> {
        const form = new FormData();
        form.append('id', id);
        form.append('name', 'artworl.jpg');
        form.append('file', artworkRef.current.getData());

        try {
            const response = await uploadPresetArtwork(form);

            return response;
        } catch (error: any) {
            throw error;
        }
    }
    async function onUploadClick(): Promise<void> {
        if (validateInputs()) {
            try {
                let progress = 5;
                progressbarRef.current.enable(true);
                updateProgress(progress, 'info', 'Uploading preset...');
                const id = await registerPresetInDb();
                progress += 5;
                updateProgress(progress, 'success', 'Preset registered in database');
                let response = await uploadPresetAudio(id);
                progress += 70;
                updateProgress(progress, 'success', response);
                response = await uploadPresetArtworkFile(id);
                progress += 10;
                updateProgress(progress, 'success', response);
                updateProgress(100, 'info', 'All preset data uploaded successfully');
                clearStates();
            } catch (error: any) {
                throw error;
                clearStates();
            }
        }
    }

    function onUploadCancelled(): void {
        cancelSource.current.cancel('User cancelled upload');
    }

    function clearStates(): void {
        artworkRef.current.clearInternalStates();
        file.current = null;
        setName('');
        setDescription('');
        setTags([]);
        setLength('');
        setNotification('');
        setCategory(categories[0].name);
    }

    function updateProgress(progress: number, type: string, message: string): void {
        progressbarRef.current.setProgress(progress);
        progressbarRef.current.logMessage(type, message);
    }

    return (
        <div className="preset-form">
            <div className="coverart-div">
                <Artwork
                    ref={artworkRef}
                    type={props.type}
                    className="preset-preview-image"
                    message="Please select a preview image"
                    img={createObjectStoragePath(preauthreq, ['presets', props.id as string, `preview.jpeg`])}
                />
            </div>
            <div className="inputs-div">
                <div className="form-items">
                    <InputGroup hasValidation className="input-group">
                        <InputGroup.Text className="label">Name</InputGroup.Text>
                        <FormControl
                            disabled={props.type === 'edit' ? true : false}
                            className="input"
                            required
                            value={name}
                            onChange={(event: any): void => {
                                setName(event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1));
                                setNameInvalid('');
                            }}
                        />
                    </InputGroup>
                    <p className="invalid-input invalid-name">{nameinvalid}</p>
                    <div className="category-preset">
                        <p>Category</p>
                        <Dropdown
                            items={categories.map((c) => c.name)}
                            className="dropdown-margin"
                            onChange={onCategoryChange}
                            current={category}
                        />
                    </div>
                    <InputGroup hasValidation className="input-group input-group-area">
                        <InputGroup.Text className="label">Description</InputGroup.Text>
                        <FormControl
                            className="input-description"
                            required
                            as="textarea"
                            value={description}
                            onChange={(event): void => {
                                setDescription(event.target.value);
                                setDescInvalid('');
                            }}
                        />
                        <p className="invalid-input invalid-desc">{descInvalid}</p>
                    </InputGroup>
                    <InputGroup hasValidation className="input-group input-group-area">
                        <InputGroup.Text className="label">Tags (optional)</InputGroup.Text>
                        <FormControl
                            className="input-tag"
                            required
                            as="textarea"
                            value={tags}
                            placeholder="#tag1 #tag2 #tag3"
                            onChange={(event): void => setTags(parseTags('array', event.target.value))}
                        />
                    </InputGroup>
                    {props.type === 'create' ? (
                        <InputGroup hasValidation className="input-group input-group-area">
                            <InputGroup.Text className="label">Notification (optional)</InputGroup.Text>
                            <FormControl
                                className="input-notification"
                                required
                                as="textarea"
                                value={notification}
                                onChange={(event): void => setNotification(event.target.value)}
                            />
                        </InputGroup>
                    ) : null}
                    <p className="album-total-duration">Duration: {length}</p>
                </div>
                <div className="form-btns">
                    {props.type === 'create' ? (
                        <button className="browse-btn-preset" onClick={onBrowseClick}>
                            Browse
                        </button>
                    ) : null}
                    <p className="invalid-input-preset">{fileInvalid}</p>
                    <button className="upload-btn-preset" onClick={onUploadSaveClick}>
                        {props.type === 'create' ? 'Upload' : 'Save'}
                    </button>
                </div>
            </div>
            <ProgressbarUpload ref={progressbarRef} abort={onUploadCancelled} />
        </div>
    );
});

export default PresetForm;
