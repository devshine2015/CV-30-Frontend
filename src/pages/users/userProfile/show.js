import React from 'react';
import { Grid, Icon, IconButton, Button } from '@material-ui/core';
// import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import ExperienceEdit from './components/experienceEdit';
import ExperienceDisplay from './components/experienceDisplay';

const Show = (props) => {
    const { editMode,
        XPEdit, toggleExperienceEdit, experience
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
                    <h2 className="columnTitle">
                        Contact&nbsp;<b>me</b>
                        <i className="fas fa-angle-down"></i>
                        {
                            editMode &&
                            <IconButton className='contactEditBtn'>
                                <Icon>edit</Icon>
                            </IconButton>
                        }
                    </h2>
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
}

export default Show;