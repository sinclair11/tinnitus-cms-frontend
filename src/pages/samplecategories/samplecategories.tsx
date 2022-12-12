import Sidebar from '@components/sidebar/sidebar';
import React, { useEffect, useRef, useState } from 'react';
import { Icons, ToolbarIcons } from '@src/utils/icons';
import { useSelector, useDispatch } from 'react-redux';
import { CombinedStates } from '@store/reducers/custom';
import Modal from 'react-modal';
import { categoryStyles } from '@src/styles/styles';
import { InputGroup, FormControl } from 'react-bootstrap';
import { SketchPicker } from 'react-color';
import { insertCategory, updateCategory, deleteCategory, getCategories } from '@services/categories-services';
import Artwork from '@components/artwork/artwork';
import { Category } from '@src/types/general';
import { createObjectStoragePath } from '@src/utils/helpers';
import { useNavigate } from 'react-router-dom';
import { routes } from '@src/router/routes';

const PresetCategories: React.FC = () => {
    const dispatch = useDispatch();
    const categories = useSelector<CombinedStates>((state) => state.sampleReducer.categories) as Category[];
    const preauthreq = useSelector<CombinedStates>((state) => state.ociReducer.config.prereq) as string;
    const [addCategoryModal, setAddCategoryModal] = useState(false);
    const [name, setName] = useState('');
    const [nameInvalid, setNameInvalid] = useState('');
    const [description, setDescription] = useState('');
    const [descInvalid, setDescInvalid] = useState('');
    const [colorPicker, setColorPicker] = useState(false);
    const [color, setColor] = useState('#FFFFFF');
    const [type, setType] = useState('Add');
    const currentIt = useRef(0);
    const [inputDisabled, setInputDisabled] = useState(false);
    const [modalType, setModalType] = useState('create');
    const artworkRef = useRef<any>(null);
    const [categoryImg, setCategoryImg] = useState('');
    const navigate = useNavigate();
    const auth = useSelector<CombinedStates>((state) => state.generalReducer.auth) as any;

    useEffect(() => {
        if (auth != '') {
            //Continue in page
        } else {
            navigate(routes.LOGIN);
        }
    }, [auth]);

    function onPlusClick(): void {
        setInputDisabled(false);
        setType('Add');
        setModalType('create');
        setAddCategoryModal(true);
    }

    function onModalClose(): void {
        setName('');
        setDescription('');
        setNameInvalid('');
        setDescInvalid('');
        setColor('#FFFFFF');
        setColorPicker(false);
        setAddCategoryModal(false);
    }

    function onColorChange(color: any): void {
        setColor(color.hex);
    }

    function onCategoryEdit(it: number): void {
        setName(categories[it].name);
        setDescription(categories[it].description);
        setColor(categories[it].color);
        currentIt.current = it;
        setInputDisabled(true);
        setType('Edit');
        const preview = createObjectStoragePath(preauthreq, ['categories', `${categories[it].id}.jpg`]);
        setCategoryImg(preview);
        setModalType('edit');
        setAddCategoryModal(true);
    }

    async function addNewCategory(): Promise<void> {
        try {
            const form = new FormData();
            form.append('name', name);
            form.append('description', description);
            form.append('color', color);
            form.append('type', 'sample');
            form.append('file', artworkRef.current.getData(), 'artwork.jpg');

            const response = await insertCategory(auth, form);
            onModalClose();

            updateView();
            alert(response);
        } catch (error: any) {
            alert(error);
        }
    }

    async function uploadChanges(category: Category): Promise<void> {
        try {
            const response = await updateCategory(auth, {
                name: category.name,
                id: category.id,
                description: description,
                color: color,
                type: 'sample',
            });
            onModalClose();
            alert(response);
            await updateView();
        } catch (error: any) {
            alert(error);
        }
    }

    async function onAddCategory(): Promise<void> {
        let counter = 0;

        if (type === 'Add') {
            if (artworkRef.current.getInputValidation() === false) {
                counter++;
            }
        }
        if (name === '') {
            setNameInvalid('This field is mandatory');
            counter++;
        } else if (categories.find((x: any) => x.name === name) !== undefined) {
            if (type === 'Add') {
                setNameInvalid('Category already exists');
                counter++;
            }
        }
        if (description === '') {
            setDescInvalid('This field is mandatory');
            counter++;
        }

        if (counter === 0) {
            if (type === 'Add') {
                await addNewCategory();
            } else if (type === 'Edit') {
                await uploadChanges(categories[currentIt.current]);
            }
        }
    }

    async function onCategoryDelete(it: number): Promise<void> {
        try {
            const response = await deleteCategory(auth, categories[it].id);
            alert(response);
            await updateView();
        } catch (error: any) {
            alert(error);
        }
    }

    async function updateView(): Promise<void> {
        const categories = await getCategories(auth, 'sample');

        dispatch({
            type: 'sample/categories',
            payload: categories,
        });
    }

    return (
        <div className="page" id="page-upload-edit">
            <Sidebar />
            <div className="page-content">
                <h2 className="page-title">Sample categories</h2>
                <div className="categories-section">
                    <table className="table" id="categories-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>
                                    <img src={Icons.Palette} />
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories !== undefined &&
                                categories.map((row: any, i: number) => {
                                    return (
                                        <tr key={`${i}`} id={`${i}`}>
                                            <td>{i + 1}</td>
                                            <td>
                                                <p>{row.name}</p>
                                            </td>
                                            <td>
                                                <p>{row.description}</p>
                                            </td>
                                            <td>
                                                <div
                                                    className="color-table-btn"
                                                    style={{ background: row.color, cursor: 'default' }}
                                                />
                                            </td>
                                            <td>
                                                <img
                                                    src={Icons.DeleteRow}
                                                    onClick={(): Promise<void> => onCategoryDelete(i)}
                                                />
                                                <img
                                                    src={ToolbarIcons.EditIcon}
                                                    onClick={(): void => onCategoryEdit(i)}
                                                    style={{ marginLeft: '10px' }}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                    <div className="plus-body" onClick={onPlusClick}>
                        <img src={Icons.Plus} className="plus" />
                    </div>
                </div>
            </div>
            <Modal
                isOpen={addCategoryModal}
                onRequestClose={onModalClose}
                style={categoryStyles}
                ariaHideApp={false}
                shouldCloseOnOverlayClick={true}
                shouldCloseOnEsc={true}
                shouldReturnFocusAfterClose={true}
                contentLabel="Add category"
            >
                <p className="modal-title">Album categories</p>
                <img src={Icons['CancelIcon']} className="cancel-icon" onClick={onModalClose} />
                <div className="categories-wrapper">
                    <div className="category-image-div">
                        <Artwork
                            ref={artworkRef}
                            type={modalType}
                            className="category-image"
                            message="Please select an image for category"
                            img={categoryImg}
                        />
                    </div>
                    <div className="categories-modal-form">
                        <InputGroup hasValidation className="input-group input-group-area">
                            <InputGroup.Text className="label">Name</InputGroup.Text>
                            <FormControl
                                className="input"
                                disabled={inputDisabled}
                                required
                                value={name}
                                onChange={(event: any): void => {
                                    setName(event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1));
                                    setNameInvalid('');
                                }}
                            />
                            <p className="invalid-input invalid-name">{nameInvalid}</p>
                        </InputGroup>
                        <div className="color-group">
                            <InputGroup.Text className="label">Color</InputGroup.Text>
                            <div
                                className="color-picker-btn"
                                onClick={(): void => setColorPicker(!colorPicker)}
                                style={{ background: color }}
                            />
                            {colorPicker && (
                                <SketchPicker
                                    className="color-picker"
                                    color={color}
                                    onChange={onColorChange}
                                    width={'160px'}
                                />
                            )}
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
                    </div>
                    <button
                        className="category-add-btn"
                        onClick={(): void => {
                            onAddCategory();
                        }}
                    >
                        {type}
                    </button>
                    <button className="category-close-btn" onClick={onModalClose}>
                        Close
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default PresetCategories;
