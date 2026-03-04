const ctxSlot = slotCanvas.getContext("2d");
const slotSymbols = ["??","??","?","7??"];
function drawSlot(canvas,result){
    ctxSlot.clearRect(0,0,canvas.width,canvas.height);
    for(let i=0;i<3;i++){
        ctxSlot.font = "48px Arial";
        ctxSlot.fillStyle = "#ffcc00";
        ctxSlot.fillText(slotSymbols[result[i]],50+i*150,120);
    }
}