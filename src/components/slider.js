import React from 'react';
import { compose, pure, withState, withHandlers } from 'recompose';

const Slider = () => { }

const SliderHOC = compose(pure);

export default SliderHOC(Slider);