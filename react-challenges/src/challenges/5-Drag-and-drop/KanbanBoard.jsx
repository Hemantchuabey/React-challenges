import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// Initial tasks for two columns
const initialData = {
  columns: {
    todo: {
      id: "todo",
      title: "To Do",
      taskIds: ["t1", "t2", "t3"],
    },
    done: {
      id: "done",
      title: "Done",
      taskIds: ["t4", "t5"],
    },
  },
  tasks: {
    t1: { id: "t1", content: "Design login page" },
    t2: { id: "t2", content: "Build auth API" },
    t3: { id: "t3", content: "Write unit tests" },
    t4: { id: "t4", content: "Add analytics" },
    t5: { id: "t5", content: "Refactor card list" },
  },
  columnOrder: ["todo", "done"], // Order of columns
};

export default function KanbanBoard() {
  // React state for board data
  const [data, setData] = useState(initialData);

  // This function runs after a drag-and-drop action completes
  function onDragEnd(result) {
    // result contains info about source and destination of the drag
    const { destination, source, draggableId } = result;

    // If dropped outside any column or in the same spot, do nothing
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // Get source and destination columns
    const startCol = data.columns[source.droppableId];
    const endCol = data.columns[destination.droppableId];

    // Moving within the same column
    if (startCol === endCol) {
      // Copy the taskIds array
      const newTaskIds = Array.from(startCol.taskIds);
      // Remove the dragged task from its original position
      newTaskIds.splice(source.index, 1);
      // Insert the dragged task at its new position
      newTaskIds.splice(destination.index, 0, draggableId);

      // Create new column object
      const newCol = { ...startCol, taskIds: newTaskIds };
      // Update state with new column
      setData((prev) => ({
        ...prev,
        columns: { ...prev.columns, [newCol.id]: newCol },
      }));
      return;
    }

    // Moving between columns
    const startTaskIds = Array.from(startCol.taskIds);
    startTaskIds.splice(source.index, 1); // Remove from source
    const endTaskIds = Array.from(endCol.taskIds);
    endTaskIds.splice(destination.index, 0, draggableId); // Add to destination

    // Create new column objects
    const newStartCol = { ...startCol, taskIds: startTaskIds };
    const newEndCol = { ...endCol, taskIds: endTaskIds };

    // Update state with new columns
    setData((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      },
    }));
  }

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">KanbanBoard</h1>
      <p className="text-gray-600 mb-6">
        Drag cards to reorder or move between columns. Try keyboard: focus a card,
        press Space to lift, arrow keys to move, Space to drop.
      </p>
      {/* DragDropContext provides drag-and-drop context for children */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-8">
          {/* Render each column in order */}
          {data.columnOrder.map((colId) => {
            const column = data.columns[colId];
            return (
              // Droppable defines a drop area (here, each column)
              <Droppable droppableId={column.id} key={column.id}>
                {(provided, snapshot) => (
                  // provided.innerRef is a ref callback that must be attached to the droppable container
                  // It lets the library control the DOM node for drag-and-drop calculations
                  <div
                    ref={provided.innerRef}
                    // provided.droppableProps contains props that must be spread onto the droppable container
                    // These props enable drag-and-drop functionality
                    {...provided.droppableProps}
                    className={`bg-gray-50 rounded-2xl p-3 w-80 border border-gray-200 min-h-[40px] space-y-2`}
                  >
                    <h2 className="font-semibold mb-2">{column.title}</h2>
                    {/* Render each task as a draggable card */}
                    {column.taskIds.map((taskId, index) => {
                      const task = data.tasks[taskId];
                      return (
                        // Draggable makes each card draggable
                        <Draggable
                          draggableId={task.id}
                          index={index}
                          key={task.id}
                        >
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
                              className={`p-3 rounded-xl border bg-white shadow-sm focus:outline-none w-[90%] mx-auto my-2 ${
                                snapshot.isDragging ? "ring-2 ring-blue-500" : ""
                              }`}
                            >
                              {task.content}
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {/* provided.placeholder is a React element that maintains space in the list while dragging */}
                    {/* It prevents layout shift when you drag a card out of its position */}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}