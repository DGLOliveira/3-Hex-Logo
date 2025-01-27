import { useState, useRef, useEffect } from 'react';
import { clearCanvas, drawAxis, drawHexagon } from './draw';
import { resetAnimations, handleAnimation } from './animations';


const FRAME_RATE = 120;
const CANVAS_SIZE = 300;
const CANVAS_CENTER = CANVAS_SIZE / 2;
const LINE_WIDTH = CANVAS_SIZE / 100;
const HEXAGON_SIZE = CANVAS_SIZE / 6;
const HEXAGON_START_ROTATION = Math.PI / 6;
const HEXAGON_START_CENTER_DISTANCE = CANVAS_SIZE / 4;
const HEXAGON_START_ANGULAR_OFFSET = -Math.PI * 5 / 6;
export default function Canvas({ theme, animation, ANIMATIONS, COLOR_SCHEME }) {
  const canvasRef = useRef(null);
  const [frameCount, setFrameCount] = useState(0);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [animationPauseFrame, setAnimationPauseFrame] = useState(0);
  const [hexagons, setHexagons] = useState({
    0: {
      position: {
        x: CANVAS_CENTER + Math.cos(-Math.PI * 5 / 6) * HEXAGON_START_CENTER_DISTANCE,
        y: CANVAS_CENTER + Math.sin(-Math.PI * 5 / 6) * HEXAGON_START_CENTER_DISTANCE
      },
      size: HEXAGON_SIZE,
      rotation: HEXAGON_START_ROTATION,
      color: COLOR_SCHEME[theme].primary[0]
    },
    1: {
      position: {
        x: CANVAS_CENTER + Math.cos(Math.PI * 2 / 3 + HEXAGON_START_ANGULAR_OFFSET) * HEXAGON_START_CENTER_DISTANCE,
        y: CANVAS_CENTER + Math.sin(Math.PI * 2 / 3 + HEXAGON_START_ANGULAR_OFFSET) * HEXAGON_START_CENTER_DISTANCE
      },
      size: HEXAGON_SIZE,
      rotation: HEXAGON_START_ROTATION,
      color: COLOR_SCHEME[theme].primary[1]
    },
    2: {
      position: {
        x: CANVAS_CENTER + Math.cos(Math.PI * 4 / 3 + HEXAGON_START_ANGULAR_OFFSET) * HEXAGON_START_CENTER_DISTANCE,
        y: CANVAS_CENTER + Math.sin(Math.PI * 4 / 3 + HEXAGON_START_ANGULAR_OFFSET) * HEXAGON_START_CENTER_DISTANCE
      },
      size: HEXAGON_SIZE,
      rotation: HEXAGON_START_ROTATION,
      color: COLOR_SCHEME[theme].primary[2]
    }
  });
  const [axisAngle, setAxisAngle] = useState({
    0: Math.PI * 5 / 6,
    1: Math.PI * 2 / 3 + Math.PI * 5 / 6,
    2: Math.PI * 4 / 3 + Math.PI * 5 / 6
  });

    let props ={ 
      axisAngle, 
      setAxisAngle, 
      hexagons,
      setHexagons, 
      animation, 
      ANIMATIONS, 
      COLOR_SCHEME, 
      theme, 
      CANVAS_SIZE, 
      CANVAS_CENTER, 
      LINE_WIDTH,
      HEXAGON_SIZE,
      HEXAGON_START_ROTATION,
      HEXAGON_START_CENTER_DISTANCE,
      HEXAGON_START_ANGULAR_OFFSET,
      animationFrame, 
      setAnimationFrame, 
      animationPauseFrame, 
      setAnimationPauseFrame, 
      FRAME_RATE,
      frameCount, 
      setFrameCount, 
    };

  //Download the image
  const saveFile = (ctx) => {
    let downloadLink = document.createElement("a");
    downloadLink.setAttribute("download", "hexagon.png");
    let dataURL = ctx.canvas.toDataURL("image/png");
    let url = dataURL.replace(
      /^data:image\/png/,
      "data:application/octet-stream",
    );
    downloadLink.setAttribute("href", url);
    downloadLink.click();
  };

  //Changes background and hexagon colors on theme change
  useEffect(() => {
    Object.keys(hexagons).forEach((key) => {
      hexagons[key].color = COLOR_SCHEME[theme].primary[key];
      hexagons[key].outline = COLOR_SCHEME[theme].outline;
      setHexagons(hexagons);
    })
  }, [theme]);

  //Handles the canvas
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    const canvas = canvasRef.current;
    if (theme === "light") {
      ctx.globalCompositeOperation = "darken";
    }
    else {
      ctx.globalCompositeOperation = "lighten";
    }
    clearCanvas(ctx, CANVAS_SIZE);
    Object.keys(hexagons).forEach((key) => {
      drawHexagon(ctx, hexagons[key], props);
    })
    drawAxis(ctx, props);
    if (animation !== ANIMATIONS[0]) {
      handleAnimation(props);
      setTimeout(() => {
        setFrameCount(frameCount + 1);
      }, [1000 / FRAME_RATE]);
    }
    let animationFrameId;
    const render = () => {
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };

  }, [theme, animation, frameCount]);

    return(<>
        <button onClick={() => {
          resetAnimations(props);
        }}
        >reset</button>
        <button onClick={() => {
          saveFile(canvasRef.current.getContext("2d"));
        }}
        >save</button>
        <div
        style={{color: theme==="light" ? "black" : "white" }}>
          {"Active Frames: "}{animationFrame}
          <br/>
          {"Pause Frames:" }{animationPauseFrame}
          </div>
        <canvas
          ref={canvasRef}
          id="canvas"
          height={CANVAS_SIZE}
          width={CANVAS_SIZE}
  
        /></>
    );
}