const ctxRoulette = rouletteCanvas.getContext("2d");
function drawRoulette(canvas,result){
    ctxRoulette.clearRect(0,0,canvas.width,canvas.height);
    ctxRoulette.fillStyle="#ffcc00";
    ctxRoulette.font="40px Arial";
    ctxRoulette.fillText("Roulette: "+result,50,120);
}