import { useState, useRef, useEffect } from 'react';
import faviconDark from './Assets/faviconDark.ico';
import faviconLight from './Assets/faviconLight.ico';
import './App.css';

const FRAME_RATE = 120;
const CANVAS_SIZE = 300;
const COLOR_SCHEME = {
  "light": {
    background: "#FFFFFF",
    outline: "#000000",
    primary: ["#FF00FF", "#FFFF00", "#00FFFF"],
    secondary: ["#FF0000", "#00FF00", "#0000FF"],
  },
  "dark": {
    background: "#000000",
    outline: "#FFFFFF",
    primary: ["#FF0000", "#00FF00", "#0000FF"],
    secondary: ["#FF00FF", "#FFFF00", "#00FFFF"]
  }
}
const ANIMATIONS = [
  "no animation",
  "spin",
  "spin & stop",
  "converge center"
]
function App() {
  const canvasRef = useRef(null);
  const [theme, setTheme] = useState("light");
  const [type, setType] = useState("canvas");
  const [frameCount, setFrameCount] = useState(0);
  const [animation, setAnimation] = useState(ANIMATIONS[0]);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [animationPauseFrame, setAnimationPauseFrame] = useState(0);
  const [hexagons, setHexagons] = useState({
    0: {
      position: {
        x: CANVAS_SIZE / 2 + Math.cos(-Math.PI * 5 / 6) * (CANVAS_SIZE + CANVAS_SIZE) / (4 * 2),
        y: CANVAS_SIZE / 2 + Math.sin(-Math.PI * 5 / 6) * (CANVAS_SIZE + CANVAS_SIZE) / (4 * 2)
      },
      size: (CANVAS_SIZE + CANVAS_SIZE) / (4 * 3),
      rotation: Math.PI / 6,
      color: COLOR_SCHEME[theme].primary[0]
    },
    1: {
      position: {
        x: CANVAS_SIZE / 2 + Math.cos(Math.PI * 2 / 3 - Math.PI * 5 / 6) * (CANVAS_SIZE + CANVAS_SIZE) / (4 * 2),
        y: CANVAS_SIZE / 2 + Math.sin(Math.PI * 2 / 3 - Math.PI * 5 / 6) * (CANVAS_SIZE + CANVAS_SIZE) / (4 * 2)
      },
      size: (CANVAS_SIZE + CANVAS_SIZE) / (4 * 3),
      rotation: Math.PI / 6,
      color: COLOR_SCHEME[theme].primary[1]
    },
    2: {
      position: {
        x: CANVAS_SIZE / 2 + Math.cos(Math.PI * 4 / 3 - Math.PI * 5 / 6) * (CANVAS_SIZE + CANVAS_SIZE) / (4 * 2),
        y: CANVAS_SIZE / 2 + Math.sin(Math.PI * 4 / 3 - Math.PI * 5 / 6) * (CANVAS_SIZE + CANVAS_SIZE) / (4 * 2)
      },
      size: (CANVAS_SIZE + CANVAS_SIZE) / (4 * 3),
      rotation: Math.PI / 6,
      color: COLOR_SCHEME[theme].primary[2]
    }
  });
  const [axisAngle, setAxisAngle] = useState({
    0: Math.PI * 5 / 6,
    1: Math.PI * 2 / 3 + Math.PI * 5 / 6,
    2: Math.PI * 4 / 3 + Math.PI * 5 / 6
  });


  const clearCanvas = (ctx) => {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }

  const drawHexagon = (ctx, hexagon) => {
    ctx.lineWidth = (CANVAS_SIZE * 2) / 100;
    ctx.strokeStyle = hexagon.outline;
    ctx.fillStyle = hexagon.color;
    for (let i = 0; i < 6; i++) {
      if (i === 0) {
        ctx.beginPath();
        ctx.moveTo(hexagon.position.x + Math.cos(i * Math.PI / 3 + hexagon.rotation) * hexagon.size, hexagon.position.y + Math.sin(i * Math.PI / 3 + hexagon.rotation) * hexagon.size);
      }
      else if (i === 5) {
        ctx.lineTo(hexagon.position.x + Math.cos(i * Math.PI / 3 + hexagon.rotation) * hexagon.size, hexagon.position.y + Math.sin(i * Math.PI / 3 + hexagon.rotation) * hexagon.size);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
      }
      else {
        ctx.lineTo(hexagon.position.x + Math.cos(i * Math.PI / 3 + hexagon.rotation) * hexagon.size, hexagon.position.y + Math.sin(i * Math.PI / 3 + hexagon.rotation) * hexagon.size);
      }
    };
  }

  const resetAnimations = () => {
    setHexagons({
      0: {
        position: {
          x: CANVAS_SIZE / 2 + Math.cos(-Math.PI * 5 / 6) * (CANVAS_SIZE + CANVAS_SIZE) / (4 * 2),
          y: CANVAS_SIZE / 2 + Math.sin(-Math.PI * 5 / 6) * (CANVAS_SIZE + CANVAS_SIZE) / (4 * 2)
        },
        size: (CANVAS_SIZE + CANVAS_SIZE) / (4 * 3),
        rotation: Math.PI / 6,
        color: COLOR_SCHEME[theme].primary[0]
      },
      1: {
        position: {
          x: CANVAS_SIZE / 2 + Math.cos(Math.PI * 2 / 3 - Math.PI * 5 / 6) * (CANVAS_SIZE + CANVAS_SIZE) / (4 * 2),
          y: CANVAS_SIZE / 2 + Math.sin(Math.PI * 2 / 3 - Math.PI * 5 / 6) * (CANVAS_SIZE + CANVAS_SIZE) / (4 * 2)
        },
        size: (CANVAS_SIZE + CANVAS_SIZE) / (4 * 3),
        rotation: Math.PI / 6,
        color: COLOR_SCHEME[theme].primary[1]
      },
      2: {
        position: {
          x: CANVAS_SIZE / 2 + Math.cos(Math.PI * 4 / 3 - Math.PI * 5 / 6) * (CANVAS_SIZE + CANVAS_SIZE) / (4 * 2),
          y: CANVAS_SIZE / 2 + Math.sin(Math.PI * 4 / 3 - Math.PI * 5 / 6) * (CANVAS_SIZE + CANVAS_SIZE) / (4 * 2)
        },
        size: (CANVAS_SIZE + CANVAS_SIZE) / (4 * 3),
        rotation: Math.PI / 6,
        color: COLOR_SCHEME[theme].primary[2]
      }
    });
    setAxisAngle({
      0: Math.PI * 5 / 6,
      1: Math.PI * 2 / 3 + Math.PI * 5 / 6,
      2: Math.PI * 4 / 3 + Math.PI * 5 / 6
    });
    setAnimationFrame(0);
    setAnimationPauseFrame(0);
    setFrameCount(0);
  };

  const drawAxis = (ctx) => {
    ctx.lineWidth = (CANVAS_SIZE * 2) / 200;
    ctx.strokeStyle = theme === "light" ? "black" : "white";
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(CANVAS_SIZE / 2, CANVAS_SIZE / 2);
      ctx.lineTo(CANVAS_SIZE / 2 + (CANVAS_SIZE / 3) * Math.cos(axisAngle[i]), CANVAS_SIZE / 2 + (CANVAS_SIZE / 3) * Math.sin(axisAngle[i]));
      ctx.stroke();
    }
  };

  const handleAnimation = () => {
    let newHexagons = {};
    let newAxisAngle = {};
    let deltaAngle = Math.PI / 120;
    let deltaConvergence = 1;
    let PAUSE_FRAMES = FRAME_RATE / 2;
    switch (animation) {
      // No Animation
      case ANIMATIONS[0]:
        break;
      // Spin Animation
      case ANIMATIONS[1]:
        Object.keys(hexagons).forEach((key, index) => {
          newHexagons[key] = {
            ...hexagons[key],
            position: {
              x: CANVAS_SIZE / 2 + Math.cos(index * Math.PI * 2 / 3 - Math.PI * 5 / 6 - deltaAngle * animationFrame) * (CANVAS_SIZE + CANVAS_SIZE) / (4 * 2),
              y: CANVAS_SIZE / 2 + Math.sin(index * Math.PI * 2 / 3 - Math.PI * 5 / 6 - deltaAngle * animationFrame) * (CANVAS_SIZE + CANVAS_SIZE) / (4 * 2)
            },
            rotation: hexagons[key].rotation + deltaAngle,
          };
        });
        setHexagons(newHexagons);
        Object.keys(axisAngle).forEach((key) => {
          newAxisAngle[key] = axisAngle[key] - deltaAngle;
        });
        setAxisAngle(newAxisAngle);
        setAnimationFrame(animationFrame + 1);
        break;
      // Spin and Stop Animation
      case ANIMATIONS[2]:
        if (0 < animationPauseFrame && animationPauseFrame < PAUSE_FRAMES) {
          setAnimationPauseFrame(animationPauseFrame + 1);
        }
        else if (animationPauseFrame === PAUSE_FRAMES) {
          setAnimationPauseFrame(0);
        }
        else if (animationPauseFrame === 0) {
          Object.keys(hexagons).forEach((key, index) => {
            newHexagons[key] = {
              ...hexagons[key],
              position: {
                x: CANVAS_SIZE / 2 + Math.cos(index * Math.PI * 2 / 3 - Math.PI * 5 / 6 - deltaAngle * animationFrame) * (CANVAS_SIZE + CANVAS_SIZE) / (4 * 2),
                y: CANVAS_SIZE / 2 + Math.sin(index * Math.PI * 2 / 3 - Math.PI * 5 / 6 - deltaAngle * animationFrame) * (CANVAS_SIZE + CANVAS_SIZE) / (4 * 2)
              },
              rotation: hexagons[key].rotation + deltaAngle,
            };
          });
          setHexagons(newHexagons);
          Object.keys(axisAngle).forEach((key) => {
            newAxisAngle[key] = axisAngle[key] - deltaAngle;
          });
          setAxisAngle(newAxisAngle);
          //Check stop condition, one axis must be pointed upwards
          //acursed floating point error is solved in a very dirty way
          let roundedCosAxisAngle = Math.round(Math.cos(newAxisAngle[0]) * 100);
          let roundedSinAxisAngle = Math.round(Math.sin(newAxisAngle[0]) * 100);
          if ((roundedCosAxisAngle === Math.round(Math.cos(Math.PI * 5 / 6) * 100) && roundedSinAxisAngle === Math.round(Math.sin(Math.PI * 5 / 6) * 100)) ||
            (roundedCosAxisAngle === Math.round(Math.cos(Math.PI * 2 / 3 + Math.PI * 5 / 6) * 100) && roundedSinAxisAngle === Math.round(Math.sin(Math.PI * 2 / 3 + Math.PI * 5 / 6) * 100)) ||
            (roundedCosAxisAngle === Math.round(Math.cos(Math.PI * 4 / 3 + Math.PI * 5 / 6) * 100) && roundedSinAxisAngle === Math.round(Math.sin(Math.PI * 4 / 3 + Math.PI * 5 / 6) * 100))) {
            setAnimationPauseFrame(animationPauseFrame + 1);
            setAnimationFrame(animationFrame + 1);
          } else {
            setAnimationFrame(animationFrame + 1);
          }
        }
        break;
      // Convergence Animation
      case ANIMATIONS[3]:
        /*Object.keys(hexagons).forEach((key, index) => {
          newHexagons[key] = {
            ...hexagons[key],
            position: {
              x: CANVAS_SIZE / 2 - deltaConvergence + Math.cos(index * Math.PI * 2 / 3 - Math.PI * 5 / 6 - deltaAngle) * (CANVAS_SIZE + CANVAS_SIZE) / (4 * 2),
              y: CANVAS_SIZE / 2 + Math.sin(index * Math.PI * 2 / 3 - Math.PI * 5 / 6 - deltaAngle) * (CANVAS_SIZE + CANVAS_SIZE) / (4 * 2)
            },
            rotation: hexagons[key].rotation,
          };
        });
        setHexagons(newHexagons);
        setAnimationFrame(animationFrame + 1);
        break;*/
      default:
        break;
    }
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

  //Changes favicon on theme change
  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    if (theme === "light") {
      link.href = faviconLight;
    }
    else {
      link.href = faviconDark;
    }
  }, [theme]);


  //Gets user current theme 
  useEffect(() => {
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? setTheme("dark")
      : setTheme("light");
  }, []);

  //Detects user theme change on browser

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
    event.matches ? setTheme("dark") : setTheme("light");
  });

  //Changes background and hexagon colors on theme change
  useEffect(() => {
    if (theme === "light") {
      document.getElementById("App").style.backgroundColor = "white";
    } else {
      document.getElementById("App").style.backgroundColor = "black";
    }
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
    //console.log(canvas);
    //const boundary = canvas.getBoundingClientRect();
    /*let center = {
      x: boundary.width / 2,
      y: boundary.height / 2
    }*/
    //let hexSize = 50;
    clearCanvas(ctx);
    Object.keys(hexagons).forEach((key) => {
      drawHexagon(ctx, hexagons[key]);

    })
    drawAxis(ctx);
    if (animation !== ANIMATIONS[0]) {
      handleAnimation();
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


  return (
    <div id="App">
      <select
        value={animation}
        onChange={(e) => {
          setAnimation(e.target.value);
          setAnimationPauseFrame(0);
        }}>
        {ANIMATIONS.map((animation) => {
          return <option key={animation} value={animation}>{animation}</option>
        })}
      </select>
      <button onClick={() => {
        resetAnimations();
      }}
      >reset</button>
      <button onClick={() => {
        if (theme === "light") {
          setTheme("dark");
        } else {
          setTheme("light");
        }
      }}>{theme}</button>
      <button onClick={() => {
        if (type === "canvas") {
          setType("css");
        } else {
          setType("canvas");
        }
      }}>{type}</button>
      <button onClick={() => {
        saveFile(canvasRef.current.getContext("2d"));
      }}
      >save</button>
      <canvas
        ref={canvasRef}
        id="canvas"
        height={CANVAS_SIZE}
        width={CANVAS_SIZE}

      />
    </div>
  );
}

export default App;
