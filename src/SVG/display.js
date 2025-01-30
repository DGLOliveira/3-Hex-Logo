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
        } else if (animation === ANIMATIONS[6]) {
            setKeyframe("center-in-out-one-by-one");
        } else if (animation === ANIMATIONS[7]) {
            setKeyframe("center-in-rotate");
        }

        else {
            setKeyframe("");
        }
    }, [animation]);

    return (
        <div id="SVG">
            <svg className={keyframe} width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className="hex hex1" style={{ mixBlendMode: theme === "light" ? "multiply" : "screen" }} d="M41.0481 108.077L105 71.1547L168.952 108.077V181.923L105 218.845L41.0481 181.923V108.077Z" fill={COLOR_SCHEME[theme].primary[0]} stroke={COLOR_SCHEME[theme].outline} stroke-width="4" />
                <path className="hex hex2" style={{ mixBlendMode: theme === "light" ? "multiply" : "screen" }} d="M231.048 108.077L295 71.1547L358.952 108.077V181.923L295 218.845L231.048 181.923V108.077Z" fill={COLOR_SCHEME[theme].primary[1]} stroke={COLOR_SCHEME[theme].outline} stroke-width="4" />
                <path className="hex hex3" style={{ mixBlendMode: theme === "light" ? "multiply" : "screen" }} d="M136.048 273.077L200 236.155L263.952 273.077V346.923L200 383.845L136.048 346.923V273.077Z" fill={COLOR_SCHEME[theme].primary[2]} stroke={COLOR_SCHEME[theme].outline} stroke-width="4" />
                <path className="axis" d="M200 200L200 60" stroke={COLOR_SCHEME[theme].outline} stroke-width="4" />
                <path className="axis" d="M200 200L78.7564 270" stroke={COLOR_SCHEME[theme].outline} stroke-width="4" />
                <path className="axis" d="M200 200L321.244 270" stroke={COLOR_SCHEME[theme].outline} stroke-width="4" />
            </svg>
        </div>
    )
}