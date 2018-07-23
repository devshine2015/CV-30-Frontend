import React from 'react';
import { Grid, Hidden, IconButton, Icon, Button, FormGroup, FormLabel, Switch as ToggleSwitch } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';

// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';

import ColorPicker from './colorPicker';

const HeaderHOC = compose(
    withState('headline', 'setHeadline', props => 'Test headline'),
    withState('colorPickerAnchor', 'setColorPickerAnchor', null),
    withState('forceCoverRender', 'setForceCoverRender', 0),
    withHandlers({
        toggleColorPicker: ({ setColorPickerAnchor }) => (event) => {
            setColorPickerAnchor(event.target);
        },
        closeColorPicker: ({ setColorPickerAnchor }) => () => {
            setColorPickerAnchor(null);
        },
        updateHeadline: ({ setHeadline }) => text => {
            setHeadline(text)
        },
        submitHeadline: ({ headline }) => () => {
            console.log(headline);
        }
    }),
    pure
);

const Header = props => {
    const {
        editMode, switchEditMode,
        headline, updateHeadline, submitHeadline,
        toggleColorPicker, closeColorPicker, colorPickerAnchor, refetchBgImage
    } = props;
    return (
        <div className='header'>
            <FormGroup row className='editToggle'>
                <FormLabel className={!editMode ? 'active' : ''}>View</FormLabel>
                <ToggleSwitch checked={editMode} onChange={switchEditMode}
                    classes={{
                        switchBase: 'colorSwitchBase',
                        checked: 'colorChecked',
                        bar: 'colorBar',
                    }}
                    color="primary" />
                <FormLabel className={editMode ? 'active' : ''}>Edit</FormLabel>
            </FormGroup>
            {
                editMode &&
                <React.Fragment>
                    <Button size='small' className='colorPickerButton' disableRipple onClick={toggleColorPicker}>
                        <span className='text'>Change Background</span>
                        <Icon className='icon'>brush</Icon>
                    </Button>
                    <ColorPicker
                        colorPickerAnchor={colorPickerAnchor}
                        onClose={closeColorPicker}
                        refetchBgImage={refetchBgImage}
                        type='landing_page'
                    />
                </React.Fragment>
            }
            <Grid container className='headlineContainer'>
                <Grid item md={5} sm={12} xs={12}>
                    {
                        editMode ?
                            <div className='editorWrapper'>
                                <FroalaEditor
                                    config={{
                                        placeholderText: 'This is where the company headline should be',
                                        iconsTemplate: 'font_awesome_5',
                                        toolbarInline: true,
                                        charCounterCount: false,
                                        toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontFamily', 'fontSize', 'color', '-', 'paragraphFormat', 'align', 'formatOL', 'indent', 'outdent', '-', 'undo', 'redo']
                                    }}
                                    model={headline}
                                    onModelChange={updateHeadline}
                                />
                                <IconButton className='submitBtn' onClick={submitHeadline}>
                                    <Icon>done</Icon>
                                </IconButton>
                            </div>
                            : <span dangerouslySetInnerHTML={{ __html: headline }} />
                    }
                </Grid>
                <Hidden mdDown>
                    <Grid item md={5} sm={12} xs={12}></Grid>
                </Hidden>
            </Grid>
        </div>
    );
};

export default HeaderHOC(Header);