const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext('2d');
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const saveBtn = document.getElementById("jsSave");
const userOwnColor = document.getElementById("jsSelect");
const selectColor = document.getElementById("selectColor");

const FILTER = "win16|win32|win64|macintel|mac|"; // pc 접속

const INITIAL_COLOR = "#2c2c2c";
const CANVAS_SIZE = 700;
// you want to use canvas, you should do to designate canvas's size
canvas.width = CANVAS_SIZE;
canvas.height =  CANVAS_SIZE;

// default
ctx.fillStyle = "white";
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
range.style.backgroundColor = INITIAL_COLOR;
ctx.lineWidth = 2.5;

let painting = false;
let filling = false;

///////////////////////////////////////////////////////
// double tap 구현
let bStartEvent = false;
let bMoveEvent = false;

htClickInfo = {
    sType : null,
    nX : -1,
    nY : -1,
    nTime : 0
}

const nDoubleTapDuration = 200;
const nTapThreshold = 5;
let oTapEventTimer = null;

function initClearInfo(){
    htClickInfo.sType = null;
}

function onStart(event){
    bStartEvent = true;
}

function onMove(evnet){
    if(!bStartEvent){
        return;
    }
    bMoveEvent = true;
}

function onEnd(event){
    const nX = evnet.changedTouches[0].pageX;
    const nY = event.changedTouches[0].pageY;
    const nTime = event.timeStamp;

    if(bStartEvent && !bMoveEvent){
        if(htClickInfo.sType =="tap" && (nTime - htClickInfo.nTime) <= nDoubleTapDuration){
            if((Math.abs(htClickInfo.nX - nX) <= nTapThreshold) && (Math.abs(htClickInfo.nY - nY) <= nTapThreshold)){
                // double tap
                clearTimeout(oTapEventTimer);
                selectColor.click();
                range.style.backgroundColor = ctx.strokeStyle;
            } else {
                oTapEventTimer = setTimeout(function(){
                    alert("Tap");
                }.bind(this), 300);
                htClickInfo.sType = "tap";
                htClickInfo.nX = nX;
                htClickInfo.nY =nY;
                htClickInfo.nTime = nTime;
            }
        } else {
            initClearInfo();
        }
        bStartEvent = false;
        bMoveEvent = false;
    }
}
///////////////////////////////////////////////////////

function stopPainting(){
    painting = false;
}

function startPainting(){
    painting = true;
}

function onMouseMove(event){
    const x = event.offsetX;
    const y = event.offsetY;
    if(!painting){
        ctx.beginPath();
        ctx.moveTo(x , y);
    } else {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

function handleColorClick(event){
    const color = event.target.style.backgroundColor;
    ctx.strokeStyle = color;
    ctx.fillStyle = color; 
    range.style.backgroundColor = color;
}

function handleRangeChange(event){
    const brushSize = event.target.value;
    ctx.lineWidth = brushSize;
}

function handleModeClick(){
    if(filling === true){
        filling = false;
        mode.innerText = "Fill";
    } else{
        filling = true;
        mode.innerText = "Paint";
    }
}

function handleCanvasClick(){
    if(filling){
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE); 
    }
}

function handleCM(event){
    event.preventDefault();
}

function handleSaveClick(){
    const image = canvas.toDataURL();
    const link = document.createElement("a");
    link.href = image;
    link.download = "👨🏻‍🎨Your Painting👨🏻‍🎨"
    link.click();
}

function handleColorSelect(event){
    selectColor.click();
    range.style.backgroundColor = ctx.strokeStyle;
}

function handleConveyColor(event){
    userOwnColor.style.backgroundColor = event.target.value;
    ctx.strokeStyle = event.target.value;
    ctx.fillStyle = event.target.value;
    range.style.backgroundColor = event.target.value;
}

if(navigator.platform){
    if(FILTER.indexOf(navigator.platform.toLowerCase()) < 0){
        if(canvas){
            canvas.addEventListener("touchmove", onMouseMove, false);
            canvas.addEventListener("touchstart", startPainting, false);
            canvas.addEventListener("touchend", stopPainting, false);
            canvas.addEventListener("touchcancel", stopPainting, false);
            canvas.addEventListener("click", handleCanvasClick, false);
        }
        userOwnColor.addEventListener("touchstart", this.onStart.bind(this), false);
        userOwnColor.addEventListener("touchmove", this.onMove.bind(this), false);
        userOwnColor.addEventListener("touchend", this.onEnd.bind(this), false);
    }
    else{
        if(canvas){
            canvas.addEventListener("mousemove", onMouseMove);
            canvas.addEventListener("mousedown", startPainting);
            canvas.addEventListener("mouseup", stopPainting);
            canvas.addEventListener("mouseleave", stopPainting);
            canvas.addEventListener("click", handleCanvasClick);
            canvas.addEventListener("contextmenu", handleCM);
        }
        userOwnColor.addEventListener("dblclick", handleColorSelect);               
    }
}

Array.from(colors).forEach(color => color.addEventListener("click", handleColorClick));

if(range){
    range.addEventListener("input", handleRangeChange);
}

if(mode){
    mode.addEventListener("click", handleModeClick);
}

if(saveBtn){
    saveBtn.addEventListener("click", handleSaveClick);
}

if(selectColor){
    selectColor.addEventListener("input", handleConveyColor);
}