import React from 'react';
import { Tab, Tabs, Modal } from '@material-ui/core';
import { FormattedMessage } from 'react-intl'
import Gallery from './gallery';
import Uploader from './uploader';

const ImageUploader = ({
    open, id,
    onClose, onError, onSuccess, type,
    handleTabChange, activeTab, userId
}) => {
    return (
        <Modal
            open={open}
            classes={{
                root: 'modalRoot'
            }}
            onClose={onClose}
        >
            <div className='imageUploadPaper'>
                <div className='popupHeader'>
                    <FormattedMessage id="uploader.document" defaultMessage="Choose from gallery\nOR\nUpload a new document\nUpload a new picture" description="Uploader">
                        {(text) => (
                            <Tabs
                                value={activeTab}
                                onChange={handleTabChange}
                                classes={{
                                    root: 'tabsContainer',
                                    flexContainer: 'tabsFlexContainer',
                                    indicator: 'tabIndicator'
                                }}
                            >   {
                                    type !== 'cv' && 
                                        <Tab
                                            label={text.split("\n")[0]}
                                            value='gallery'
                                            classes={{
                                                root: 'tabItemRoot',
                                                selected: 'tabItemSelected',
                                                wrapper: 'tabItemWrapper',
                                                label: 'tabItemLabel',
                                                labelContainer: 'tabItemLabelContainer'
                                            }}
                                        />
                                }
                                {
                                    type !== 'cv' && 
                                    <Tab disabled label={text.split("\n")[1]} />
                                }
                                <Tab
                                    label={ type === 'cv'? text.split("\n")[2] : text.split("\n")[3]}
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
                        )}
                    </FormattedMessage>
                    
                </div>
                <div className='popupBody'>
                    {activeTab === 'gallery' && <Gallery onError={onError} onSuccess={onSuccess} onClose={onClose} />}
                    {activeTab === 'upload' && <Uploader onError={onError} onSuccess={onSuccess} id={id} onClose={onClose} type={type}  userId={userId}/>}
                </div>
            </div>
        </Modal>
    );
}

export default ImageUploader;