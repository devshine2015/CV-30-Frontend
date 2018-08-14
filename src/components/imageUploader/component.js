import React from 'react';
import { Tab, Tabs, Modal } from '@material-ui/core';
import Gallery from './gallery';
import Uploader from './uploader';

const ImageUploader = ({ open, onClose, handleTabChange, activeTab }) => (
    <Modal
        open={open}
        classes={{
            root: 'modalRoot'
        }}
        onClose={onClose}
    >
        <div className='imageUploadPaper'>
            <div className='popupHeader'>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    classes={{
                        root: 'tabsContainer',
                        flexContainer: 'tabsFlexContainer',
                        indicator: 'tabIndicator'
                    }}
                >
                    <Tab
                        label="Choose from gallery"
                        value='gallery'
                        classes={{
                            root: 'tabItemRoot',
                            selected: 'tabItemSelected',
                            wrapper: 'tabItemWrapper',
                            label: 'tabItemLabel',
                            labelContainer: 'tabItemLabelContainer'
                        }}
                    />
                    <span className='tabOr'> OR </span>
                    <Tab
                        label="Upload a new picture"
                        value='upload'
                        classes={{
                            root: 'tabItemRoot',
                            selected: 'selected',
                            wrapper: 'tabItemWrapper',
                            label: 'tabItemLabel',
                            labelContainer: 'tabItemLabelContainer'
                        }}
                    />
                </Tabs>
            </div>
            <div className='popupBody'>
                {activeTab === 'gallery' && <Gallery />}
                {activeTab === 'upload' && <Uploader />}
            </div>
        </div>
    </Modal>
);

export default ImageUploader;