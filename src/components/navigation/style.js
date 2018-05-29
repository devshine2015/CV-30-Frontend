const style = {
    root: {
        display: 'flex',
        background: '#fff',
        padding: '10px 40px',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0px 2px 5px 1px rgba(120,118,120,0.3)',
        position: 'fixed'
    },

    brandImg: {
        width: 40,
        height: 40,
        borderRadius: '50%'
    },
    mainNavContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    navButton: {
        borderRadius: 20,
        margin: '0 10px',
        color: '#414141',
        textTransform: 'none',
        '&.active': {
            color: '#397DB9',
            background: '#F4F4F4'
        }
    },
    homeIcon: {
        marginRight: 10
    },
    profileButton: {
        borderRadius: 50,
        border: '2px solid #F4F4F4',
        padding: '5px',
        paddingRight: 15,
        textTransform: 'none'

    },
    avatar: {
        marginRight: 10
    },
    profileMenu: {
        color: 'red'
    }
};

export default style;