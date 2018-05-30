const style = {
    root: {
        display: 'flex',
        background: '#fff',
        padding: '5px 40px',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0px 2px 5px 1px rgba(120,118,120,0.3)',
        position: 'fixed',
        zIndex: 1
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
        margin: 3,
        background: '#f4f4f4',
        marginTop: 20,
        width: 250,
        border: '1px solid #cacaca',
        borderRadius: 8,
        '&:after': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 14,
            right: 100,
            width: 10,
            height: 10,
            background: '#f4f4f4',
            borderRight: '1px solid #cacaca',
            borderTop: '1px solid #cacaca',
            transform: 'rotate(-45deg)'
        }
    },
    popperClose: {
        pointerEvents: 'none',
        display: 'none'
    },

    companiesContainer: {
        background: '#fff',
        borderTop: '1px solid #ebebeb',
        borderBottom: '1px solid #ebebeb'
    },
    companiesContainerTitle: {
        position: 'relative',
        display: 'block',
        fontSize: 12,
        color: '#8b8b8b',
        padding: '12px 16px 0'
    },
    notificationsButton: {
        marginRight: 10
    },
    notificationsMenu: {
        margin: 3,
        background: '#f4f4f4',
        marginTop: 20,
        width: 450,
        border: '1px solid #cacaca',
        borderRadius: 8,
        '&:after': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 14,
            right: 47,
            width: 10,
            height: 10,
            background: '#f4f4f4',
            borderRight: '1px solid #cacaca',
            borderTop: '1px solid #cacaca',
            transform: 'rotate(-45deg)'
        }
    },
    notificationItem: {
        height: 'auto',
        '&:not(:last-child)': {
            borderBottom: '2px solid #e8e8e8'
        }
    },
    notificationAvatar: {
        width: 50,
        height: 50,
        marginRight: 15
    },
    notificationBody: {
    },
    notificationMessage: {
        margin: 0,
        padding: 0,
        fontSize: '0.875rem',
        color: '#777777'
    },
    notificationElapsed: {
        margin: 0,
        padding: 0,
        fontSize: '0.75rem',
        color: '#969696'
    },

    mobileNavContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },

    //Media queries 

    '@media (max-width: 960px)': {
        root: {
            padding: '5px 20px'
        },
        notificationsMenu: {
            width: 420,
            '&:after': {
                right: 70
            }
        }
    },

    '@media (max-width: 600px)': {
        root: {
            padding: '5px 15px'
        },
        notificationsMenu: {
            width: 250,
            '&:after': {
                right: 69
            }
        }
    },
};

export default style;