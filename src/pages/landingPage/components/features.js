import React from 'react';
import { compose, withState, withHandlers, pure } from 'recompose';
import { Grid, IconButton, Icon } from '@material-ui/core';
import ReactPlayer from 'react-player';
import { graphql } from 'react-apollo';
import { FormattedMessage } from "react-intl"
import ArticlePopUp from './articlePopUp';
import { s3BucketURL } from '../../../constants/s3';
import { stripHtmlTags } from '../../../constants/utils';
import { setEditMode, setFeedbackMessage } from '../../../store/queries';
import { currentProfileRefetch } from '../../../store/refetch';
import { removeLandingPageArticle,  } from '../../../store/queries/articles'

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

const FeaturesHOC = compose(
    graphql(setEditMode, { name: 'setEditMode' }),
    graphql(removeLandingPageArticle, { name: 'removeLandingPageArticle'}),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('articlePopUpOpen', 'setArticlePopUpOpen', false),
    withHandlers({
        toggleArticlePopUp: ({ setArticlePopUpOpen }) => () => {
            setArticlePopUpOpen(true);
        },
        closeArticlePopUp: ({ setArticlePopUpOpen }) => () => {
            setArticlePopUpOpen(false);
        },
        handleEditBtnClick: ({ history, setEditMode, match: { params: { lang } } }) => async id => {
            await setEditMode({
                variables: {
                    status: true
                }
            });
            return history.push(`/${lang}/article/${id}`);
        },
        handleDeleteBtnClick: ({match, setFeedbackMessage, removeLandingPageArticle}) => async id => {
            try {
                await removeLandingPageArticle({
                    variables: {
                        id
                    },
                    refetchQueries: [
                        currentProfileRefetch(match.params.lang)
                    ]
                });
                await setFeedbackMessage({
                    variables: {
                        status: 'success',
                        message: 'Removed article successfully.'
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
        },
    }),
    pure
);

class Features extends React.Component {

    constructor (props) {
        super (props)
        const { landingPageQuery: { landingPage}} = props
        const { articles } = landingPage || {}
        this.state = {
            articles,
            onDelete: false
        }
    }

    componentWillReceiveProps (nextProps) {
        const { landingPageQuery: { landingPage}} = nextProps
        const { articles } = landingPage || {}
        if ( !this.state.onDelete ) {
            this.setState({
                articles
            })
        } else {
            this.setState({
                onDelete: false
            })
        }
        
        
    }

    clickDeleteBtn = (id) => {
        const { handleDeleteBtnClick } = this.props
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this.',
            buttons: [
              {
                label: 'Yes',
                onClick: () =>  { 
                    handleDeleteBtnClick(id) 
                    const articles = this.state.articles
                    for (var i = 0; i < articles.length; i++) {
                        var obj = articles[i];
                        if ( obj.id === id ) {
                            articles.splice(i, 1);
                            this.setState ({
                                articles,
                                onDelete: true,
                            })
                        }
                    }
                   
                }
              },
              {
                label: 'No',
                onClick: () => console.log("unchanged")
              }
            ]
          })
    }

    render () {
        const {
            editMode, handleEditBtnClick,
            articlePopUpOpen, toggleArticlePopUp, closeArticlePopUp,
            landingPageQuery: { landingPage }, currentUserQuery: { auth },
        } = this.props;
        const isEditAllowed = (auth && auth.currentUser && auth.currentUser.god) || false;
        // const { articles } = landingPage || {};
        console.log("----------------render --------------------", this.state.articles)
        return (
            <div className='featuresContainer'>
                {this.state.articles && this.state.articles.map((article, index) => {
                    let { id, images, videos, title, description } = article;
                    let image, video;
    
                    if (article.images && article.images.length > 0)
                        image = `${s3BucketURL}${images[0].path}`;
    
                    if (article.videos && article.videos.length > 0)
                        video = videos[0].path;
                    return (
                        <Grid container className={index % 2 === 0 ? 'featureRow' : 'featureRow featureRowReverse'} key={id}>
    
                            <Grid item md={5} sm={12} xs={12} className='featureImageContainer'>
                                <div className='featureImage'>
                                    {image &&
                                        <img src={image} alt={id} className='articleImg' />
                                    }
                                    {(video && !image) &&
                                        <ReactPlayer
                                            url={video}
                                            width='100%'
                                            height='100%'
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
                            </Grid>
    
                            <Grid item md={5} sm={11} xs={11} className='featureTexts'>
                                <h2 className='featureHeading'>
                                    {title}
                                    { ( isEditAllowed && editMode ) &&
                                        <IconButton className='editBtn' onClick={() => handleEditBtnClick(id)}>
                                            <Icon>edit</Icon>
                                        </IconButton>
                                    }
                                </h2>
                                <p className='featureText'>{stripHtmlTags(description)}</p>
                                { 
                                    ( isEditAllowed && editMode ) &&
                                    <IconButton className="deleteBtn" onClick={() => this.clickDeleteBtn(id)}>
                                        <Icon>delete</Icon>
                                    </IconButton>
                                }
                                
                            </Grid>
                        </Grid>
                    )
                })}
                {
                    editMode &&
                    <FormattedMessage id="company.team.addArticle" defaultMessage="+ Add Article" description="Add Article">
                        {(text) => (
                            <div className='addFeaturedArticle' onClick={toggleArticlePopUp}>
                                {text}
                            </div>
                        )}
                    </FormattedMessage>
                    
                }
                {articlePopUpOpen &&
                    <ArticlePopUp open={articlePopUpOpen} onClose={closeArticlePopUp} />
                }
            </div>

        );
    }
    
}

export default FeaturesHOC(Features);