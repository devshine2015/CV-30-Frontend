import React from 'react'

export default ({ width, height, fill, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" style={style || {}} viewBox="0 0 40.04 39.23" width={width || 40} height={height || 40}>
        <title>housing</title>
        <g id="Layer_2" data-name="Layer 2">
            <g id="OBJECTS">
                <polygon fill={fill || "#000000"} points="6.54 19.6 6.54 39.23 33.5 39.23 33.5 19.6 20.02 6.12 6.54 19.6"/>
                <polygon fill={fill || "#000000"} points="20.02 0 0 20.02 2.52 22.54 20.02 5.04 37.51 22.54 40.04 20.02 20.02 0"/>
            </g>
        </g>
    </svg>
);