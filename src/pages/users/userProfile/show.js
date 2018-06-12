import React from 'react';
import { Grid, Icon, IconButton, Button } from '@material-ui/core';
// import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import ExperienceEdit from './components/experienceEdit';
import ExperienceDisplay from './components/experienceDisplay';
import EditContactDetails from './components/editContactDetails';
import { compose } from 'react-apollo';
import { pure, withState, withHandlers } from 'recompose';
import { contactFields as fields } from '../../../constants/contact';

const Show = (props) => {
    const { editMode,
        XPEdit, toggleExperienceEdit, experience,
        contact, editContactDetails, toggleEditContact, closeContactEdit, toggleContactExpanded, contactExpanded,
    } = props;
    return (
        <Grid container className='mainBody userProfileShow'>
            <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                <section className='experienceSection'>
                    <h2 className='sectionTitle'>My <b>experience</b></h2>
                    {
                        experience.map((job, index) => <ExperienceDisplay job={job} globalEditMode={editMode} key={`xpItem-${index}`} />)
                    }
                    {editMode &&
                        <div className='experienceAdd'>
                            <Button className='addXPButton' onClick={toggleExperienceEdit}>
                                + Add Experience
                        </Button>
                        </div>
                    }
                    {
                        (editMode && XPEdit) && <ExperienceEdit />
                    }

                </section>
                <section className='experienceSection'>
                    <h2 className='sectionTitle'>My <b>experience</b></h2>
                    {
                        experience.map((job, index) => <ExperienceDisplay job={job} globalEditMode={editMode} key={`xpItem-${index}`} />)
                    }
                    {editMode &&
                        <div className='experienceAdd'>
                            <Button className='addXPButton' onClick={toggleExperienceEdit}>
                                + Add Experience
                        </Button>
                        </div>
                    }
                    {
                        (editMode && XPEdit) && <ExperienceEdit />
                    }

                </section>
            </Grid>
            <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                <div className='columnRightContent'>
                    <div className='columnTitle'>
                        <h2 className="columnTitle">
                            Contact&nbsp;<b>me</b>
                            <IconButton onClick={toggleContactExpanded} clasName='contactExpandToggle'>
                                {
                                    contactExpanded ?
                                        <i className="fas fa-angle-up"></i> :
                                        <i className="fas fa-angle-down"></i>
                                }
                            </IconButton>
                            {
                                editMode &&
                                <IconButton className='contactEditBtn' onClick={toggleEditContact}>
                                    <Icon>edit</Icon>
                                </IconButton>
                            }
                        </h2>
                        {
                            !editContactDetails &&
                            <div className={contactExpanded ? 'contactDetails open' : 'contactDetails'}>
                                {Object.keys(contact).map((key) => {
                                    const result = fields.find(field => field.id === key);
                                    let label = result.text || '';
                                    let value = contact[key];
                                    return (
                                        <p className='contactDetail'>
                                            <span>{label}: </span>
                                            {value}
                                        </p>
                                    )
                                })}
                            </div>
                        }
                        {editContactDetails && <EditContactDetails contact={contact} closeContactEdit={closeContactEdit} open={contactExpanded} />}

                    </div>
                    <div className='knowHowContainer'>
                        <div className='controls'>
                            <h4>Know<b>how</b></h4>
                            <div className='sliderControls'>
                                <IconButton className='sliderArrow'>
                                    <Icon>
                                        arrow_back_ios
                                </Icon>
                                </IconButton>

                                <span className='sliderDot'></span>
                                <span className='sliderDot'></span>
                                <span className='sliderDot active'></span>
                                <span className='sliderDot'></span>
                                <span className='sliderDot'></span>

                                <IconButton className='sliderArrow'>
                                    <Icon>
                                        arrow_forward_ios
                                </Icon>
                                </IconButton>
                            </div>
                        </div>

                        <div className='sliderContainer'>
                            <p>
                                Lorem ipsum dolor sit amet, cu mei reque inimicus. Exerci altera usu te. Omnis primis id vel, ei primis torquatos eum, per ex munere dolore
                                malorum. Recusabo prodesset no ius. Ad unum convenire elaboraret ius, te quem graeco sea.
                        </p>
                            <div className='media'>
                                <Icon className='playIcon'>
                                    play_circle_filled
                            </Icon>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className='myStoryContainer'>
                        <h4>My&nbsp;<b>story</b></h4>
                        <p>
                            Vel at ferri homero aliquando, pro ex elitr patrioque. Quando dicant veniam ea nam. No sea cibo interpretaris, vix reque errem ea. Id ius ridens maluisset dissentiunt, quo et autem etiam abhorreant. Mei te audiam intellegat conclusionemque, no labore impedit instructior cum. Pri id homero expetendis, cu nec melius feugait comprehensam. Ex tota corpora vivendum has, cum at dolorum expetenda urbanitas, mel ut rebum ornatus.
                            Vidisse discere ius at, sed ex nibh integre. Malorum aliquando mediocritatem vix in, ea legimus epicuri sententiae sed. Eu qui nisl expetenda. Mundi adolescens id est, habeo comprehensam ex est. Ius atqui referrentur contentiones ad, te eum alia tacimates, per minimum insolens explicari ut. Eu vel saepe quidam.
                            Legere utroque epicuri ad mei. Ad splendide honestatis qui, sit summo laboramus te. At eos docendi delectus imperdiet. Vide fugit vel an. Atqui ocurreret definitionem an nam, ne quo dicta evertitur, wisi constituam eos ad. Stet probo efficiantur ne cum.
                    </p>
                    </div>
                </div>
            </Grid>
        </Grid>
    );
};
const ShowHOC = compose(
    withState('XPEdit', 'setXPEdit', null),
    withState('editContactDetails', 'setEditContactDetails', false),
    withState('contactExpanded', 'setContactExpanded', false),
    withHandlers({
        toggleExperienceEdit: ({ XPEdit, setXPEdit }) => () => {
            setXPEdit(!XPEdit);
        },
        toggleEditContact: ({ editContactDetails, setEditContactDetails, setContactExpanded }) => () => {
            setEditContactDetails(!editContactDetails);
            if (!editContactDetails)
                setContactExpanded(true);
        },
        closeContactEdit: ({ setEditContactDetails }) => () => {
            setEditContactDetails(false);
        },
        toggleContactExpanded: ({ contactExpanded, setContactExpanded }) => () => {
            setContactExpanded(!contactExpanded)
        }
    }),
    pure
);

export default ShowHOC(Show);