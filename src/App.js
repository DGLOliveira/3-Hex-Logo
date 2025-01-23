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
function App() {
  const canvasRef = useRef(null);
  const [theme, setTheme] = useState("light");
  const [type, setType] = useState("canvas");
  const [frameCount, setFrameCount] = useState(0);
  const [hexagons, setHexagons] = useState({});


  const drawBoard = (ctx) => {
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

  const drawAxis = (ctx) => {
    ctx.lineWidth = (CANVAS_SIZE * 2) / 200;
    ctx.strokeStyle = theme === "light" ? "black" : "white";
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(CANVAS_SIZE / 2, CANVAS_SIZE / 2);
      ctx.lineTo(CANVAS_SIZE / 2 + (CANVAS_SIZE / 3) * Math.cos(i * Math.PI * 2 / 3 + Math.PI * 5 / 6), CANVAS_SIZE / 2 + (CANVAS_SIZE / 3) * Math.sin(i * Math.PI * 2 / 3 + Math.PI * 5 / 6));
      ctx.stroke();
    }
  }

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
  if(theme === "light") {
    link.href = faviconLight;
  }
  else{
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
    drawBoard(ctx);
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
    Object.keys(hexagons).forEach((key) => {
      drawHexagon(ctx, hexagons[key]);

    })
    drawAxis(ctx);
    /*setTimeout(() => {
      setFrameCount(frameCount + 1);
    }, [1000 / FRAME_RATE]);*/
    let animationFrameId;
    const render = () => {
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };

  }, [theme, frameCount]);


  return (
    <div id="App">
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
