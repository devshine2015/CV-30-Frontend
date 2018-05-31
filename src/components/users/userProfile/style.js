const style = {
    root: {
        paddingTop: 62
    },
    header: {
        background: 'linear-gradient(to right, #49525e 0%, #1f3947 100%)',
        padding: '15px 50px 20px'
    },
    headerLinks: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    userAvatar: {
        display: 'flex',
        paddingTop: 15,
        alignItems: 'center'
    },
    avatar: {
        width: 130,
        height: 130,
        marginRight: 20
    },
    avatarTexts: {
        color: '#fff'
    },
    headerName: {
        fontSize: '1.85rem',
        margin: 0,
        padding: 0,
        fontWeight: 'normal'
    },
    headerTitle: {
        fontSize: '1.25rem',
        fontWeight: 300,
        margin: 0,
        padding: 0
    },
    userLinks: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-start'
    },
    headerLink: {
        color: '#fff',
        background: 'none',
        fontSize: '0.9rem',
        textTransform: 'none',
        borderRadius: 0,
        '& > span:first-of-type': {
            paddingBottom: 8,
        },

        '&:hover': {
            background: 'none',
            '& > span:first-of-type': {
                paddingBottom: 6,
                borderBottom: '2px solid rgba(255,255,255, 0.75)'
            }
        },

        '&.active': {
            '& > span:first-of-type': {
                paddingBottom: 6,
                borderBottom: '2px solid rgba(255,255,255, 0.75)'
            }
        }
    },
    headerButton: {
        background: '#397db9',
        color: '#fff',
        fontSize: '0.9rem',
        textTransform: 'none',
        '&:hover': {
            background: '#3071ab'
        }
    },
    headerStories: {
        display: 'flex',
        marginTop: 50
    },
    storyContainer: {
        position: 'relative',
        cursor: 'pointer'
    },
    storyImg: {
        width: 200,
        height: 140
    },
    storyTitle: {
        position: 'absolute',
        bottom: 8,
        left: 4,
        right: 4,
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 5,
        textAlign: 'center'
    },
    headerSkills: {
        display: 'flex',
        marginTop: 50
    },
    skillsContainer: {
        '&:first-of-type': {
            marginBottom: 15
        }
    },
    headerSkillsTitle: {
        display: 'inline-flex',
        width: 100,
        fontSize: '0.9rem',
        marginRight: 30,
        '&:before': {
            content: '"|"',
            marginRight: 10,
            fontWeight: 'bold'
        }
    },
    softSkills: {
        color: '#73a9ff'
    },
    values: {
        color: '#c4a848'
    },
    chip: {
        background: 'none',
        borderRadius: 5,
        border: '1px solid',
        margin: 5,
        color: '#fff',
        textTransform: 'capitalize'
    },
    chipSkills: {
        borderColor: '#73a9ff'
    },
    chipValues: {
        borderColor: '#c4a848'
    },

    storySliderContainer: {
        display: 'flex',
        justifyContent: 'center'
    },
    storySliderControls: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    sliderDot: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: '#fff',
        opacity: 0.3,
        margin: '0 2px',
        cursor: 'pointer'
    },
    sliderDotActive: {
        opacity: 1
    },
    sliderArrow: {
        color: '#fff'
    },
    storiesSlider: {
        display: 'flex'
    },
    storyItem: {
        position: 'relative',
        display: 'none'
    },
    storyItemActive: {
        display: 'block'
    },

    //Media queries
    '@media (max-width: 600px)': {
        header: {
            padding: 15,
        },
        userAvatar: {
            justifyContent: 'center'
        },
        headerLinks: {
            flexDirection: 'column'
        },
        userLinks: {
            justifyContent: 'center',
            marginTop: 15
        },
        headerSkillsTitle: {
            display: 'block',
            width: '100%',
            marginBottom: 5
        },
        headerStories: {
            flexDirection: 'column'
        },
        storyImg: {
            width: 'auto',
            height: 'auto',
        },
        storyTitle: {
            left: 0,
            right: 0,
            bottom: 4
        }
    }
};

export default style;