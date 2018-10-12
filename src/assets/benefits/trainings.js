import React from 'react'

export default ({ width, height, fill, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" style={style || {}} viewBox="0 0 40 24" width={width || 40} height={height || 24}>
        <title>cursuri</title>
        <g id="Layer_2" data-name="Layer 2">
            <g id="OBJECTS">
                <path fill={fill || "#000000"} d="M36.87,15.18V9.62L40,8.52,20,0,0,8.52l7.79,2.75v8.37C7.79,22.47,14.07,24,20,24c5.59,0,11.51-1.36,12.14-3.9h.09V11.27L36,9.93v5.25a1.07,1.07,0,0,0-.59,1,1.08,1.08,0,0,0,.15.53,1.06,1.06,0,0,0-.15.53v5.26h2V17.21a1.06,1.06,0,0,0-.15-.53,1.07,1.07,0,0,0-.43-1.5Z"/>
            </g>
        </g>
    </svg>
);