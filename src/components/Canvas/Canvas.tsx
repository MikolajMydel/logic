import Block from '../Block/Block';
import './Canvas.css'

let activeBlock: HTMLElement | null = null;

function grab(e: React.MouseEvent){
  const element = e.target as HTMLElement;
  if (element.classList.contains("block")) {
    activeBlock = element;
  }
}
function move(e: React.MouseEvent){
  if(activeBlock){
    let x = e.clientX - 50;
    let y = e.clientY - 30;
    activeBlock.style.left = x + 'px';
    activeBlock.style.top = y + 'px';
  }
}
function drop(e: React.MouseEvent){
    activeBlock = null;
}
const Canvas = () => {
  return (
    <div
      onMouseDown={(e) => grab(e)}
      onMouseMove={(e) => move(e)}
      onMouseUp={(e) => drop(e)}
      id="Canvas">
      <Block/>
        <Block/>
    </div>
  );
}

export default Canvas;
