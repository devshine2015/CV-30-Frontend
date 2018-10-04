import React from 'react';
import { Modal, Tabs, Tab } from '@material-ui/core';
import { compose, pure, withHandlers, withState } from 'recompose';
import { FormattedMessage } from 'react-intl'
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
                    <FormattedMessage id="company.team.addTeamMember" defaultMessage="Add team member" description="Add team member">
                        {(text) => (
                            <h4>{text}</h4>
                        )}
                    </FormattedMessage>
                    <FormattedMessage id="company.team.memberPara" defaultMessage="" description="Company Team Member Paragraph">
                        {(text) => (
                            <p>
                                {text}
                            </p>
                        )}
                    </FormattedMessage>
                    <FormattedMessage id="company.team.tabs" defaultMessage="Choose an existing profile\n OR \nCreate a new profile" description="Company Profile Tabs">
                        {(text) => (
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
                                    label={text.split("\n")[0]}
                                    value='existing'
                                    classes={{
                                        root: 'tabItemRoot',
                                        selected: 'tabItemSelected',
                                        wrapper: 'tabItemWrapper',
                                        label: 'tabItemLabel',
                                        labelContainer: 'tabItemLabelContainer'
                                    }}
                                />
                                <Tab disabled label={text.split("\n")[1]} />
                                <Tab
                                    label={text.split("\n")[2]}
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
                        )}
                    </FormattedMessage>
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