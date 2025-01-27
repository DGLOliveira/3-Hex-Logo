
  export const resetAnimations = (props) => {
    Object.keys(props.hexagons).forEach((key) => {
      props.hexagons[key] = {
        position: {
          x: props.CANVAS_CENTER + Math.cos(key * Math.PI * 2 / 3 + props.HEXAGON_START_ANGULAR_OFFSET) * props.HEXAGON_START_CENTER_DISTANCE,
          y: props.CANVAS_CENTER + Math.sin(key * Math.PI * 2 / 3 + props.HEXAGON_START_ANGULAR_OFFSET) * props.HEXAGON_START_CENTER_DISTANCE
        },
        size: props.HEXAGON_SIZE,
        rotation: props.HEXAGON_START_ROTATION,
        color: props.COLOR_SCHEME[props.theme].primary[key]
      };
    });
    props.setHexagons(props.hexagons);
    props.setAxisAngle({
      0: Math.PI * 5 / 6,
      1: Math.PI * 2 / 3 + Math.PI * 5 / 6,
      2: Math.PI * 4 / 3 + Math.PI * 5 / 6
    });
    props.setAnimationFrame(0);
    props.setAnimationPauseFrame(0);
    props.setFrameCount(0);
  };
  
  export function handleAnimation(props) {
    const {
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
      setFrameCount
    } = props;
    let newHexagons = {};
    let newAxisAngle = {};
    let deltaAngle = Math.PI / 120;
    let deltaConvergence = CANVAS_SIZE / 720;
    let convergenceTarget = CANVAS_SIZE / 12;
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
              x: CANVAS_CENTER + Math.cos(index * Math.PI * 2 / 3 + HEXAGON_START_ANGULAR_OFFSET - deltaAngle * animationFrame) * HEXAGON_START_CENTER_DISTANCE,
              y: CANVAS_CENTER + Math.sin(index * Math.PI * 2 / 3 + HEXAGON_START_ANGULAR_OFFSET - deltaAngle * animationFrame) * HEXAGON_START_CENTER_DISTANCE
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
            hexagons[key] = {
              ...hexagons[key],
              position: {
                x: CANVAS_CENTER + Math.cos(index * Math.PI * 2 / 3 + HEXAGON_START_ANGULAR_OFFSET - deltaAngle * animationFrame) * HEXAGON_START_CENTER_DISTANCE,
                y: CANVAS_CENTER + Math.sin(index * Math.PI * 2 / 3 + HEXAGON_START_ANGULAR_OFFSET - deltaAngle * animationFrame) * HEXAGON_START_CENTER_DISTANCE
              },
              rotation: hexagons[key].rotation + deltaAngle,
            };
          });
          setHexagons(hexagons);
          Object.keys(axisAngle).forEach((key) => {
            axisAngle[key] = axisAngle[key] - deltaAngle;
          });
          setAxisAngle(axisAngle);
          //Check stop condition, one axis must be pointed upwards
          //acursed floating point error is solved in a very dirty way
          let roundedCosAxisAngle = Math.round(Math.cos(axisAngle[0]) * 100);
          let roundedSinAxisAngle = Math.round(Math.sin(axisAngle[0]) * 100);
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
      // Convergence One by One Animation
      case ANIMATIONS[3]:
        let convergenceTime = Math.abs(Math.round((convergenceTarget-HEXAGON_START_CENTER_DISTANCE)/deltaConvergence));
        let targetHexagon = 0;
        if(HEXAGON_START_CENTER_DISTANCE-deltaConvergence*animationFrame > convergenceTarget){
          hexagons[targetHexagon] = {
            ...hexagons[targetHexagon],
            position:{
              x: CANVAS_CENTER + Math.cos(targetHexagon * Math.PI * 2 / 3 + HEXAGON_START_ANGULAR_OFFSET) * (HEXAGON_START_CENTER_DISTANCE-deltaConvergence*animationFrame),
              y: CANVAS_CENTER + Math.sin(targetHexagon * Math.PI * 2 / 3 + HEXAGON_START_ANGULAR_OFFSET) * (HEXAGON_START_CENTER_DISTANCE-deltaConvergence*animationFrame)
            }
          };
          setAnimationFrame(animationFrame + 1);
        }
        else if(HEXAGON_START_CENTER_DISTANCE-deltaConvergence*animationFrame <= convergenceTarget && animationPauseFrame< PAUSE_FRAMES){
          setAnimationPauseFrame(animationPauseFrame + 1);
        }
        else if(HEXAGON_START_CENTER_DISTANCE-deltaConvergence*(animationFrame-convergenceTime) > convergenceTarget){
          targetHexagon = 1;
          hexagons[targetHexagon] = {
            ...hexagons[targetHexagon],
            position:{
              x: CANVAS_CENTER + Math.cos(targetHexagon * Math.PI * 2 / 3 + HEXAGON_START_ANGULAR_OFFSET) * (HEXAGON_START_CENTER_DISTANCE-deltaConvergence*(animationFrame-convergenceTime)),
              y: CANVAS_CENTER + Math.sin(targetHexagon * Math.PI * 2 / 3 + HEXAGON_START_ANGULAR_OFFSET) * (HEXAGON_START_CENTER_DISTANCE-deltaConvergence*(animationFrame-convergenceTime))
            }
          };
          setAnimationFrame(animationFrame + 1);
        }else if(HEXAGON_START_CENTER_DISTANCE-deltaConvergence*(animationFrame-convergenceTime) <= convergenceTarget && animationPauseFrame< 2*PAUSE_FRAMES){
          setAnimationPauseFrame(animationPauseFrame + 1);
        }else if(HEXAGON_START_CENTER_DISTANCE-deltaConvergence*(animationFrame-convergenceTime*2) > convergenceTarget){
          targetHexagon = 2;
          hexagons[targetHexagon] = {
            ...hexagons[targetHexagon],
            position:{
              x: CANVAS_CENTER + Math.cos(targetHexagon * Math.PI * 2 / 3 + HEXAGON_START_ANGULAR_OFFSET) * (HEXAGON_START_CENTER_DISTANCE-deltaConvergence*(animationFrame-convergenceTime*2)),
              y: CANVAS_CENTER + Math.sin(targetHexagon * Math.PI * 2 / 3 + HEXAGON_START_ANGULAR_OFFSET) * (HEXAGON_START_CENTER_DISTANCE-deltaConvergence*(animationFrame-convergenceTime*2))
            }
          };
          setAnimationFrame(animationFrame + 1);
        }else if(HEXAGON_START_CENTER_DISTANCE-deltaConvergence*(animationFrame-convergenceTime*2) <= convergenceTarget && animationPauseFrame< 3*PAUSE_FRAMES){
          setAnimationPauseFrame(animationPauseFrame + 1);
        }else{
          resetAnimations(props);
        }
        break;
      //Center in Simultaneous Animation
      case ANIMATIONS[4]:
        if(HEXAGON_START_CENTER_DISTANCE-deltaConvergence*animationFrame > convergenceTarget){
        Object.keys(hexagons).forEach((key) => {
          hexagons[key].position = {
            x: CANVAS_CENTER + Math.cos(key * Math.PI * 2 / 3 + HEXAGON_START_ANGULAR_OFFSET) * (HEXAGON_START_CENTER_DISTANCE-deltaConvergence*animationFrame),
            y: CANVAS_CENTER + Math.sin(key * Math.PI * 2 / 3 + HEXAGON_START_ANGULAR_OFFSET) * (HEXAGON_START_CENTER_DISTANCE-deltaConvergence*animationFrame)
          };
        });
        setHexagons(hexagons);
        setAnimationFrame(animationFrame + 1);
      }
      else if(animationFrame < 4*FRAME_RATE){
        setAnimationFrame(animationFrame + 1);
      }
      else{
        setAnimationFrame(0);
      }
        break;
        // Center in and out Simultaneous Animation
      case ANIMATIONS[5]:
        if(HEXAGON_START_CENTER_DISTANCE-deltaConvergence*animationFrame > convergenceTarget){
        Object.keys(hexagons).forEach((key) => {
          hexagons[key].position = {
            x: CANVAS_CENTER + Math.cos(key * Math.PI * 2 / 3 + HEXAGON_START_ANGULAR_OFFSET) * (HEXAGON_START_CENTER_DISTANCE-deltaConvergence*animationFrame),
            y: CANVAS_CENTER + Math.sin(key * Math.PI * 2 / 3 + HEXAGON_START_ANGULAR_OFFSET) * (HEXAGON_START_CENTER_DISTANCE-deltaConvergence*animationFrame)
          };
        });
        setHexagons(hexagons);
        setAnimationFrame(animationFrame + 1);
      }
      else if(animationFrame < 4*FRAME_RATE){
        setAnimationFrame(animationFrame + 1);
      }
      else if(convergenceTarget+deltaConvergence*(animationFrame-4*FRAME_RATE) < HEXAGON_START_CENTER_DISTANCE){
        Object.keys(hexagons).forEach((key) => {
          hexagons[key].position = {
            x: CANVAS_CENTER + Math.cos(key * Math.PI * 2 / 3 + HEXAGON_START_ANGULAR_OFFSET) * (convergenceTarget+deltaConvergence*(animationFrame-4*FRAME_RATE)),
            y: CANVAS_CENTER + Math.sin(key * Math.PI * 2 / 3 + HEXAGON_START_ANGULAR_OFFSET) * (convergenceTarget+deltaConvergence*(animationFrame-4*FRAME_RATE))
          };
        });
        setHexagons(hexagons);
        setAnimationFrame(animationFrame + 1);
      }
      else{
        setAnimationFrame(0);
      }
        break;
      default:
        break;
    }
  };