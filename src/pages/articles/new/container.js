import NewArticle from './component';
import { compose, withState, pure, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import uuid from 'uuidv4';

import { handleArticle, setFeedbackMessage, setEditMode } from '../../../store/queries';
import { s3BucketURL, articlesFolder } from '../../../constants/s3';
import { testVideoUrlValid, getFroalaInsertStringFromVideoUrl } from '../common';

const NewArticleHOC = compose(
    withRouter,
    graphql(handleArticle, {
        name: 'handleArticle'
    }),
    graphql(setEditMode, { name: 'setEditMode' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('state', 'setState', ({ articleId }) => ({
        formData: {
            id: articleId || uuid(),
            tags: [],
            title: '',
            description: ''
        },
        isVideoUrl: true,
        isVideoUrlValid: false,
        videoURL: '',
        editor: null,
        imageUploadOpen: false,
        anchorEl: null,
        videoShareAnchor: null
    })),
    withState('images', 'setImages', []),
    withState('videos', 'setVideos', []),
    withHandlers({
        bindEditor: ({ state, setState }) => (e, editor) => setState({ ...state, editor }),
        setTags: ({ state, setState }) => tags => setState({ ...state, formData: { ...state.formData, tags } }),
        updateVideoUrl: ({ state, setState }) => event => {
            const target = event.currentTarget;
            const videoURL = target.type === 'checkbox' ? target.checked : target.value;
            const isVideoUrlValid = testVideoUrlValid(videoURL);
            setState({
                ...state,
                videoURL,
                isVideoUrlValid
            })
        },
        openImageUpload: ({ state, setState }) => () => setState({ ...state, imageUploadOpen: true }),
        closeImageUpload: ({ state, setState }) => () => setState({ ...state, imageUploadOpen: false }),
        handleError: () => error => { console.log(error) },
        handleSuccess: ({ images, setImages, state: { editor, formData: { id } } }) => ({ path, filename }) => {
            setImages([...images, {
                id: uuid(),
                path: path ? path : `/${articlesFolder}/${id}/${filename}`,
                isFeatured: false
            }]);
            editor.image.insert(path ? `${s3BucketURL}${path}` : `${s3BucketURL}/${articlesFolder}/${id}/${filename}`);
        },
        selectFeaturedImage: ({ images, setImages, videos, setVideos }) => imageId => {
            setVideos(videos.map(video => ({
                ...video,
                isFeatured: false
            })));

            setImages(images.map(image => ({
                ...image,
                isFeatured: image.id === imageId
            })))
        },
        removeImage: ({ images, setImages }) => (e, editor, $img) => {
            console.log($img);
            const path = $img[0].src.replace(s3BucketURL, '');
            setImages(images.filter(image => image.path !== path));
        },
        removeVideo: ({ videos, setVideos }) => (e, editor, $video) => {
            let iframe = $video.find('iframe'), src, url;
            if (iframe)
                src = iframe.attr('src');
            if (src)
                url = src.replace("embed/", "watch?v=");
            if (url)
                setVideos(videos.filter(video => video.path !== url));
        },
        selectFeaturedVideo: ({ images, setImages, videos, setVideos }) => videoId => {
            setVideos(videos.map(video => ({
                ...video,
                isFeatured: video.id === videoId
            })));

            setImages(images.map(image => ({
                ...image,
                isFeatured: false
            })))
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
        openVideoShare: ({ state, setState }) => ev => setState({ ...state, videoShareAnchor: ev.target }),
        closeVideoShare: ({ state, setState, setVideos, videos }) => () => {
            if (state.isVideoUrlValid) {
                setVideos([
                    ...videos,
                    {
                        id: uuid(),
                        path: state.videoURL,
                        isFeatured: false
                    }
                ]);
                setState({ ...state, videoShareAnchor: null, videoURL: '' });
                state.editor.video.insert(getFroalaInsertStringFromVideoUrl(state.videoURL));
            }
            else
                return false;
        },
        cancelVideoPopover: ({ state, setState }) => () => setState({ ...state, videoShareAnchor: null, videoURL: '' }),
        saveArticle: props => async () => {
            const { handleArticle, state: appState, setEditMode, match, setFeedbackMessage, history, location: { state }, images, videos } = props;
            const { formData: { id, title, description, tags } } = appState;
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
                videos,
                tags,
                // tags: tags.map(tag => tag.title),
                postAs
            };

            if (companyId)
                article.postingCompanyId = companyId;
            if (teamId)
                article.postingTeamId = teamId;

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
                
                return history.push(`/${match.params.lang}/article/${id}`)
                
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

export default NewArticleHOC(NewArticle);