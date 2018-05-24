const styles = {
    root: {
        display: 'flex',
        minHeight: '100%',
        flexDirection: 'column'
    },
    heading1: {
        fontSize: '4.25rem'
    },
    paragraph: {
        fontSize: '1.5rem',
        fontWeight: '300'
    },
    topNav: {
        display: 'flex',
        flexGrow: 1,
        backgroundImage: 'linear-gradient(to bottom, rgba(95, 155, 205, 0.75), rgba(95, 155, 205, 0.75)), url(http://www.businesselement.net/wp-content/uploads/2017/11/Office-Budget.jpg)',
        padding: 20,
        flexDirection: 'column',
        height: '100vh'
    },
    navContainer: {
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    roundedImage: {
        maxWidth: 60,
        maxHeight: 60,
        borderRadius: '50%',
        marginRight: 10
    },
    brand: {
        fontSize: '1.25rem',
        color: 'white',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center'
    },
    loginButton: {
        marginRight: 10,
        background: '#f7a944',
        color: '#fff',
        '&:hover': {
            background: '#c07a0d',
        }
    },
    headlineContainer: {
        margin: 'auto',
        color: '#fff',
        justifyContent: 'space-evenly'
    },
    featureRow: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 100
    },
    featureRowReverse: {
        flexDirection: 'row-reverse'
    },
    featureImageContainer: {

    },
    featureImage: {
        borderRadius: '50%',
        background: '#d8d8d8',
        width: '80%',
        paddingBottom: '80%',
        margin: 'auto'
    },
    featureHeading: {
        fontSize: '2.25rem',
        color: '#277dba'
    },
    featureText: {
        fontWeight: 300,
        color: '#9a9a9a'
    },

    storiesContainer: {
        display: 'flex',
        borderTop: '2px solid #b7d3e7',
        marginTop: 100,
        height: '80vh'
    },
    storiesSliderContainer: {
        padding: '2% 5%',
        background: '#f3f8fb'
    },
    storiesSliderTitle: {
        textTransform: 'uppercase',
        fontSize: '5rem',
        fontWeight: 'lighter',
        color: '#277dba'
    },
    slideTitle: {
        color: '#277dba',
        fontSize: '2.25rem'
    },
    slideText: {
        fontWeight: 300,
        color: '#9a9a9a'
    },
    sliderControls: {
        display: 'flex',
        alignItems: 'center'
    },
    sliderArrow: {
        background: 'none',
        color: '#277dba'
    },
    sliderDot: {
        width: 15,
        height: 15,
        borderRadius: '50%',
        background: '#dde1e4',
        margin: '0 5px'
    },
    sliderDotActive: {
        background: '#1b1b1b'
    },
    slideImage: {
        maxHeight: '100%',
        maxWidth: '100%',
        width: '100%',
        height: '100%'
    },
    footer: {
        display: 'flex',
        flexGrow: 1,
        backgroundImage: 'linear-gradient(to bottom, rgba(95, 155, 205, 0.75), rgba(95, 155, 205, 0.75)), url(http://www.businesselement.net/wp-content/uploads/2017/11/Office-Budget.jpg)',
        padding: 20,
        flexDirection: 'column',
        minHeight: '80vh'
    },
    footerContainer: {
        justifyContent: 'space-around',
        margin: 'auto',
        color: '#fff'
    },
    footerSignupButton: {
        width: '80%',
        display: 'block',
        margin: '30px auto 0',
        height: 60,
        background: '#f7a944',
        color: '#fff',
        fontSize: 20,
        '&:hover': {
            background: '#c07a0d',
        }
    },
    footerMenu: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

    },
    footerSocial: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    footerLinks: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    footerCopyright: {
        fontSize: 13,
        color: '#fff'
    },
    footerButton: {
        color: '#fff',
        fontSize: '1rem',
        '&:hover': {
            background: 'none',
            color: '#eee'
        }
    },
    footerSocialButton: {
        minWidth: 0,
        color: '#fff'
    }
};

export default styles;