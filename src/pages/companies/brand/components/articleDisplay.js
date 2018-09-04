import React from 'react';
import { Icon, IconButton } from '@material-ui/core';
import ReactPlayer from 'react-player';
import { compose, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { setEditMode } from '../../../../store/queries';
import { s3BucketURL } from '../../../../constants/s3';
import { stripHtmlTags } from '../../../../constants/utils';

const ArticleDisplay = props => {
    const { editMode, article, index, editArticle } = props;
    let image, video;

    if (article.images && article.images.length > 0)
        image = `${s3BucketURL}${article.images[0].path}`;

    if (article.videos && article.videos.length > 0)
        video = article.videos[0].path;

    return (
        <div className={index % 2 === 0 ? 'story' : 'story reverse'} key={article.id}>
            <div className='media'>
                {image &&
                    <img src={image} alt={article.id} className='articleImg' />
                }
                {(video && !image) &&
                    <ReactPlayer
                        url={video}
                        width='600px'
                        height='360px'
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
                <h4>{article.i18n[0].title}</h4>
                <p>{stripHtmlTags(article.i18n[0].description)}</p>
            </div>
            {editMode &&
                <IconButton className='floatingEditBtn' onClick={() => editArticle(article.id)}>
                    <Icon>edit</Icon>
                </IconButton>
            }
        </div>
    )

};

const ArticleDisplayHOC = compose(
    withRouter,
    graphql(setEditMode, { name: 'setEditMode' }),
    withHandlers({
        editArticle: ({ setEditMode, history, match: { params: { lang } } }) => async id => {
            await setEditMode({
                variables: {
                    status: true
                }
            });
            return history.push(`/${lang}/article/${id}`);
        }
    }),
    pure
)
export default ArticleDisplayHOC(ArticleDisplay);