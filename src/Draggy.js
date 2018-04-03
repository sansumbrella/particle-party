class DragManager {
  constructor(parentElement) {
    this.dragTarget = null;
    parentElement.addEventListener("mouseup", () => {});
    parentElement.addEventListener("mouseleave", () => {});
  }

  onMouseDown(event) {
    console.log("start drag", this, event);
    this.dragging = true;
  }

  onMouseUp(event) {
    if (this.dragging) {
      console.log("end drag", this, event);
      this.dragging = false;
    }
  }

  onMouseMove(event) {
    if (this.dragging) {
    }
  }
}

// const manager = new DragManager();

export const Draggable = Component => {
  return props => {
    return <Component onMouseDown={} {...props} />;
  };
};
