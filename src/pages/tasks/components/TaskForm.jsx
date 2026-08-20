import { useState } from "react";
import Button from "../../../components/Button";
import { useTasks } from "../../../hooks";

export default function TaskForm({ initialTask, onSubmit, onCancel }) {
  const { teamMembers, addTeamMember } = useTasks();

  const [form, setForm] = useState({
    employeeName: initialTask?.employeeName || "",
    taskName: initialTask?.taskName || "",
    time: initialTask?.time || "",
    note: initialTask?.note || "",
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleEmployeeChange(e) {
    const { value } = e.target;

    if (value === "__add_new__") {
      const name = window.prompt("Enter the new person's name:");

      if (name === null) return;

      const trimmed = name.trim();

      if (!trimmed) {
        window.alert("Name can't be empty.");
        return;
      }

      addTeamMember(trimmed);

      setForm((prev) => ({
        ...prev,
        employeeName: trimmed,
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      employeeName: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};

    if (!form.employeeName.trim()) {
      newErrors.employeeName = "Employee name is required.";
    }

    if (!form.taskName.trim()) {
      newErrors.taskName = "Task name is required.";
    }

    if (!form.time) {
      newErrors.time = "Time is required.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="task-form">

      {/* Employee Name */}
      <label className="field">
        <span>Employee Name</span>

        <select
          name="employeeName"
          value={form.employeeName}
          onChange={handleEmployeeChange}
        >
          <option value="">Select employee</option>

          {teamMembers.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}

          <option value="__add_new__">
            + Add new person
          </option>
        </select>

        {errors.employeeName && (
          <span className="field__error">
            {errors.employeeName}
          </span>
        )}
      </label>

      {/* Task Name */}
      <label className="field">
        <span>Task Name</span>

        <input
          type="text"
          name="taskName"
          value={form.taskName}
          onChange={handleChange}
          placeholder="Enter task name"
        />

        {errors.taskName && (
          <span className="field__error">
            {errors.taskName}
          </span>
        )}
      </label>

      {/* Time */}
      <label className="field">
        <span>Time</span>

        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
        />

        {errors.time && (
          <span className="field__error">
            {errors.time}
          </span>
        )}
      </label>

      {/* Note */}
      <label className="field">
        <span>Note</span>

        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          rows={3}
          placeholder="Enter task note"
        />
      </label>

      {/* Buttons */}
      <div className="task-form__actions">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button type="submit">
          {initialTask ? "Save changes" : "Create task"}
        </Button>
      </div>

    </form>
  );
}