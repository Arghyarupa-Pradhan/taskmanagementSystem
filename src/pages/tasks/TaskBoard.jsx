import { useState } from "react"; 
import { useTasks } from "../../hooks"; 
import { TASK_STATUS } from "../../constants"; 
import Button from "../../components/Button"; 
import Loader from "../../components/Loader"; 
import "./TaskBoard.css";
 


export default function TaskBoard() { 
  const { tasks, loading, addTask, editTask, removeTask } = useTasks(); 
 
  const [newRows, setNewRows] = useState([]); // [{ tempId, title }] 
  const [editingId, setEditingId] = useState(null); 
  const [editingTitle, setEditingTitle] = useState(""); 
  // const [note, setNote] = useState("");
 
  function handleAddRow() {
  setNewRows((rows) => [
    ...rows,
    {
      tempId: `new-${Date.now()}`,
      title: "",
      dueDate: "",
    },
  ]);
}
 
  function handleNewRowChange(tempId, value) { 
    setNewRows((rows) => 
      rows.map((r) => (r.tempId === tempId ? { ...r, title: value } : r)) 
    ); 
  } 

 function handleNewRowDateChange(tempId, value) {
  setNewRows((rows) =>
    rows.map((r) =>
      r.tempId === tempId
        ? { ...r, dueDate: value }
        : r
    )
  );
}
  function handleSaveNewRow(tempId) {
  const row = newRows.find((r) => r.tempId === tempId);

  if (!row || !row.title.trim()) return;

  addTask({
    title: row.title.trim(),
    status: TASK_STATUS.TODO,
    dueDate: row.dueDate,
  });

  setNewRows((rows) =>
    rows.filter((r) => r.tempId !== tempId)
  );
}
 
  function handleCancelNewRow(tempId) { 
    setNewRows((rows) => rows.filter((r) => r.tempId !== tempId)); 
  } 
 
  function handleToggleComplete(task) { 
    editTask(task.id, { 
      status: task.status === TASK_STATUS.DONE ? TASK_STATUS.TODO : TASK_STATUS.DONE, 
    }); 
  } 
 
  function startEdit(task) { 
    setEditingId(task.id); 
    setEditingTitle(task.title); 
  } 
 
  function saveEdit(task) { 
    if (editingTitle.trim()) { 
      editTask(task.id, { title: editingTitle.trim() }); 
    } 
    setEditingId(null); 
    setEditingTitle(""); 
  } 
 
  function cancelEdit() { 
    setEditingId(null); 
    setEditingTitle(""); 
  } 
 
  if (loading) { 
    return ( 
      <div className="page-loader"> 
        <Loader label="Loading tasks…" /> 
      </div> 
    ); 
  } 
 
  return ( 
    <div className="page"> 
      <div className="page__header"> 
        <h1>Tasks</h1> 
        <Button onClick={handleAddRow}>+ Add</Button> 
      </div> 
 
      <div className="task-list"> 
        {tasks.map((task) => { 
          const isEditing = editingId === task.id; 
          const isDone = task.status === TASK_STATUS.DONE; 
 
          return ( 
            <div className={`task-row${isDone ? " task-row--done" : ""}`} key={task.id}> 
              <input 
                className="task-row__input" 
                value={isEditing ? editingTitle : task.title} 
                readOnly={!isEditing} 
                onChange={(e) => setEditingTitle(e.target.value)} 
                onKeyDown={(e) => { 
                  if (!isEditing) return; 
                  if (e.key === "Enter") saveEdit(task); 
                  if (e.key === "Escape") cancelEdit(); 
                }} 
              /> 
 
              <input 
                type="checkbox" 
                className="task-row__checkbox" 
                checked={isDone} 
                onChange={() => handleToggleComplete(task)} 
                aria-label={isDone ? "Mark task incomplete" : "Mark task complete"} 
              /> 
 
              {isEditing ? ( 
                <> 
                  <Button variant="ghost" onClick={() => saveEdit(task)}>Save</Button> 
                  <Button variant="ghost" onClick={cancelEdit}>Cancel</Button> 
                </> 
              ) : ( 
                <Button
  variant="ghost"
  className="task-icon-btn task-edit-btn"
  onClick={() => startEdit(task)}
  aria-label="Edit task"
  title="Edit task"
>
  ✎
</Button>
              )} 
 
             <Button
  variant="danger"
  className="task-icon-btn task-delete-btn"
  onClick={() => removeTask(task.id)}
  aria-label="Delete task"
  title="Delete task"
>
  🗑
</Button>
            </div> 
          ); 
        })} 
 
        {newRows.map((row) => ( 
          <div className="task-row task-row--new" key={row.tempId}> 
            <input 
              className="task-row__input" 
              autoFocus 
              placeholder="Type a new task…" 
              value={row.title} 
              onChange={(e) => handleNewRowChange(row.tempId, e.target.value)} 
              onKeyDown={(e) => { 
                if (e.key === "Enter") handleSaveNewRow(row.tempId); 
                if (e.key === "Escape") handleCancelNewRow(row.tempId); 
              }} 

            /> 
            <input
      type="date"
      className="task-row__date"
      value={row.dueDate || ""}
      onChange={(e) =>
        handleNewRowDateChange(
          row.tempId,
          e.target.value
        )
      }
    />
            <input type="checkbox" className="task-row__checkbox" disabled /> 
            <Button onClick={() => handleSaveNewRow(row.tempId)}>Save</Button> 
            <Button variant="ghost" onClick={() => handleCancelNewRow(row.tempId)}> 
              Cancel 
            </Button> 
          </div> 
        ))} 
 
        {tasks.length === 0 && newRows.length === 0 && ( 
          <p className="task-list__empty">No tasks yet. Click “+ Add” to create one.</p> 
        )} 
      </div> 
      

    </div>
  );
}
     