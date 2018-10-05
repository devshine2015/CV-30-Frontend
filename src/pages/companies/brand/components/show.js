import React from 'react';
import { Grid, Icon, IconButton, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import { Link } from 'react-router-dom';
import { FormattedMessage, FormattedDate } from 'react-intl';
import ReactPlayer from 'react-player';

// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';

import QuestionEdit from './questionEdit';
import ArticleDisplay from './articleDisplay';
import ArticleSlider from '../../../../components/articleSlider';
import { handleCompany, handleFAQ, setFeedbackMessage, handleArticle, setEditMode } from '../../../../store/queries';
import { companyRefetch } from '../../../../store/refetch';
import { graphql } from 'react-apollo';
import { s3BucketURL } from '../../../../constants/s3';
import ArticlePopup from '../../../../components/ArticlePopup';

const ShowHOC = compose(
    graphql(handleCompany, { name: 'handleCompany' }),
    graphql(handleFAQ, { name: 'handleFAQ' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    graphql(handleArticle, { name: 'handleArticle' }),
    graphql(setEditMode, { name: 'setEditMode' }),
    withState('state', 'setState', ({ companyQuery: { company: { description } } }) => ({
        expanded: false,
        edited: null,
        editedStory: null,
        newQA: false,
        description,
        articlePopupOpen: false,
        articleType: null
    })),
    withHandlers({
        updateDescription: ({ state, setState }) => description => setState({ ...state, description }),
        submitDescription: ({ companyQuery: { company }, handleCompany, state: { description }, match, setFeedbackMessage }) => async () => {
            try {
                await handleCompany({
                    variables: {
                        language: match.params.lang,
                        details: {
                            id: company.id,
                            description: description || ''
                        }
                    },
                    refetchQueries: [
                        companyRefetch(company.id, match.params.lang)
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
        },
        expandPanel: ({ state, setState }) => panel => (ev, expanded) => {
            if (state.edited === panel) {
                setState({ ...state, expanded: panel });
            } else {
                if (state.edited)
                    setState({ ...state, edited: null });
                setState({ ...state, expanded: expanded ? panel : false });
            }
        },
        editPanel: ({ state, setState }) => (e, panel) => {
            setState({ ...state, edited: panel, expanded: panel !== state.edited ? panel : null });
            if (panel !== state.edited)
                e.stopPropagation();
        },
        addQA: ({ state, setState, companyQuery }) => () => {
            setState({ ...state, newQA: true, expanded: `panel-${companyQuery.company.faqs.length}` });
        },
        endAddQA: ({ state, setState }) => () => {
            setState({ ...state, newQA: false });
        },
        endEditQA: ({state, setState}) => () => {
            setState({...state, edited: null, expanded: false});
        },
        deleteQA: props => async (e, id) => {
            e.stopPropagation();
            const { handleFAQ, setFeedbackMessage, match: { params: { lang, companyId } } } = props;
            try {
                await handleFAQ({
                    variables: {
                        language: lang,
                        faq: {
                            id,
                            companyId: companyId,
                            remove: true
                        }
                    },

                    refetchQueries: [
                        companyRefetch(companyId, lang)
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
        },
        openArticlePopup: ({ state, setState }) => articleType => setState({ ...state, articleType, articlePopupOpen: true }),
        closeArticlePopup: ({ state, setState }) => () => setState({ ...state, articlePopupOpen: false }),
        deleteOfficeArticle: ({ handleArticle, setFeedbackMessage, match: { params: { companyId, lang: language } } }) => async id => {
            try {
                await handleArticle({
                    variables: {
                        article: {
                            id
                        },
                        options: {
                            articleId: id,
                            companyId,
                            isAtOffice: false
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
        },
        editJob: ({ setEditMode, history, match: { params: { lang } } }) => async jobId => {
            await setEditMode({
                variables: {
                    status: true
                }
            });
            return history.push(`/${lang}/job/${jobId}`);
        }
    }),
    pure
);

const Show = props => {
    const {
        state: {
            expanded,
            edited,
            newQA,
            description,
            articlePopupOpen,
            articleType
        },
        expandPanel, getEditMode,
        companyQuery: { company: { name, faqs, officeArticles, storiesArticles, recentJobs } },
        isEditAllowed, deleteOfficeArticle,
        editPanel, addQA, deleteQA, endEditQA,
        match: { params: { lang, companyId } },
        updateDescription, submitDescription,
        openArticlePopup, closeArticlePopup,
        editJob, endAddQA
    } = props;

    const editMode = isEditAllowed && getEditMode.editMode.status;

    return (
        <Grid container className='mainBody brandShow'>
            <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                <section className='aboutSection'>
                    <h2 className='titleHeading'>Despre <b>{name}</b></h2>
                    {
                        editMode ?
                            <div className='editorWrapper'>
                                <FormattedMessage id="company.brand.froalaEditor" defaultMessage="This is where the company headline should be" description="Company Headline">
                                    {(text) => (
                                        <FroalaEditor
                                            config={{
                                                placeholderText: text,
                                                iconsTemplate: 'font_awesome_5',
                                                toolbarInline: true,
                                                charCounterCount: false,
                                                toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontFamily', 'fontSize', 'color', '-', 'paragraphFormat', 'align', 'formatOL', 'indent', 'outdent', '-', 'undo', 'redo']
                                            }}
                                            model={description}
                                            onModelChange={updateDescription}
                                        />
                                    )}
                                </FormattedMessage>
                                
                                <IconButton className='submitBtn' onClick={submitDescription}>
                                    <Icon>done</Icon>
                                </IconButton>
                            </div>
                            : <p dangerouslySetInnerHTML={{ __html: description }} />
                    }
                </section>

                <section className='officeLife'>
                    <FormattedMessage id="company.brand.lifeOffice" defaultMessage="Life \n at the office" description="Life at the office">
                        {(text) => (
                            <ArticleSlider
                                articles={officeArticles}
                                editMode={editMode}
                                deleteArticle={deleteOfficeArticle}
                                title={(<h2 className='titleHeading'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>)}
                            />
                        )}
                    </FormattedMessage>
                    
                    {editMode &&
                        <FormattedMessage id="company.brand.addStoryBtn" defaultMessage="+ Add" description="Add Story Button">
                            {(text) => (
                                <span className='addStoryBtn' onClick={() => openArticlePopup('company_officeLife')}>
                                    {text}
                                </span>
                            )}
                        </FormattedMessage>
                    }
                        
                </section>

                <section className='moreStories'>
                    <h2 className='titleHeading'>Afla <b>mai multe</b></h2>
                    {
                        storiesArticles.map((article, index) => (
                            <ArticleDisplay article={article} index={index} editMode={editMode} key={article.id} />
                        ))
                    }
                    {editMode &&
                        <FormattedMessage id="company.brand.addStoryBtn" defaultMessage="+ Add" description="Add Story Button">
                            {(text) => (
                                <span className='addStoryBtn' onClick={() => openArticlePopup('company_moreStories')}>
                                    {text}
                                </span>
                            )}
                        </FormattedMessage>
                    }
                </section>

                <ArticlePopup
                    open={articlePopupOpen}
                    onClose={closeArticlePopup}
                    type={articleType}
                />

                <section className='qaSection'>
                    <h2 className='titleHeading'>Q &amp; A</h2>
                    {
                        faqs.map(item => {
                            if (!editMode || edited !== item.id)
                                return (
                                    <ExpansionPanel
                                        expanded={expanded === item.id}
                                        onChange={expandPanel(item.id)}
                                        classes={{
                                            root: 'qaPanelRoot'
                                        }}
                                        key={item.id}
                                    >
                                        <ExpansionPanelSummary expandIcon={<Icon>arrow_drop_down_circle</Icon>} classes={{
                                            root: 'qaPanelHeader',
                                            expandIcon: 'qaHeaderIcon',
                                            content: 'qaPanelHeaderContent'
                                        }}>
                                            {item.question}
                                            {editMode &&
                                                <React.Fragment>
                                                    <IconButton onClick={(e) => editPanel(e, item.id)} className='editBtn'>
                                                        <Icon>edit</Icon>
                                                    </IconButton>
                                                    <IconButton onClick={(e) => deleteQA(e, item.id)} className='editBtn'>
                                                        <Icon>delete</Icon>
                                                    </IconButton>
                                                </React.Fragment>
                                            }
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails classes={{ root: 'qaPanelDetailRoot' }}>
                                            {item.answer}
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                )
                            else
                                return <QuestionEdit question={item} onChange={expandPanel} expanded={expanded} panelId={item.id} key={item.id} onClose={endEditQA}/>
                        })
                    }
                    {
                        editMode &&
                        <FormattedMessage id="company.brand.addStoryBtn" defaultMessage="+ Add" description="Add Story Button">
                            {(text) => (
                                <div className='addQABtn' onClick={addQA}>
                                    {text}
                                </div>
                            )}
                        </FormattedMessage>
                        
                    }
                    {editMode && newQA && <QuestionEdit onChange={expandPanel} expanded={expanded} panelId={`panel-${faqs.length}`} onClose={endAddQA}/>}
                </section>
            </Grid>
            <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                <div className='columnRightContent'>
                    <FormattedMessage id="company.brand.recentJobs" defaultMessage="Recent \n jobs" description="Recent jobs">
                        {(text) => (
                            <h2 className="columnTitle">
                                <b>{text.split("\n")[0]}</b> {text.split("\n")[1]}
                            </h2>
                        )}
                    </FormattedMessage>

                    <div className='jobs'>
                        {
                            recentJobs && recentJobs.map(job => {
                                return (
                                    <div className='jobItem' key={job.id}>
                                        <div className='media'>
                                            {(job.imagePath || job.videoUrl) ?
                                                <React.Fragment>
                                                    {
                                                        job.imagePath && <img src={`${s3BucketURL}${job.imagePath}`} alt={job.id} />
                                                    }
                                                    {(job.videoUrl && !job.imagePath) &&
                                                        <ReactPlayer
                                                            url={job.videoUrl}
                                                            width='250px'
                                                            height='140px'
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
                                                            playing={false} />}
                                                </React.Fragment> :
                                                <div className='mediaFake'>
                                                    <i className="fas fa-play fa-3x"></i>
                                                </div>
                                            }
                                            {job.level &&
                                                <span className='role'>{job.level}</span>
                                            }
                                        </div>
                                        <div className='info'>
                                            <Link to={`/${lang}/job/${job.id}`}>
                                                <h5 className='jobTitle'>{job.title}</h5>
                                                <p className='details'>
                                                    <FormattedDate value={job.expireDate} month='short' day='2-digit'                >
                                                        {(text) => (<span>{text}</span>)}
                                                    </FormattedDate>
                                                    <span>&nbsp;-&nbsp;{job.location}</span>
                                                </p>
                                            </Link>
                                        </div>
                                        {editMode &&
                                            <IconButton className='floatingEditBtn' onClick={() => editJob(job.id)}>
                                                <Icon>edit</Icon>
                                            </IconButton>
                                        }
                                    </div>
                                )
                            })
                        }
                        {
                            editMode &&
                            <FormattedMessage id="company.brand.addJobBtn" defaultMessage="+ Add new job" description="Add new job">
                                {(text) => (
                                    <Link className='addJobBtn' to={{
                                        pathname: `/${lang}/jobs/new`,
                                        state: { companyId }
                                    }}>
                                        {text}
                                    </Link>
                                )}
                            </FormattedMessage>
                            
                        }
                    </div>
                </div>
            </Grid>
        </Grid>
    );
};

export default ShowHOC(Show);