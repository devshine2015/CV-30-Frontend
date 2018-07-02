import React from 'react';
import { Button, TextField, Switch as ToggleSwitch, FormLabel, FormGroup } from '@material-ui/core';


const NewStory = (props) => {
    const { handleFormChange, isVideoUrl, switchMediaType, formData } = props;
    const { title, text, videoURL } = formData;

    return (
        <form className='newStoryForm' noValidate autoComplete='off'>
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
                    name="text"
                    label="Article body"
                    placeholder="Article body..."
                    className='textField'
                    multiline
                    rows={4}
                    maxRows={10}
                    fullWidth
                    onChange={handleFormChange}
                    value={text}
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
        </form>
    );
};

export default NewStory;