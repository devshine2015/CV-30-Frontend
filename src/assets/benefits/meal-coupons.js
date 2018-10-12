import React from 'react'

export default ({ width, height, fill, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" style={style || {}} viewBox="0 0 39.9 25.72" width={width || 40} height={height || 26}>
        <title>bonuri de masa</title>
        <g id="Layer_2" data-name="Layer 2">
            <g id="OBJECTS">
                <path fill={fill || "#000000"} d="M11.69,0V3.52H9.35V0H0V8.88A4.13,4.13,0,0,1,4.11,13,4.12,4.12,0,0,1,0,17.13v8.59H9.35V22.2h2.34v3.52H39.9V0Zm0,18.32H9.35V14.8h2.34Zm0-7.4H9.35V7.4h2.34Zm7.53-2.78A3.75,3.75,0,1,1,23,11.9,3.75,3.75,0,0,1,19.22,8.14Zm3.9,13.22,7.17-17,2.16.91-7.17,17Zm9.77-.05a3.75,3.75,0,1,1,3.75-3.75A3.75,3.75,0,0,1,32.89,21.31Z"/>
            </g>
        </g>
    </svg>
);