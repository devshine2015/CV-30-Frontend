import ImageUploader from './component';
import { compose, withState, withHandlers, pure } from 'recompose';

const ImageUploaderHOC = compose(
    withState('activeTab', 'setActiveTab', 'upload'),
    withHandlers({
        handleTabChange: ({ setActiveTab }) => (event, value) => {
            setActiveTab(value);
        }
    }),
    pure
);
export default ImageUploaderHOC(ImageUploader);