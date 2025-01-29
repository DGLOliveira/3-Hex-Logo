import { useState, useEffect } from 'react';
import './style.css';

export default function SVG({
    theme,
    animation,
    ANIMATIONS,
    COLOR_SCHEME }) {

    const [keyframe, setKeyframe] = useState("");

    useEffect(() => {
        if (animation === ANIMATIONS[1]) {
            setKeyframe("spin");
        } else if (animation === ANIMATIONS[2]) {
            setKeyframe("spin-stop");
        } else if (animation === ANIMATIONS[3]) {
            setKeyframe("center-in-one-by-one");
        } else if (animation === ANIMATIONS[4]) {
            setKeyframe("center-in-simultaneous");
        } else if (animation === ANIMATIONS[5]) {
            setKeyframe("center-in-out-simultaneous");
        } else {
            setKeyframe("");
        }
    }, [animation]);

    return (
        <div id="SVG">
            <svg className={keyframe} width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/*<filter id="additive">
                <feBlend in="SourceGraphic" in2="SourceGraphic" mode="screen" />
            </filter>*/}
                <path className="hex hex1" filter="url(#additive)" d="M41.9859 107.577L112 67.1547L182.014 107.577V188.423L112 228.845L41.9859 188.423V107.577Z" fill={COLOR_SCHEME[theme].primary[0]} stroke={COLOR_SCHEME[theme].outline} stroke-width="4" />
                <path className="hex hex2" filter="url(#additive)" d="M217.986 107.577L288 67.1547L358.014 107.577V188.423L288 228.845L217.986 188.423V107.577Z" fill={COLOR_SCHEME[theme].primary[1]} stroke={COLOR_SCHEME[theme].outline} stroke-width="4" />
                <path className="hex hex3" filter="url(#additive)" d="M129.986 258.577L200 218.155L270.014 258.577V339.423L200 379.845L129.986 339.423V258.577Z" fill={COLOR_SCHEME[theme].primary[2]} stroke={COLOR_SCHEME[theme].outline} stroke-width="4" />
                <path className="axis" d="M200 200L200 60" stroke={COLOR_SCHEME[theme].outline} stroke-width="4" />
                <path className="axis" d="M200 200L78.7564 270" stroke={COLOR_SCHEME[theme].outline} stroke-width="4" />
                <path className="axis" d="M200 200L321.244 270" stroke={COLOR_SCHEME[theme].outline} stroke-width="4" />
            </svg>
        </div>
    )
}