import React from 'react';
import { Popover, Button, TextField, Switch as ToggleSwitch, IconButton, Icon, FormLabel, Tab, Tabs, Grid, FormGroup } from '@material-ui/core';
import { compose, pure, withState, withHandlers } from 'recompose';






const StoryEditor = (props) => {
    const {
        anchor, onClose,
        activeTab, handleTabChange,
        stories
    } = props;

    // return (
    //     <Popover
    //         anchorOrigin={{
    //             vertical: 'bottom',
    //             horizontal: 'center',
    //         }}
    //         transformOrigin={{
    //             vertical: 'top',
    //             horizontal: 'right',
    //         }}
    //         open={Boolean(anchor)}
    //         anchorEl={anchor}
    //         onClose={onClose}
    //         classes={{
    //             paper: 'storyEditPaper'
    //         }}
    //     >
    //         <div className='popupHeader'>
    //             <h4>Add a story</h4>
    //             <p>
    //                 Lorem ipsum dolor sit amet, his fastidii phaedrum disputando ut, vis eu omnis intellegam, at duis voluptua signiferumque pro.
    //             </p>
    //             <Tabs
    //                 value={activeTab}
    //                 onChange={handleTabChange}
    //                 classes={{
    //                     root: 'tabsContainer',
    //                     flexContainer: 'tabsFlexContainer',
    //                     indicator: 'tabIndicator'
    //                 }}
    //             >
    //                 <Tab
    //                     label="Choose an existing article"
    //                     value='existing'
    //                     classes={{
    //                         root: 'tabItemRoot',
    //                         selected: 'tabItemSelected',
    //                         wrapper: 'tabItemWrapper',
    //                         label: 'tabItemLabel',
    //                         labelContainer: 'tabItemLabelContainer'
    //                     }}
    //                 />
    //                 <span className='tabOr'> OR </span>
    //                 <Tab
    //                     label="Create a new article"
    //                     value='new'
    //                     classes={{
    //                         root: 'tabItemRoot',
    //                         selected: 'selected',
    //                         wrapper: 'tabItemWrapper',
    //                         label: 'tabItemLabel',
    //                         labelContainer: 'tabItemLabelContainer'
    //                     }}
    //                 />
    //             </Tabs>
    //         </div>
    //         <div className='popupBody'>
    //             {activeTab === 'existing' && <StoryBrowser stories={stories} />}
    //             {activeTab === 'new' && <NewStory {...props} />}
    //         </div>

    //         {
    //             activeTab === 'new' &&
    //             <div className='popupFooter'>
    //                 <section className='editControls'>
    //                     <IconButton className='cancelBtn' onClick={onClose}>
    //                         <Icon>close</Icon>
    //                     </IconButton>
    //                     <IconButton className='submitBtn'>
    //                         <Icon>done</Icon>
    //                     </IconButton>
    //                 </section>
    //             </div>
    //         }
    //     </Popover>
    // );
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