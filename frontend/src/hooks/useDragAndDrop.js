import { useState, useCallback } from 'react';

const useDragAndDrop = (initialItems, onMove) => {
  const [items, setItems] = useState(initialItems);

  // Handle drag end
  const handleDragEnd = useCallback((result) => {
    const { destination, source, draggableId } = result;

    // If dropped outside of droppable area or in same position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Rearranging within same list
    if (source.droppableId === destination.droppableId) {
      const listItems = [...items[source.droppableId]];
      const [movedItem] = listItems.splice(source.index, 1);
      listItems.splice(destination.index, 0, movedItem);
      
      setItems({
        ...items,
        [source.droppableId]: listItems
      });
      
      return;
    }

    // Moving from one list to another
    const sourceItems = [...items[source.droppableId]];
    const destItems = [...items[destination.droppableId]];
    const [movedItem] = sourceItems.splice(source.index, 1);
    
    // Update the item status
    const updatedItem = { ...movedItem, status: destination.droppableId };
    destItems.splice(destination.index, 0, updatedItem);
    
    // Update state
    setItems({
      ...items,
      [source.droppableId]: sourceItems,
      [destination.droppableId]: destItems
    });
    
    // Notify parent component
    if (onMove) {
      onMove(draggableId, source.droppableId, destination.droppableId);
    }
  }, [items, onMove]);

  return {
    items,
    setItems,
    handleDragEnd
  };
};

export default useDragAndDrop;