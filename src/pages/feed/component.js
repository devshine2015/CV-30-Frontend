import React from 'react';
import { Grid, Button, Icon, Avatar, TextField, FormGroup, FormLabel, Switch as ToggleSwitch, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';

const NewsFeed = props => {
    const { formData, handleFormChange, switchIsArticle, isArticle, article } = props;
    const { postBody } = formData;
    const { id, firstName, lastName, email, avatar, fullName } = props;
    return (
        <div className='newsFeedRoot'>
            <Grid container className='mainBody brandShow'>
                <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                    <section className='newPost'>
                        <div className='postHeader'>
                            <div className='userProfile'>
                                <Avatar className='userAvatar' src='' alt='userAvatar' />
                                <span className='postAs'>
                                    Post as:
                                        <span className='userName'>Radu Daniel</span>
                                </span>
                            </div>
                            <Button className='mediaButton'>
                                <Icon className='icon'>
                                    camera_alt
                                </Icon>
                                + Photo / Video
                            </Button>
                        </div>
                        <div className='postBody'>
                            <TextField
                                name="postBody"
                                placeholder="Say something..."
                                fullWidth
                                className='textField'
                                onChange={handleFormChange}
                                value={postBody}
                                type='text'
                                multiline
                                rows={1}
                                rowsMax={10}
                                InputProps={{
                                    disableUnderline: true
                                }}
                            />
                        </div>
                        <div className='postFooter'>
                            <FormGroup className='footerToggle'>
                                <FormLabel className={!isArticle ? 'active' : ''}>Post</FormLabel>
                                <ToggleSwitch checked={isArticle} onChange={switchIsArticle}
                                    classes={{
                                        switchBase: 'colorSwitchBase',
                                        checked: 'colorChecked',
                                        bar: 'colorBar',
                                    }}
                                    color="primary" />
                                <FormLabel className={isArticle ? 'active' : ''}>Article</FormLabel>
                            </FormGroup>
                            <Button className='postBtn'>
                                Post
                            </Button>
                        </div>
                    </section>
                    <section className='profileActions'>
                        <div className='profileAction'>
                            <h3>
                                Conecteaza-ti compania cu urmatorul tau angajat
                            </h3>
                            <p>
                                Lorem ipsum dolor sit amet, eu his scripta perpetua. Falli movet prompta has in...
                            </p>

                            <Button className='profileActionBtn'>
                                Adauga o companie
                            </Button>
                        </div>
                        <div className='profileAction'>
                            <h3>
                                Conecteaza-ti compania cu urmatorul tau angajat
                            </h3>
                            <p>
                                Lorem ipsum dolor sit amet, eu his scripta perpetua. Falli movet prompta has in...
                            </p>
                            <Button className='profileActionBtn'>
                                Adauga o companie
                            </Button>
                        </div>
                        <div className='profileAction'>
                            <h3>
                                Conecteaza-ti compania cu urmatorul tau angajat
                            </h3>
                            <p>
                                Lorem ipsum dolor sit amet, eu his scripta perpetua. Falli movet prompta has in...
                            </p>
                            <Button className='profileActionBtn'>
                                Adauga o companie
                            </Button>
                        </div>
                    </section>
                    <section className='articlesList'>
                        <div className='listItem userListItem'>
                            <div className='leftOverlay'>
                                <Link to={`/dashboard/profile/${id}`}>
                                    <Avatar alt={firstName || lastName || email} src={avatar} className='avatar' />
                                </Link>
                                <div className='leftOverlayTexts'>
                                    <h6 className='userName'>
                                        <span>{fullName || 'John Doe'}</span>
                                        <i className='fas fa-caret-down' />
                                    </h6>
                                    <p className='userTitle'>Manager</p>
                                </div>
                            </div>
                            <span className='articleDate'>15-11-2017</span>
                            <div className='rightOverlay'>
                                Works at&nbsp;<span className='highlight'>CV30</span>&nbsp;-&nbsp;<span className='highlight'>Marketing team</span>
                            </div>
                            <div className='itemBody'>
                                <p className='articleBody'>
                                    <span className='articleTitle'>This is the article title.</span> &nbsp;
                                    Lorem ipsum dolor sit amet, eu his scripta perpetua. Lorem ipsum dolor sit amet, eu his scripta perpetua. Lorem ipsum dolor sit amet, eu his scripta perpetua. Lorem ipsum dolor sit amet, eu his scripta perpetua. Lorem ipsum dolor sit amet, eu his scripta perpetua. Lorem ipsum dolor sit amet, eu his scripta perpetua.
                                </p>
                                <div className='articleMedia'>
                                </div>
                                <div className='socialSection'>
                                    <div className='comments'>
                                        <span className='counter'>3 Comments</span>
                                        <Button className='commentBtn' disableRipple>
                                            <span className="fa-stack">
                                                <i className="fas fa-comment-alt fa-2x"></i>
                                                <i className="fas fa-plus fa-stack-1x fa-inverse"></i>
                                            </span>
                                            Comment
                                        </Button>
                                    </div>
                                    <p className='likes'>Appreciated 101 times.</p>
                                    <div className='tags'>
                                        <IconButton className='addTagBtn'>
                                            <Icon>add</Icon>
                                        </IconButton>
                                        <span className='tag'>
                                            <span className='votes'>125</span>
                                            <span className='title'>Marketing</span>
                                        </span>
                                        <span className='tag'>
                                            <span className='votes'>125</span>
                                            <span className='title'>Marketing</span>
                                        </span>
                                        <span className='tag'>
                                            <IconButton className='voteBtn'>
                                                <Icon>add</Icon>
                                            </IconButton>
                                            <span className='title'>Marketing</span>
                                        </span>
                                        <span className='tag'>
                                            <IconButton className='voteBtn'>
                                                <Icon>add</Icon>
                                            </IconButton>
                                            <span className='title'>Marketing</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </Grid>
                <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                    <div className='columnRightContent'>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

export default NewsFeed;