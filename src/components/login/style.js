const styles = {
    root: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        height: '100%',
        backgroundImage: 'linear-gradient(to bottom, rgba(95, 155, 205, 0.75), rgba(95, 155, 205, 0.75)), url(http://www.businesselement.net/wp-content/uploads/2017/11/Office-Budget.jpg)'
    },

    roundedImage: {
        maxWidth: 60,
        maxHeight: 60,
        borderRadius: '50%',
        marginRight: 10
    },
    brand: {
        marginTop: 20,
        marginLeft: 20,
        fontSize: 20,
        color: 'white',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center'
    },

    loginContainer: {
        marginTop: 'auto',
        marginBottom: 'auto',
        justifyContent: 'space-evenly',
        alignItems: 'center'

    },
    loginMessages: {
        color: '#fff',
    },
    loginForm: {
        padding: 20
    },
    textField: {
        width: '100%',
        marginBottom: 30,
        fontSize: '20px'
    },
    loginButton: {
        width: '100%',
        height: 60,
        background: '#f7a944',
        color: '#fff',
        fontSize: 20
    },
    registerButton: {
        width: '100%',
        height: 60,
        color: '#fff',
        fontSize: 20
    },
    forgotPass: {
        marginTop: -20,
        marginBottom: 20,
        textAlign: 'right'
    },
    forgotLink: {
        fontSize: 13,
        textDecoration: 'none'
    },
    divSeparator: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        margin: '10px 0'
    },
    separatorHR: {
        width: '100%',
        border: '0.5px solid #aaa'
    },
    orText: {
        position: 'absolute',
        bottom: '0',
        width: '50px',
        textAlign: 'center',
        background: '#fff',
        top: '-15%'
    }
};

export default styles;