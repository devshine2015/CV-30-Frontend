import React from 'react';
import { Popover, Tab, Tabs, } from '@material-ui/core';
import { compose, pure, withState, withHandlers } from 'recompose';
import NewArticle from './NewArticle';
import ArticleList from './ArticleList';

const StoryEditor = (props) => {
    const {
        anchor, onClose,
        activeTab, handleTabChange
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
                {activeTab === 'existing' && <ArticleList {...props} />}
                {activeTab === 'new' && <NewArticle {...props} />}
            </div>
        </Popover>
    );
}


const StoryEditorHOC = compose(
    withState('activeTab', 'setActiveTab', 'new'),
    withHandlers({
        handleTabChange: ({ setActiveTab }) => (event, value) => {
            setActiveTab(value);
        }
    }),
    pure
);

export default StoryEditorHOC(StoryEditor);