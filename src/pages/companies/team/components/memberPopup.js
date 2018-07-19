import React from 'react';
import { Modal, Tabs, Tab } from '@material-ui/core';
import { compose, pure, withHandlers, withState } from 'recompose';

import ProfilesList from './profilesList';
import NewProfile from './newProfile';

const TeamMembers = (props) => {
    const { open, onClose, activeTab, handleTabChange } = props;

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
                    <h4>Add team member</h4>
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
                            label="Choose an existing profile"
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
                            label="Create a new profile"
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
                    {activeTab === 'existing' && <ProfilesList {...props} />}
                    {activeTab === 'new' && <NewProfile {...props} />}
                </div>
            </div>
        </Modal>
    );
}


const TeamMembersHOC = compose(
    withState('activeTab', 'setActiveTab', 'existing'),
    withHandlers({
        handleTabChange: ({ setActiveTab }) => (event, value) => {
            setActiveTab(value);
        }
    }),
    pure
);

export default TeamMembersHOC(TeamMembers);