import { useState, useEffect } from 'react';
import Canvas from './Canvas/canvas.js';
import faviconDark from './Assets/faviconDark.ico';
import faviconLight from './Assets/faviconLight.ico';
import './App.css';

const COLOR_SCHEME = {
  "light": {
    background: "#FFFFFF",
    outline: "#808080",
    primary: ["#FF00FF", "#00FFFF", "#FFFF00",]
  },
  "dark": {
    background: "#000000",
    outline: "#808080",
    primary: ["#FF0000", "#00FF00", "#0000FF"]
  }
}
const ANIMATIONS = [
  "No Animation",
  "Spin",
  "Spin & Stop",
  "Center In one by one",
  "Center In simultaneous",
  "Center In&Out simultaneous"
]
function App() {
  const [theme, setTheme] = useState("light");
  const [type, setType] = useState("canvas");
  const [animation, setAnimation] = useState(ANIMATIONS[0]);


  //Changes background and hexagon colors on theme change
  useEffect(() => {
    if (theme === "light") {
      document.getElementById("App").style.backgroundColor = "white";
    } else {
      document.getElementById("App").style.backgroundColor = "black";
    }
  }, [theme]);

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

  return (
    <div id="App">
      <button onClick={() => {
        if (theme === "light") {
          setTheme("dark");
        } else {
          setTheme("light");
        }
      }}>{theme}</button>
      <select
        value={animation}
        onChange={(e) => {
          setAnimation(e.target.value);
        }}>
        {ANIMATIONS.map((animation) => {
          return <option key={animation} value={animation}>{animation}</option>
        })}
      </select>
      <button onClick={() => {
        if (type === "canvas") {
          setType("css");
        } else {
          setType("canvas");
        }
      }}>{type}</button>
      {type === "canvas" ?
        <Canvas
          theme={theme}
          animation={animation}
          ANIMATIONS={ANIMATIONS}
          COLOR_SCHEME={COLOR_SCHEME}
        /> : null}
    </div>
  );
}

export default App;
