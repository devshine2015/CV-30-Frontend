import React from 'react';
import { Grid, Modal/*, Icon, IconButton*/ } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { Link, withRouter } from 'react-router-dom';
import { compose, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import ReactPlayer from 'react-player';

import { s3BucketURL } from '../constants/s3';
import { getArticles, handleArticle, setFeedbackMessage } from '../store/queries';
import { currentProfileRefetch, companyRefetch, teamRefetch } from '../store/refetch';
import Loader from './Loader';

const ArticlePopUpHOC = compose(
    withRouter,
    graphql(getArticles, {
        name: 'getArticles',
        options: (props) => ({
            variables: {
                language: props.match.params.lang
            },
            fetchPolicy: 'network-only'
        }),
    }),
    graphql(handleArticle, { name: 'handleArticle' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withHandlers({
        updateArticle: ({ match: { params: { lang, companyId, teamId } }, type, handleArticle, onClose, setFeedbackMessage }) => async articleId => {
            let article = {};
            let options = {};
            let refetchQuery = {};

            switch (type) {
                case 'profile_isFeatured':
                    article.isFeatured = true;
                    article.id = articleId;
                    refetchQuery = currentProfileRefetch(lang);
                    break;
                case 'profile_isAboutMe':
                    article.isAboutMe = true;
                    article.id = articleId;
                    refetchQuery = currentProfileRefetch(lang);
                    break;
                case 'company_featured':
                    options = {
                        articleId,
                        companyId,
                        isFeatured: true
                    };
                    refetchQuery = companyRefetch(companyId, lang);
                    break;
                case 'company_officeLife':
                    options = {
                        articleId,
                        companyId,
                        isAtOffice: true
                    };
                    refetchQuery = companyRefetch(companyId, lang);
                    break;
                case 'company_moreStories':
                    options = {
                        articleId,
                        companyId,
                        isMoreStories: true
                    };
                    refetchQuery = companyRefetch(companyId, lang);
                    break;
                case 'job_officeLife':
                    options = {
                        articleId,
                        teamId,
                        isAtOffice: true
                    };
                    refetchQuery = teamRefetch(teamId, lang);
                    break;
                default:
                    return false;
            }

            try {
                await handleArticle({
                    variables: {
                        article,
                        options,
                        language: lang
                    },
                    refetchQueries: [refetchQuery]
                });
                await setFeedbackMessage({
                    variables: {
                        status: 'success',
                        message: 'Changes saved successfully.'
                    }
                });
                onClose();
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
);

const ArticlePopUp = props => {
    const {
        open, onClose, match: { params: { lang, companyId, teamId } }, type
    } = props;

    const { articles, loading } = props.getArticles || {};

    return (
        <Modal
            open={open}
            classes={{
                root: 'modalRoot'
            }}
            onClose={onClose}
        >
            {loading ? <Loader /> :
                <div className='storyEditPaper'>
                    <div className='popupHeader'>
                        <div className="popupTitle">
                            <FormattedMessage id="article.addArticle" defaultMessage="Add an article" description="Add an article">
                                {(text) => (
                                    <h4>{text}</h4>
                                )}
                            </FormattedMessage>
                            <FormattedMessage id="article.closeArticle" defaultMessage="CLOSE" description="CLOSE">
                                {(text) => (
                                    <h4 onClick={onClose} className="headerCloseBtn">{text}</h4>
                                )}
                            </FormattedMessage>
                        </div>
                        {/* <FormattedMessage id="article.para" defaultMessage="Lorem ipsum dolor sit amet, his fastidii phaedrum disputando ut, vis eu omnis intellegam, at duis voluptua signiferumque pro." description="Article Paragraph">
                            {(text) => (
                                <p>
                                    {text}
                                </p>
                            )}
                        </FormattedMessage> */}
                        
                        <div className='headerChoices'>
                            <FormattedMessage id="article.choose" defaultMessage="Choose an existing article" description="Choose an existing article">
                                {(text) => <span>{text}</span>}
                            </FormattedMessage>
                            <FormattedMessage id="or" defaultMessage="OR" description="OR">
                                {(text) => <span>{text}</span>}
                            </FormattedMessage>
                            <FormattedMessage id="article.createBtn" defaultMessage="Create new article" description="Create new article">
                                {(text) => (
                                    <Link to={{
                                        pathname: `/${lang}/articles/new`,
                                        state: { type, companyId, teamId }
                                    }}
                                        className='linkBtn'>
                                        {text}
                                    </Link>
                                )}
                            </FormattedMessage>
                        </div>
                    </div>
                    <div className='popupBody'>
                        <div className='articlesContainer'>
                            {
                                (articles && articles.length > 0) ? articles.map(article => {
                                    let { id, title, description, images, videos } = article;
                                    let image, video;
                                    if (images && images.length > 0) {
                                        image = `${s3BucketURL}${images[0].path}`;
                                    }
                                    if (videos && videos.length > 0) {
                                        video = videos[0].path;
                                    }
                                    return (
                                        <Grid container className='articleItem' onClick={() => props.updateArticle(id)} key={id}>
                                            <Grid item sm={12} md={3} className='articleMedia'>
                                                {image &&
                                                    <img src={image} alt={id} className='storyImg' />
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
                                            </Grid>
                                            <Grid item sm={12} md={9} className='articleTexts'>
                                                <h4>{title}</h4>
                                                <p>
                                                    {description}
                                                </p>
                                            </Grid>
                                        </Grid>
                                    )
                                })
                                    :
                                    <FormattedMessage id="articles.noArticles" defaultMessage="No articles." description="No articles">
                                        {(text) => <p className='noArticles'>{text}</p>}
                                    </FormattedMessage>
                            }
                        </div>
                    </div>
                    {/* <IconButton onClick={onClose} className='closeBtn'
                    classes={{
                        label: 'closeBtnLabel'
                    }}>
                        <Icon className='closeBtnIconRoot'>close</Icon>
                    </IconButton> */}
                </div>
            }
        </Modal>
    );
};

export default ArticlePopUpHOC(ArticlePopUp);