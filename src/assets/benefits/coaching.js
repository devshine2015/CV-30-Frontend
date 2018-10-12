import React from 'react'

export default ({ width, height, fill, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" style={style || {}} viewBox="0 0 31.85 40" width={width || 32} height={height || 40}>
        <title>coaching</title>
        <g id="Layer_2" data-name="Layer 2">
            <g id="OBJECTS">
                <path fill={fill || "#000000"} d="M24.82,21.4l-.31.28-.33.28-.71.53-5,10.3-1-5.93,1.48-2.39-.54.11a11.39,11.39,0,0,1-1.43.17c-.26,0-.53,0-.8,0a12.81,12.81,0,0,1-3-.36l1.51,2.44-.95,6L8.18,22c-.26-.2-.51-.42-.75-.64l-.1.09C-.11,27.86,0,39.12,0,39.6V40H31.85l0-.42C31.31,26.57,26.1,22.27,24.82,21.4Z"/>
                <path fill={fill || "#000000"} d="M16.16,0a12,12,0,1,0,12,12A12,12,0,0,0,16.16,0Z"/>
            </g>
        </g>
    </svg>
);