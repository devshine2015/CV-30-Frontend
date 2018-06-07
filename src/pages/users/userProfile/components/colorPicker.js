import React from 'react';
import { Popover, Button, Tab, Tabs } from '@material-ui/core';

const ColorPicker = (props) => {
    const { colorPickerAnchor, onClose, availableColors, setColor } = props;
    const value = 0;
    return (
        <Popover
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            open={Boolean(colorPickerAnchor)}
            anchorEl={colorPickerAnchor}
            onClose={onClose}
            classes={{
                paper: 'colorPickerPaper'
            }}
        >
            <div className='popupHeader'>
                <Tabs value={value} onChange={this.handleChange} classes={{ root: 'tabsRoot' }}>
                    <Tab label="Colors" />
                    <Tab label="Patterns" />
                </Tabs>
                <Button size='small' className='picUploadButton'>
                    Upload picture
                </Button>
            </div>
            <div className='colorsContainer'>
                {
                    availableColors.map((color, index) => <Button className='color' style={{ background: color.style }} key={`colorPicker-${index}`}></Button>)
                }
            </div>
        </Popover>
    );
}

export default ColorPicker;