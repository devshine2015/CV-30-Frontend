import React from 'react';
import { Popover, Button, TextField, Switch as ToggleSwitch, IconButton, Icon, FormLabel, Tab, Tabs, Grid, FormGroup } from '@material-ui/core';
import { compose, pure, withState, withHandlers } from 'recompose';


const StoryBrowser = ({ stories }) => (
    <div className='storiesContainer'>
        {
            stories && stories.map((story, index) => (
                <Grid container className='storyItem' onClick={() => console.log(story.title)}>
                    <Grid item sm={12} md={3} className='media'>
                        <img src={story.imgUrl} alt={story.title} />
                    </Grid>
                    <Grid item sm={12} md={9} className='texts'>
                        <h4>{story.title}</h4>
                        <p>
                            {story.text}
                        </p>
                    </Grid>
                </Grid>
            ))
        }
    </div>
)

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
}

const StoryEditor = (props) => {
    const {
        anchor, onClose,
        activeTab, handleTabChange,
        stories
    } = props;

    return (
        <Popover
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={Boolean(anchor)}
            anchorEl={anchor}
            onClose={onClose}
            classes={{
                paper: 'storyEditPaper'
            }}
        >
            <div className='popupHeader'>
                <h4>Add a story</h4>
                <p>
                    Lorem ipsum dolor sit amet, his fastidii phaedrum disputando ut, vis eu omnis intellegam, at duis voluptua signiferumque pro.
                </p>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    classes={{
                        root: 'tabsContainer',
                        flexContainer: 'tabsFlexContainer',
                        indicator: 'tabIndicator'
                    }}
                >
                    <Tab
                        label="Choose an existing article"
                        value='existing'
                        classes={{
                            root: 'tabItemRoot',
                            selected: 'tabItemSelected',
                            wrapper: 'tabItemWrapper',
                            label: 'tabItemLabel',
                            labelContainer: 'tabItemLabelContainer'
                        }}
                    />
                    <span className='tabOr'> OR </span>
                    <Tab
                        label="Create a new article"
                        value='new'
                        classes={{
                            root: 'tabItemRoot',
                            selected: 'selected',
                            wrapper: 'tabItemWrapper',
                            label: 'tabItemLabel',
                            labelContainer: 'tabItemLabelContainer'
                        }}
                    />
                </Tabs>
            </div>
            <div className='popupBody'>
                {activeTab === 'existing' && <StoryBrowser stories={stories} />}
                {activeTab === 'new' && <NewStory {...props} />}
            </div>

            {
                activeTab === 'new' &&
                <div className='popupFooter'>
                    <section className='editControls'>
                        <IconButton className='cancelBtn' onClick={onClose}>
                            <Icon>close</Icon>
                        </IconButton>
                        <IconButton className='submitBtn'>
                            <Icon>done</Icon>
                        </IconButton>
                    </section>
                </div>
            }
        </Popover>
    );
}


const StoryEditorHOC = compose(
    withState('activeTab', 'setActiveTab', 'new'),
    withState('formData', 'setFormData', {}),
    withState('isVideoUrl', 'changeMediaType', true),
    withHandlers({
        handleTabChange: ({ setActiveTab }) => (event, value) => {
            setActiveTab(value);
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

    }),
    pure
);

export default StoryEditorHOC(StoryEditor);