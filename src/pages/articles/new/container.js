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
    withState('formData', 'setFormData', () => {
        return {
            id: uuid(),
            tags: []
        };
    }),
    withState('isVideoUrl', 'changeMediaType', true),
    withState('isSaving', 'setIsSaving', false),
    withState('editor', 'setEditor', null),
    withState('imageUploadOpen', 'setImageUploadOpen', false),
    withHandlers({
        setTags: ({ setFormData }) => tags => setFormData(state => ({ ...state, tags })),
        openImageUpload: ({ setImageUploadOpen }) => () => setImageUploadOpen(true),
        closeImageUpload: ({ setImageUploadOpen }) => () => setImageUploadOpen(false),
        handleError: () => error => { console.log(error) },
        handleSuccess: ({ editor, formData: { id } }) => file => {
            let imageURL = `${s3BucketURL}/${articlesFolder}/${id}/${file.filename}`;
            console.log(file);
            editor.image.insert(imageURL);
        },
        handleFormChange: props => event => {
            const target = event.currentTarget;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;
            if (!name) {
                throw Error('Field must have a name attribute!');
            }
            props.setFormData(state => ({ ...state, [name]: value }));
        },
        updateDescription: props => text => props.setFormData(state => ({ ...state, 'description': text })),
        switchMediaType: ({ isVideoUrl, changeMediaType }) => () => changeMediaType(!isVideoUrl),
        saveArticle: props => async () => {
            const { handleArticle, formData: { id, title, description, videoURL, images, tags },
                setIsSaving, match, setFeedbackMessage, setEditMode, history, location: { state }
            } = props;

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
                console.log(err);
                setIsSaving(true);
                await setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: err.message
                    }
                });
            }
        },
        getSignedURL: ({ formData: { id }, setFeedbackMessage }) => async (e, editor, images) => {
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
                editor.image.upload();
                return true;
            } catch (error) {
                console.error(error);
                await setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: error.message
                    }
                });
                return false;
            }

        },
        handleFroalaSuccess: () => () => console.log('success'),
        handleFroalaError: () => () => console.log('error'),
    }),
    pure
);

export default NewArticleHOC(NewArticle);