import React, { useState } from "react";
// Import drag-and-drop components from @hello-pangea/dnd
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// Flat array of tasks (single column)
const initialTasks = [
  { id: "t1", content: "Design login page" },
  { id: "t2", content: "Build auth API" },
  { id: "t3", content: "Write unit tests" },
  { id: "t4", content: "Add analytics" },
  { id: "t5", content: "Refactor card list" },
];

export default function KanbanBoard() {
  // React state for tasks array
  const [tasks, setTasks] = useState(initialTasks);

  // This function runs after a drag-and-drop action completes
  function onDragEnd(result) {
    // result contains info about source and destination of the drag
    const { destination, source } = result;
    // If dropped outside the list or in the same spot, do nothing
    if (!destination || destination.index === source.index) return;

    console.log("Drag result:", result);
    // Create a copy of the tasks array
    const updated = Array.from(tasks);
    console.log("updatedTask:", updated);
    // Remove the dragged item from its original position
    const [moved] = updated.splice(source.index, 1);
    // Insert the dragged item at its new position
    updated.splice(destination.index, 0, moved);
    // Update the state with the new order
    console.log("updatedTaskOnceMoreTime:", updated,moved);
    setTasks(updated);
  }

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Kanban</h1>
      <p className="text-gray-600 mb-6">
        Drag cards to reorder. Try keyboard: focus a card, press Space to lift,
        arrow keys to move, Space to drop.
      </p>
      {/* DragDropContext provides drag-and-drop context for children */}
      <DragDropContext onDragEnd={onDragEnd}>
        {/* Droppable defines a drop area (here, the single column) */}
        <Droppable droppableId="tasks">
          {(provided, snapshot) => (
            // provided.innerRef is a ref callback that must be attached to the droppable container
            // It lets the library control the DOM node for drag-and-drop calculations
            <div
              ref={provided.innerRef}
              // provided.droppableProps contains props that must be spread onto the droppable container
              // These props enable drag-and-drop functionality
              {...provided.droppableProps}
              className={`bg-gray-50 rounded-2xl p-3 w-[100%] border border-gray-200 min-h-[40px] space-y-2`}
            >
              {/* Render each task as a draggable card */}
              {tasks.map((task, index) => (
                // Draggable makes each card draggable
                <Draggable draggableId={task.id} index={index} key={task.id}>
                  {(provided, snapshot) => (
                    // provided.innerRef must be attached to the draggable element
                    // It lets the library control the DOM node for drag-and-drop calculations
                    <div
                      ref={provided.innerRef}
                      // provided.draggableProps must be spread onto the draggable element
                      // These props enable drag-and-drop functionality
                      {...provided.draggableProps}
                      // provided.dragHandleProps must be spread onto the element that acts as the drag handle
                      // Usually, you spread it on the whole card for simplicity
                      {...provided.dragHandleProps}
                      // snapshot contains info about the drag state (e.g., isDragging)
                      // You can use it to style the card while dragging
                      className={`p-3 rounded-xl border bg-white shadow-sm focus:outline-none w-[50%] mx-auto my-2 ${
                        snapshot.isDragging ? "ring-2 ring-blue-500" : ""
                      }`}
                    >
                      {task.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {/* provided.placeholder is a React element that maintains space in the list while dragging */}
              {/* It prevents layout shift when you drag a card out of its position */}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}