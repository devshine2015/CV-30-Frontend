import React from 'react';
import { Grid, Hidden } from '@material-ui/core';

import DesktopNav from './desktop';
import MobileNav from './mobile';

const Navigation = props => {
    return (
        <Grid container className='mainNav' >
            <Hidden smDown>
                <DesktopNav {...props} />
            </Hidden>
            <Hidden mdUp>
                <MobileNav {...props} />
            </Hidden>
        </Grid>
    );
};

export default Navigation;