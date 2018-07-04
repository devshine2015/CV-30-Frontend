import React from 'react';
import { Tab, Tabs, Button } from '@material-ui/core';
import { compose, pure, withState, withHandlers } from 'recompose';
import ArticleEditor from './ArticleEditor';
import ArticleList from './ArticleList';

const ArticlePopUp = (props) => {
    const {
        anchor, onClose,
        activeTab, handleTabChange,
        open, toggleOpen
    } = props;
    if (!open)
        return (
            <div className='addArticle'>
                <Button className='addArticleButton' onClick={toggleOpen}>
                    + Add Article
                </Button>
            </div>
        );
    else {
        return (
            <div className='storyEditPaperInline'>
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
                        fullWidth
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
                    {activeTab === 'new' && <ArticleEditor {...props} />}
                </div>
            </div>
        );
    }
}


const ArticlePopUpHOC = compose(
    withState('activeTab', 'setActiveTab', 'existing'),
    withState('open', 'setIsOpen', false),
    withHandlers({
        handleTabChange: ({ setActiveTab }) => (event, value) => {
            setActiveTab(value);
        },
        toggleOpen: ({ open, setIsOpen }) => () => {
            setIsOpen(!open);
        }
    }),
    pure
);

export default ArticlePopUpHOC(ArticlePopUp);