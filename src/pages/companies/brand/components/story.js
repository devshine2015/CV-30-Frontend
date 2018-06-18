import React from 'react';
import { Icon, IconButton } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import AddStory from './addStory';


const Story = props => {
    const { editMode, story, index, editStory, storyToEdit, cancelEdit } = props;
    if (editMode && storyToEdit && storyToEdit === story.id) {
        return <AddStory story={story} cancel={cancelEdit} />
    } else {
        return (
            <div className={index % 2 === 0 ? 'story' : 'story reverse'} key={story.id}>
                <img src={story.img} alt={story.title} />
                <div className='textContents'>
                    <h4>{story.title}</h4>
                    <p>{story.text}</p>
                </div>
                {editMode &&
                    <IconButton className='floatingEditBtn' onClick={() => editStory(story)}>
                        <Icon>edit</Icon>
                    </IconButton>
                }
            </div>
        )
    }
}

const StoryHOC = compose(
    withState('storyToEdit', 'setStoryToEdit', null),
    withHandlers({
        editStory: ({ setStoryToEdit }) => story => {
            setStoryToEdit(story.id);
        },
        cancelEdit: ({ setStoryToEdit }) => () => {
            setStoryToEdit(null);
        }
    }),
    pure
)
export default StoryHOC(Story);