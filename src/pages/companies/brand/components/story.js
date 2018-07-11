import React from 'react';
import { Icon, IconButton } from '@material-ui/core';
import ReactPlayer from 'react-player';
import { compose, withState, withHandlers, pure } from 'recompose';

import AddStory from './addStory';
import { s3BucketURL } from '../../../../constants/s3';



const Story = props => {
    const { editMode, story, index, editStory, storyToEdit, cancelEdit } = props;
    if (editMode && storyToEdit && storyToEdit === story.id) {
        return <AddStory story={story} cancel={cancelEdit} />
    } else {
        let image, video;
        if (story.images && story.images.length > 0) {
            image = `${s3BucketURL}${story.images[0].path}`;
            // image = story.images[0].path;
        }
        if (story.videos && story.videos.length > 0) {
            video = story.videos[0].path;
        }
        return (
            <div className={index % 2 === 0 ? 'story' : 'story reverse'} key={story.id}>
                <div className='media'>
                    {image &&
                        <img src={image} alt={story.id} className='articleImg' />
                    }
                    {(video && !image) &&
                        <ReactPlayer
                            url={video}
                            width='200'
                            height='140'
                            config={{
                                youtube: {
                                    playerVars: {
                                        showinfo: 0,
                                        controls: 0,
                                        modestbranding: 1,
                                        loop: 1
                                    }
                                }
                            }}
                            playing={false} />
                    }
                </div>
                <div className='textContents'>
                    <h4>{story.i18n[0].title}</h4>
                    <p>{story.i18n[0].description}</p>
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