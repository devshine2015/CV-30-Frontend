import NewArticle from './component';
import { compose, withState, pure, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import uuid from 'uuidv4';

import { handleArticle, setFeedbackMessage, setEditMode } from '../../../store/queries';
import { s3BucketURL, articlesFolder } from '../../../constants/s3';

const NewArticleHOC = compose(
    withRouter,
    graphql(handleArticle, {
        name: 'handleArticle'
    }),
    graphql(setEditMode, { name: 'setEditMode' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('state', 'setState', {
        formData: {
            id: uuid(),
            tags: [],
            description: ''
        },
        isVideoUrl: true,
        editor: null,
        imageUploadOpen: false
    }),
    withHandlers({
        setTags: ({ state, setState }) => tags => setState({ ...state, formData: { ...state.formData, tags } }),
        openImageUpload: ({ state, setState }) => () => setState({ ...state, imageUploadOpen: true }),
        closeImageUpload: ({ state, setState }) => () => setState({ ...state, imageUploadOpen: false }),
        handleError: () => error => { console.log(error) },
        handleSuccess: ({ state: { editor, formData: { id } } }) => file => {
            let imageURL = `${s3BucketURL}/${articlesFolder}/${id}/${file.filename}`;
            editor.image.insert(imageURL);
        },
        handleFormChange: ({ state, setState }) => event => {
            const target = event.currentTarget;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;
            if (!name) {
                throw Error('Field must have a name attribute!');
            }
            setState({ ...state, formData: { ...state.formData, [name]: value } });
        },
        updateDescription: ({ state, setState }) => description => setState({ ...state, formData: { ...state.formData, description } }),
        switchMediaType: ({ state, setState }) => () => setState({ ...state, isVideoUrl: !state.isVideoUrl }),
        saveArticle: props => async () => {
            const { handleArticle, state: appState, setEditMode, match, setFeedbackMessage, history, location: { state } } = props;
            const { formData: { id, title, description, videoURL, images, tags } } = appState;
            let { type, companyId, teamId } = state || {};
            let options = {};
            let postAs = 'profile';

            if (type === 'profile_isFeatured' || type === 'profile_isAboutMe')
                postAs = 'profile';
            if (type === 'company_featured' || type === 'company_officeLife' || type === 'company_moreStories')
                postAs = 'company';
            if (type === 'job_officeLife')
                postAs = 'team'

            const article = {
                id,
                title,
                description,
                images,
                tags,
                postAs
            };

            if (companyId)
                article.postingCompanyId = companyId;
            if (teamId)
                article.postingTeamId = teamId;

            if (videoURL) {
                article.videos = [
                    {
                        id: uuid(),
                        title: videoURL,
                        sourceType: 'article',
                        path: videoURL

                    }
                ];
            }

            switch (type) {
                case 'profile_isFeatured':
                    article.isFeatured = true;
                    article.id = id;
                    break;
                case 'profile_isAboutMe':
                    article.isAboutMe = true;
                    article.id = id;
                    break;
                case 'company_featured':
                    options = {
                        articleId: id,
                        companyId: companyId,
                        isFeatured: true
                    };
                    break;
                case 'company_officeLife':
                    options = {
                        articleId: id,
                        companyId,
                        isAtOffice: true
                    };
                    break;
                case 'company_moreStories':
                    options = {
                        articleId: id,
                        companyId,
                        isMoreStories: true
                    };
                    break;
                case 'job_officeLife':
                    options = {
                        articleId: id,
                        teamId: teamId,
                        isAtOffice: true
                    };
                    break;
                default:
                    break;
            }

            try {
                await handleArticle({
                    variables: {
                        language: match.params.lang,
                        article,
                        options
                    }
                });

                await setFeedbackMessage({
                    variables: {
                        status: 'success',
                        message: 'Changes saved successfully.'
                    }
                });

                await setEditMode({
                    variables: {
                        status: false
                    }
                });

                if (type === 'profile_isFeatured' || type === 'profile_isAboutMe')
                    return history.push(`/${match.params.lang}/myProfile`);
                else if (postAs === 'company' && companyId)
                    return history.push(`/${match.params.lang}/company/${companyId}`)
                else if (postAs === 'team' && teamId)
                    return history.push(`/${match.params.lang}/team/${teamId}`)

                return history.push(`/${match.params.lang}/article/${id}`);
            }
            catch (err) {
                await setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: err.message
                    }
                });
            }
        },
        getSignedURL: ({ state: { formData: { id }, setFeedbackMessage } }) => async (e, editor, images) => {
            let file = images[0];
            const params = {
                fileName: file.name,
                contentType: file.type,
                id,
                type: 'article'
            };

            try {
                let response = await fetch('https://k73nyttsel.execute-api.eu-west-1.amazonaws.com/production/getSignedURL', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(params)
                });
                let responseJson = await response.json();
                editor.opts.imageUploadMethod = 'PUT';
                editor.opts.imageUploadURL = responseJson.signedUrl;
                editor.image.upload(images);
            } catch (error) {
                console.log(error);
                await setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: error.message
                    }
                });
                return false;
            }
            return true;
        },
        handleFroalaSuccess: () => (e, editor, response) => console.log(e, editor, response),
        handleFroalaError: () => (e, editor, error, response) => console.error(e, editor, error, response)
    }),
    pure
);

export default NewArticleHOC(NewArticle);