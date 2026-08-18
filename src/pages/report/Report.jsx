import { useEffect, useState } from "react";
import { useTasks, useAuth } from "../../hooks";
import { TASK_STATUS } from "../../constants";
import Loader from "../../components/Loader";
import Button from "../../components/Button";
import { jsPDF } from "jspdf";
import "./Report.css";

export default function Report() {
  // =========================
  // LOGGED-IN USER
  // =========================

  const { user } = useAuth();

  // =========================
  // TASKS
  // =========================

  const {
    tasks,
    loading,
    editTask,
  } = useTasks();

  // =========================
  // NOTE
  // =========================

  const [note, setNote] = useState("");

  // =========================
  // LOAD SAVED NOTE
  // =========================

  useEffect(() => {
    const savedNote = localStorage.getItem(
      "taskline_report_note"
    );

    if (savedNote) {
      setNote(savedNote);
    }
  }, []);

  // =========================
  // SAVE NOTE
  // =========================

  function handleSaveNote() {
    localStorage.setItem(
      "taskline_report_note",
      note
    );

    alert("Note saved successfully.");
  }

  // =========================
  // TOGGLE TASK
  // =========================

  function handleToggleTask(task) {
    const newStatus =
      task.status === TASK_STATUS.DONE
        ? TASK_STATUS.TODO
        : TASK_STATUS.DONE;

    editTask(task.id, {
      status: newStatus,
    });
  }

  // =========================
  // EXPORT PDF
  // =========================

  function handleExportPdf() {
    const doc = new jsPDF();

    const pageWidth =
      doc.internal.pageSize.getWidth();

    const pageHeight =
      doc.internal.pageSize.getHeight();

    const margin = 15;

    let y = 20;

    // =========================
    // EXPORT DATE
    // =========================

    const exportDate =
      new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

    // =========================
    // PDF TITLE
    // =========================

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");

    doc.text(
      "Taskline Report",
      margin,
      y
    );

    y += 12;

    // =========================
    // USER NAME
    // =========================

    doc.setFontSize(13);
    doc.setFont("helvetica", "normal");

    doc.text(
      `Name: ${user?.name || "User"}`,
      margin,
      y
    );

    y += 8;

    // =========================
    // DATE
    // =========================

    doc.text(
      `Date: ${exportDate}`,
      margin,
      y
    );

    y += 12;

    // =========================
    // LINE
    // =========================

    doc.line(
      margin,
      y,
      pageWidth - margin,
      y
    );

    y += 12;

    // =========================
    // TASKS HEADING
    // =========================

    doc.setFontSize(17);
    doc.setFont("helvetica", "bold");

    doc.text(
      "Tasks",
      margin,
      y
    );

    y += 10;

    // =========================
    // TASKS
    // =========================

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    if (tasks.length === 0) {
      doc.text(
        "No tasks available.",
        margin,
        y
      );

      y += 10;
    } else {
      tasks.forEach((task, index) => {
        // New page if required
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }

        // Numbered tasks
        const taskText = `${index + 1}. ${task.title}`;

        // Wrap long task names
        const taskLines =
          doc.splitTextToSize(
            taskText,
            pageWidth - margin * 2
          );

        taskLines.forEach((line) => {
          if (y > pageHeight - 20) {
            doc.addPage();
            y = 20;
          }

          doc.text(
            line,
            margin,
            y
          );

          y += 7;
        });

        // Space between tasks
        y += 3;
      });
    }

    // =========================
    // NOTES
    // =========================

    y += 8;

    if (y > pageHeight - 50) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(17);
    doc.setFont("helvetica", "bold");

    doc.text(
      "Notes",
      margin,
      y
    );

    y += 10;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    if (note.trim()) {
      const noteLines =
        doc.splitTextToSize(
          note,
          pageWidth - margin * 2
        );

      noteLines.forEach((line) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }

        doc.text(
          line,
          margin,
          y
        );

        y += 7;
      });
    } else {
      doc.text(
        "No notes added.",
        margin,
        y
      );
    }

    // =========================
    // PDF FOOTER
    // =========================

    const totalPages =
      doc.internal.getNumberOfPages();

    for (
      let page = 1;
      page <= totalPages;
      page++
    ) {
      doc.setPage(page);

      doc.setFontSize(9);
      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.text(
        `Taskline Report - Page ${page} of ${totalPages}`,
        margin,
        pageHeight - 10
      );
    }

    // =========================
    // DOWNLOAD PDF
    // =========================

    const safeName = (
      user?.name || "User"
    ).replace(
      /[^a-z0-9]/gi,
      "_"
    );

    const fileDate =
      new Date()
        .toLocaleDateString("en-IN")
        .replace(/\//g, "-");

    doc.save(
      `Taskline_Report_${safeName}_${fileDate}.pdf`
    );
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="page-loader">
        <Loader label="Loading report…" />
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="page">

      {/* =========================
          REPORT HEADER
      ========================= */}

      <div className="report-header">

        <div>
          <h1>Report</h1>

          <p className="report-user">
            <strong>
              {user?.name || "User"}
            </strong>
          </p>
        </div>

        <Button
          onClick={handleExportPdf}
        >
          ⬇ Export PDF
        </Button>

      </div>

      {/* =========================
          TASKS
      ========================= */}

      <div className="report-panel">

        <div className="report-panel__header">

          <h2>Tasks</h2>

          <span className="task-count">
            {tasks.length}{" "}
            {tasks.length === 1
              ? "task"
              : "tasks"}
          </span>

        </div>

        {tasks.length === 0 ? (

          <p className="report-empty">
            No tasks available.
          </p>

        ) : (

          <div className="report-task-list">

            {tasks.map((task) => {

              const isDone =
                task.status ===
                TASK_STATUS.DONE;

              return (
                <div
                  className={`report-task ${
                    isDone
                      ? "report-task--done"
                      : ""
                  }`}
                  key={task.id}
                >

                  <label className="report-task__left">

                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() =>
                        handleToggleTask(task)
                      }
                    />

                    <span>
                      {task.title}
                    </span>

                  </label>

                  <span
                    className={`report-task__status ${
                      isDone
                        ? "report-task__status--done"
                        : "report-task__status--todo"
                    }`}
                  >
                    {isDone
                      ? "Completed"
                      : "Incomplete"}
                  </span>

                </div>
              );

            })}

          </div>

        )}

      </div>

      {/* =========================
          NOTES
      ========================= */}

      <div className="report-panel report-notes">

        <h2>Notes</h2>

        <textarea
          className="report-notes__input"
          placeholder="Write your notes here..."
          value={note}
          onChange={(e) =>
            setNote(e.target.value)
          }
        />

        <div className="report-notes__actions">

          <Button
            onClick={handleSaveNote}
          >
            Save Note
          </Button>

        </div>

      </div>

    </div>
  );
}