import React from 'react';
import { FormGroup, FormLabel, Switch as ToggleSwitch } from '@material-ui/core';
import Edit from './components/edit';
import Show from './components/show';
import Loader from '../../components/Loader';

const Article = props => {
    const {
        editMode, switchEditMode,
        getArticle: { loading, article: { author: { id: authorId } } },
        currentUser: { auth: { currentUser: { id: userId } } }
    } = props;

    if (loading)
        return <Loader />

    return (
        <div className='articleRoot'>
            {(authorId === userId) &&
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
            }
            {editMode ? <Edit {...props} /> : <Show {...props} />}
        </div>
    );
};

export default Article;