import React from 'react';
import { compose, pure, withState, withHandlers } from 'recompose';
import { IconButton, Icon } from '@material-ui/core';

const Slider = (props) => {
    const { children, title, prevItem, nextItem, jumpToItem, activeItem } = props;
    return (
        <div className='sliderContainer'>
            <div className='slides'>
                {
                    React.Children.map(children, (child, index) => {
                        return React.cloneElement(child, {
                            className: index === activeItem ? 'slideItem active' : 'slideItem'
                        })
                    })
                }
            </div>
            <div className='sliderControls'>
                {title}
                <IconButton className='sliderArrow' onClick={prevItem}>
                    <Icon>arrow_back_ios</Icon>
                </IconButton>
                {
                    children.map((item, index) => {
                        return (
                            <span
                                className={index === activeItem ? 'sliderDot active' : 'sliderDot'}
                                key={`sliderItem-${index}`}
                                onClick={() => jumpToItem(index)}>
                            </span>)
                    })
                }
                <IconButton className='sliderArrow' onClick={nextItem}>
                    <Icon>arrow_forward_ios</Icon>
                </IconButton>
            </div>
        </div>
    )
}

const SliderHOC = compose(
    withState('count', 'setCount', ({ children }) => (children.length)),
    withState('activeItem', 'setItem', 0),
    withHandlers({
        prevItem: ({ activeItem, setItem, count }) => () => {
            let prevStory = activeItem - 1 < 0 ? count : activeItem - 1;
            setItem(prevStory);
        },
        nextItem: ({ activeItem, setItem, count }) => () => {
            let nextStory = activeItem + 1 > count ? 0 : activeItem + 1;
            setItem(nextStory);
        },
        jumpToItem: ({ setItem }) => (story) => {
            setItem(story);
        }
    }),
    pure);

export default SliderHOC(Slider);