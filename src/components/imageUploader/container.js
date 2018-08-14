import ImageUploader from './component';
import { compose, withState, withHandlers, pure } from 'recompose';

const ImageUploaderHOC = compose(
    withState('activeTab', 'setActiveTab', 'gallery'),
    withHandlers({
        handleTabChange: ({ setActiveTab }) => (event, value) => {
            setActiveTab(value);
        }
    }),
    pure
);
export default ImageUploaderHOC(ImageUploader);