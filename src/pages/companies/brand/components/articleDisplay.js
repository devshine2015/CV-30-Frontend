import React from 'react';
import { Icon, IconButton } from '@material-ui/core';
import ReactPlayer from 'react-player';
import { compose, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { setEditMode, handleArticle, setFeedbackMessage } from '../../../../store/queries';
import { companyRefetch } from '../../../../store/refetch';
import { s3BucketURL } from '../../../../constants/s3';
import { stripHtmlTags } from '../../../../constants/utils';

const ArticleDisplay = props => {
    const { editMode, article, index, editArticle, deleteArticle } = props;
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
                <h4>{article.title}</h4>
                <p>{stripHtmlTags(article.description)}</p>
            </div>
            {editMode &&
                <React.Fragment>
                    <IconButton className='floatingEditBtn' onClick={() => editArticle(article.id)}>
                        <Icon>edit</Icon>
                    </IconButton>
                    <IconButton className='floatingDeleteBtn' onClick={() => deleteArticle(article.id)}>
                        <Icon>close</Icon>
                    </IconButton>
                </React.Fragment>
            }
        </div>
    )

};

const ArticleDisplayHOC = compose(
    withRouter,
    graphql(setEditMode, { name: 'setEditMode' }),
    graphql(handleArticle, { name: 'handleArticle' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withHandlers({
        editArticle: ({ setEditMode, history, match: { params: { lang } } }) => async id => {
            await setEditMode({
                variables: {
                    status: true
                }
            });
            return history.push(`/${lang}/article/${id}`);
        },
        deleteArticle: ({ handleArticle, setFeedbackMessage, match: { params: { companyId, lang: language } } }) => async id => {
            try {
                await handleArticle({
                    variables: {
                        article: {
                            id
                        },
                        options: {
                            articleId: id,
                            companyId: companyId,
                            isMoreStories: false
                        },
                        language
                    },
                    refetchQueries: [
                        companyRefetch(companyId, language)
                    ]
                });
                await setFeedbackMessage({
                    variables: {
                        status: 'success',
                        message: 'Changes saved successfully.'
                    }
                });
            }
            catch (err) {
                console.log(err);
                await setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: err.message
                    }
                });
            }
        }
    }),
    pure
)
export default ArticleDisplayHOC(ArticleDisplay);