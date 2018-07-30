import React from 'react';
import { Grid, Icon, IconButton, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import { Link } from 'react-router-dom';


// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';

import AddNewStory from './addStory';
import QuestionEdit from './questionEdit';
import Story from './story';
import ArticleSlider from '../../../../components/articleSlider';
import { companyQuery, handleCompany, setFeedbackMessage } from '../../../../store/queries';
import { graphql } from 'react-apollo';
import Feedback from '../../../../components/Feedback';

const ShowHOC = compose(
    graphql(handleCompany, { name: 'handleCompany' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('expanded', 'updateExpanded', null),
    withState('edited', 'updateEdited', null),
    withState('editedStory', 'editStory', null),
    withState('newQA', 'addNewQA', false),
    withState('description', 'setDescription', props => {
        let { companyQuery: { company: { i18n } } } = props;
        if (!i18n || !i18n[0] || !i18n[0].description)
            return '';
        return i18n[0].description;
    }),
    withHandlers({
        updateDescription: ({ setDescription }) => text => setDescription(text),
        submitDescription: ({ companyQuery: { company }, handleCompany, description, match, setFeedbackMessage }) => async () => {
            try {
                let result = await handleCompany({
                    variables: {
                        language: match.params.lang,
                        details: {
                            id: company.id,
                            description
                        }
                    },
                    refetchQueries: [{
                        query: companyQuery,
                        fetchPolicy: 'network-only',
                        name: 'companyQuery',
                        variables: {
                            language: match.params.lang,
                            id: company.id
                        }
                    }]
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
        expandPanel: ({ updateExpanded, edited, updateEdited }) => (panel) => (ev, expanded) => {
            if (edited === panel) {
                updateExpanded(panel);
            } else {
                if (edited)
                    updateEdited(null);
                updateExpanded(expanded ? panel : false);

            }
        },
        editPanel: ({ updateEdited, updateExpanded, edited }) => (e, panel) => {
            updateEdited(panel || false);
            if (panel !== edited) {
                updateExpanded(panel);
                e.stopPropagation();
            }
        },
        addQA: ({ addNewQA }) => () => {
            addNewQA(true);
        },
        closeFeedback: ({ setFeedbackMessage }) => () => setFeedbackMessage(null)
    }),
    pure
);

const Show = (props) => {
    const {
        expanded, expandPanel,
        getEditMode: { editMode: { status: editMode } },
        companyQuery: { company: { faqs, officeArticles, storiesArticles, jobs } },
        edited, editPanel, addQA, newQA,
        match: { params: { lang, companyId } },
        description, updateDescription, submitDescription,
        feedbackMessage, closeFeedback
    } = props;

    return (
        <Grid container className='mainBody brandShow'>
            <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                <section className='aboutSection'>
                    <h2 className='titleHeading'>Despre <b>Ursus Romania</b></h2>
                    {
                        editMode ?
                            <div className='editorWrapper'>
                                <FroalaEditor
                                    config={{
                                        placeholderText: 'This is where the company description should be',
                                        iconsTemplate: 'font_awesome_5',
                                        toolbarInline: true,
                                        charCounterCount: false,
                                        toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontFamily', 'fontSize', 'color', '-', 'paragraphFormat', 'align', 'formatOL', 'indent', 'outdent', '-', 'undo', 'redo']
                                    }}
                                    model={description}
                                    onModelChange={updateDescription}
                                />
                                <IconButton className='submitBtn' onClick={submitDescription}>
                                    <Icon>done</Icon>
                                </IconButton>
                            </div>
                            : <p dangerouslySetInnerHTML={{ __html: description }} />
                    }
                </section>

                <section className='officeLife'>
                    <ArticleSlider
                        articles={officeArticles}
                        title={(<h2 className='titleHeading'>Viata <b>la birou</b></h2>)}
                    />
                    {editMode && <AddNewStory type='company_officeLife' />}
                </section>

                <section className='moreStories'>
                    <h2 className='titleHeading'>Afla <b>mai multe</b></h2>
                    {
                        storiesArticles.map((story, index) => (
                            <Story story={story} index={index} editMode={editMode} key={story.id} />
                        ))
                    }
                    {editMode && <AddNewStory type='company_moreStories' />}
                </section>

                <section className='qaSection'>
                    <h2 className='titleHeading'>Q &amp; A</h2>
                    {
                        faqs.map((item, index) => {
                            const panelId = 'panel-' + index;
                            if (edited !== panelId)
                                return (
                                    <ExpansionPanel
                                        expanded={expanded === panelId}
                                        onChange={expandPanel(panelId)}
                                        classes={{
                                            root: 'qaPanelRoot'
                                        }}
                                        key={`QAitem-${index}`}
                                    >
                                        <ExpansionPanelSummary expandIcon={<Icon>arrow_drop_down_circle</Icon>} classes={{
                                            root: 'qaPanelHeader',
                                            expandIcon: 'qaHeaderIcon',
                                            content: 'qaPanelHeaderContent'
                                        }}>
                                            {item.i18n[0].question}
                                            {editMode &&
                                                <IconButton onClick={(e) => editPanel(e, panelId)} className='editBtn'>
                                                    <Icon>edit</Icon>
                                                </IconButton>
                                            }
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails classes={{ root: 'qaPanelDetailRoot' }}>
                                            {item.i18n[0].answer}
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                )
                            else
                                return <QuestionEdit question={item} onChange={expandPanel} expanded={expanded} panelId={panelId} />
                        })
                    }
                    {
                        editMode &&
                        <div className='addQABtn' onClick={addQA}>
                            + Add
                        </div>
                    }
                    {editMode && newQA && <QuestionEdit onChange={expandPanel} expanded={expanded} panelId={`panel-${faqs.length}`} />}
                </section>
            </Grid>
            <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                <div className='columnRightContent'>
                    <h2 className="columnTitle">
                        <b>Recent</b> jobs
                    </h2>

                    <div className='jobs'>

                        {
                            jobs.map(job => {
                                return (
                                    <div className='jobItem' key={job.id}>
                                        <div className='media'>
                                            <div className='mediaFake'>
                                                <i className="fas fa-play fa-3x"></i>
                                            </div>
                                            {job.level &&
                                                <span className='role'>{job.level}</span>
                                            }
                                        </div>
                                        <div className='info'>
                                            <h5>{job.i18n[0].title}</h5>
                                            <span>{job.i18n[0].description}</span>
                                        </div>

                                    </div>
                                )
                            })
                        }
                        {
                            editMode &&
                            <Link className='addJobBtn' to={{
                                pathname: `/${lang}/jobs/new`,
                                state: { companyId }
                            }}>
                                + Add new job
                            </Link>
                        }
                    </div>
                </div>
            </Grid>
        </Grid>
    );
};

export default ShowHOC(Show);