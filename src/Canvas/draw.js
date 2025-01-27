
  export const clearCanvas = (ctx, CANVAS_SIZE) => {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }

  export const drawHexagon = (ctx, hexagon, props) => {
    ctx.lineWidth = props.LINE_WIDTH;
    ctx.strokeStyle = props.COLOR_SCHEME[props.theme].outline;
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

  export const drawAxis = (ctx, props) => {
    ctx.lineWidth = props.LINE_WIDTH;
    ctx.strokeStyle = props.COLOR_SCHEME[props.theme].outline;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(props.CANVAS_CENTER, props.CANVAS_CENTER);
      ctx.lineTo(props.CANVAS_CENTER + (props.CANVAS_SIZE / 3) * Math.cos(props.axisAngle[i]), props.CANVAS_CENTER + (props.CANVAS_SIZE / 3) * Math.sin(props.axisAngle[i]));
      ctx.stroke();
    }
  };