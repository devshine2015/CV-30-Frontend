import React from 'react'

export default ({ width, height, fill, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" style={style || {}} viewBox="0 0 40 40.17" width={width || 40} height={height || 40}>
        <title>clinica privata</title>
        <g id="Layer_2" data-name="Layer 2">
            <g id="OBJECTS">
                <polygon fill={fill || "#000000"} points="40 14.56 34.78 5.53 25.21 11.05 25.21 0 14.79 0 14.79 11.05 5.21 5.53 0 14.56 9.57 20.08 0 25.61 5.21 34.64 14.79 29.11 14.79 40.17 25.21 40.17 25.21 29.12 34.78 34.64 40 25.61 30.43 20.08 40 14.56"/>
            </g>
        </g>
    </svg>
);