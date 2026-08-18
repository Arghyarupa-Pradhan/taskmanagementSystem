import { useState } from "react";
import Button from "../../../components/Button";
import { PRIORITY_LABELS, STATUS_LABELS, TASK_PRIORITY, TASK_STATUS } from "../../../constants";
import { useTasks } from "../../../hooks";
import { validateTask } from "../../../utils/validators";

export default function TaskForm({ initialTask, projects, onSubmit, onCancel }) {
  const { teamMembers, addTeamMember } = useTasks();
  const [form, setForm] = useState({
    title: initialTask?.title || "",
    description: initialTask?.description || "",
    status: initialTask?.status || TASK_STATUS.TODO,
    priority: initialTask?.priority || TASK_PRIORITY.MEDIUM,
    projectId: initialTask?.projectId || projects[0]?.id || "",
    assignee: initialTask?.assignee || "",
    dueDate: initialTask?.dueDate || "",
  });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleAssigneeChange(e) {
    const { value } = e.target;
    if (value === "__add_new__") {
      const name = window.prompt("Enter the new person's name:");
      if (name === null) return; // cancelled
      const trimmed = name.trim();
      if (!trimmed) {
        window.alert("Name can't be empty.");
        return;
      }
      addTeamMember(trimmed);
      setForm((prev) => ({ ...prev, assignee: trimmed }));
      return;
    }
    setForm((prev) => ({ ...prev, assignee: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateTask(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="task-form">
      <label className="field">
        <span>Title</span>
        <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Write API docs" />
        {errors.title && <span className="field__error">{errors.title}</span>}
      </label>

      <label className="field">
        <span>Description</span>
        <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Optional details" />
      </label>

      <div className="task-form__row">
        <label className="field">
          <span>Status</span>
          <select name="status" value={form.status} onChange={handleChange}>
            {Object.values(TASK_STATUS).map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Priority</span>
          <select name="priority" value={form.priority} onChange={handleChange}>
            {Object.values(TASK_PRIORITY).map((p) => (
              <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="task-form__row">
        <label className="field">
          <span>Project</span>
          <select name="projectId" value={form.projectId} onChange={handleChange}>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Assigned to</span>
          <select name="assignee" value={form.assignee} onChange={handleAssigneeChange}>
            <option value="">Unassigned</option>
            {teamMembers.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
            <option value="__add_new__">+ Add new person…</option>
          </select>
        </label>
      </div>

      <div className="task-form__row">
        <label className="field">
          <span>Due date</span>
          <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
          {errors.dueDate && <span className="field__error">{errors.dueDate}</span>}
        </label>
      </div>

      <div className="task-form__actions">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initialTask ? "Save changes" : "Create task"}</Button>
      </div>
    </form>
  );
}
