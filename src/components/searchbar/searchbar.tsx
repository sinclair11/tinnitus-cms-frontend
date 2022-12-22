import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { Icons } from '@utils/icons';
import { dialogStyles } from '@src/styles/styles';
import Modal from 'react-modal';
import { MessageBox } from '@src/components/messagebox/messagebox';
import { useNavigate } from 'react-router-dom';
import { albumSearchByPattern } from '@services/album-services';
import { Endpoints } from '@src/constants';
import { sampleSearchByPattern } from '@services/sample-services';
import { presetSearchByPattern } from '@services/preset-services';

type SearchProps = {
    type: string;
    pathToSearch: string;
    navigate: string;
};

const SearchBar = forwardRef((props: SearchProps, ref?: any) => {
    const navigate = useNavigate();
    const [searchVal, setSearchVal] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [selected, setSelected] = useState({ name: '' });
    const [searchedResources, setSearchedResources] = useState<any[]>([]);

    useEffect(() => {
        if (selected !== null && selected.name != searchVal) {
            getResourceData();
        } else {
            document.getElementById('searchbar-results')!.style.display = 'none';
        }
    }, [searchVal]);

    useImperativeHandle(ref, () => ({
        setSearchValue: (value: string): void => {
            setSearchVal(value);
        },
    }));

    async function getResourceData(): Promise<void> {
        if (searchVal != '') {
            try {
                let resources: string | React.SetStateAction<any[]> = [];
                let artworkPath = '';

                switch (props.type) {
                    case 'album': {
                        resources = await albumSearchByPattern(searchVal);
                        artworkPath = Endpoints.API_ALBUM_GET_ARTWORK;
                        break;
                    }
                    case 'preset': {
                        resources = await presetSearchByPattern(searchVal);
                        artworkPath = Endpoints.API_PRESET_GET_ARTWORK;
                        break;
                    }
                    case 'sample': {
                        resources = await sampleSearchByPattern(searchVal);
                        artworkPath = Endpoints.API_SAMPLE_GET_ARTWORK;
                        break;
                    }
                    default:
                        break;
                }

                for (const resource of resources) {
                    resource.artwork = `${artworkPath}/${resource.id}/artwork.jpg`;
                }
                setSearchedResources(resources);
                if (resources.length > 0) {
                    //Show search results
                    document.getElementById('searchbar-results')!.style.display = 'flex';
                } else {
                    //No results found
                    document.getElementById('searchbar-results')!.style.display = 'none';
                }
            } catch (error: any) {
                //Notify user about error
                setMessage(error.message);
                setDialogOpen(true);
            }
        } else {
            //No input given
            document.getElementById('searchbar-results')!.style.display = 'none';
            setSearchedResources([]);
        }
    }

    function onItemClick(id: string): void {
        setSearchVal(id);
        if (searchedResources.length > 0) {
            //Get selected album from search results
            document.getElementById('searchbar-results')!.style.display = 'none';
            setSearchVal('');
            navigate(`${props.navigate}${id}`);
            // navigate(0);
        }
    }

    async function onSearchBtnClick(): Promise<void> {
        await getResourceData();
        if (searchedResources.length > 0) {
            //Get selected album from given input
            const selectedItem = searchedResources.find((item) => item.name === searchVal);
            document.getElementById('searchbar-results')!.style.display = 'none';
            if (selectedItem !== undefined) {
                setSelected(selectedItem);
                setSearchVal('');
                navigate(`${props.navigate}${selectedItem.id}`);
            }
        }
    }

    return (
        <InputGroup className="SearchGroup">
            <div className="searchbar-div">
                <FormControl
                    id="searchbar-items"
                    placeholder={`Search ${props.type}...`}
                    autoComplete="off"
                    autoCapitalize="on"
                    autoCorrect="off"
                    aria-label={`${props.type}`}
                    aria-describedby="basic-addon2"
                    className="SearchBar"
                    value={searchVal}
                    onChange={(event: any): void => {
                        setSearchVal(event.target.value);
                    }}
                />
                <div id="searchbar-results">
                    {searchedResources.map((resource: any, key: number) => (
                        <div
                            className="searchbar-result-item"
                            key={key}
                            onClick={(): void => onItemClick(resource.id)}
                            id={resource.id}
                        >
                            <img src={resource.artwork} />
                            <p className="item-name">{resource.name}</p>
                            <p className="item-upload-date">
                                {new Date(Date.parse(resource.uploadDate)).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <Button className="SearchButton" onClick={onSearchBtnClick}>
                <img src={Icons['MagnifierIcon']} className="SearchIcon"></img>
            </Button>
            <Modal style={dialogStyles} isOpen={dialogOpen} ariaHideApp={false}>
                <MessageBox setIsOpen={setDialogOpen} message={message} />
            </Modal>
        </InputGroup>
    );
});

export default SearchBar;
