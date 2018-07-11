import React from 'react';
import { compose, pure, withState, withHandlers } from 'recompose';
import { Button, TextField, Switch as ToggleSwitch, FormLabel, FormGroup, IconButton, Icon } from '@material-ui/core';
import uuid from 'uuidv4';

import { companyQuery } from '../../../../store/queries';

const AddStory = props => {
    const { popupOpen, toggleEditor, formData, handleFormChange, isVideoUrl, switchMediaType, story, saveChanges, cancel } = props;
    const { title, description, videoURL } = formData;
    return (
        <div className='addStoryWrapper'>
            {!story &&
                <span className='addStoryBtn' onClick={toggleEditor}>
                    + Add
            </span>
            }
            <div className={(popupOpen || story) ? 'newStoryForm open' : 'newStoryForm'}>
                <form noValidate autoComplete='off'>
                    <h4>Add article</h4>
                    <section className='infoSection'>
                        <TextField
                            name="title"
                            label="Article title"
                            placeholder="Title..."
                            className='textField'
                            fullWidth
                            onChange={handleFormChange}
                            value={title}
                        />
                        <TextField
                            name="description"
                            label="Article body"
                            placeholder="Article body..."
                            className='textField'
                            multiline
                            rows={1}
                            rowsMax={10}
                            fullWidth
                            onChange={handleFormChange}
                            value={description}
                        />
                        <FormGroup row className='mediaToggle'>
                            <span className='mediaToggleLabel'>Upload visuals</span>
                            <FormLabel className={!isVideoUrl ? 'active' : ''}>Photo</FormLabel>
                            <ToggleSwitch
                                checked={isVideoUrl}
                                onChange={switchMediaType}
                                classes={{
                                    switchBase: 'colorSwitchBase',
                                    checked: 'colorChecked',
                                    bar: 'colorBar',
                                }}
                                color="primary" />
                            <FormLabel className={isVideoUrl ? 'active' : ''}>Video Url</FormLabel>
                        </FormGroup>

                    </section>
                    <section className='mediaUpload'>
                        {isVideoUrl ?
                            <TextField
                                name="videoURL"
                                label="Add video URL"
                                placeholder="Video URL..."
                                fullWidth
                                className='textField'
                                onChange={handleFormChange}
                                value={videoURL}
                            /> :
                            <label htmlFor="fileUpload">
                                <input
                                    accept="image/*"
                                    className='hiddenInput'
                                    id="fileUpload"
                                    name="fileUpload"
                                    multiple
                                    type="file"
                                    onChange={handleFormChange}
                                />
                                <Button component="span" className='uploadBtn'>
                                    Upload
                                </Button>
                            </label>
                        }
                    </section>
                    <section className='footer'>
                        <IconButton className='cancelBtn' onClick={cancel}>
                            <Icon>close</Icon>
                        </IconButton>
                        <IconButton className='submitBtn' onClick={saveChanges}>
                            <Icon>done</Icon>
                        </IconButton>
                    </section>
                </form>
            </div>
        </div>
    )
};

const AddStoryHOC = compose(
    withState('popupOpen', 'setPopupOpen', false),
    withState('formData', 'setFormData', ({ story }) => (story || { id: uuid() })),
    withState('isVideoUrl', 'changeMediaType', true),
    withHandlers({
        toggleEditor: ({ popupOpen, setPopupOpen }) => () => {
            setPopupOpen(!popupOpen);
        },
        closeEditor: ({ setPopupOpen }) => () => {
            setPopupOpen(false);
        },
        handleFormChange: props => event => {
            const target = event.currentTarget;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;
            if (!name) {
                throw Error('Field must have a name attribute!');
            }
            props.setFormData(state => ({ ...state, [name]: value }));
        },
        switchMediaType: ({ isVideoUrl, changeMediaType }) => () => {
            changeMediaType(!isVideoUrl);
        },
        saveChanges: ({ handleArticle, match, formData, type }) => async () => {
            try {
                await handleArticle({
                    variables: {
                        article: formData,
                        options: {
                            companyId: match.params.companyId,
                            isAtOffice: type === 'company_officeLife',
                            isMoreStories: type === 'company_moreStories'
                        },
                        language: match.params.lang,

                    },
                    refetchQueries: [{
                        query: companyQuery,
                        fetchPolicy: 'network-only',
                        name: 'companyQuery',
                        variables: {
                            language: match.params.lang,
                            id: match.params.companyId
                        }
                    }]
                });
            }
            catch (err) {
                console.log(err)
            }
        },
    }),
    pure
);

export default AddStoryHOC(AddStory);