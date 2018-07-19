import React from 'react';
import { Tab, Tabs, Modal } from '@material-ui/core';
import { compose, pure, withState, withHandlers } from 'recompose';
import ArticleEditor from './ArticleEditor';
import ArticleList from './ArticleList';

const ArticlePopUp = (props) => {
    const {
        open, onClose,
        activeTab, handleTabChange
    } = props;

    return (
        <Modal
            open={open}
            classes={{
                root: 'modalRoot'
            }}
            onClose={onClose}
        >
            <div className='storyEditPaper'>
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
                    {activeTab === 'new' && <ArticleEditor {...props} />}
                </div>
            </div>
        </Modal>
    );
}


const ArticlePopUpHOC = compose(
    withState('activeTab', 'setActiveTab', 'new'),
    withHandlers({
        handleTabChange: ({ setActiveTab }) => (event, value) => {
            setActiveTab(value);
        }
    }),
    pure
);

export default ArticlePopUpHOC(ArticlePopUp);