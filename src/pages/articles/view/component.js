import React from 'react';

import Edit from './components/edit';
import Show from './components/show';
import Loader from '../../../components/Loader';
import EditToggle from '../../../components/EditToggle';

const Article = props => {
    const {
        getEditMode: { editMode: { status: editMode } },
        getArticle: { article },
        currentUser: { loading: currentUserLoading, auth: { currentUser } }
    } = props;

    if (!article || currentUserLoading)
        return <Loader />

    const { author: { id: authorId } } = article || {};
    const { id: userId } = currentUser || {};

    return (
        <div className='articleRoot'>
            {(authorId === userId) &&
                <EditToggle />
            }
            {editMode ? <Edit {...props} /> : <Show {...props} />}
        </div>
    );
};

export default Article;