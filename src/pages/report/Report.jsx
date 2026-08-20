import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import { jsPDF } from "jspdf";
import "./Report.css";

const API_URL = "https://taskmanagement-backend-4vwp.onrender.com/api"; // Replace with your backend API URL

export default function Report() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD REPORT
  // ==========================================

  useEffect(() => {
    loadReport();
  }, []);

  async function loadReport() {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/tasks/report`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error(
        "Failed to load report:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to load report."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // GROUP TASKS BY USER
  // ==========================================

  const groupedUsers = tasks.reduce(
    (groups, task) => {
      const user = task.user;

      if (!user) {
        return groups;
      }

      const userId = user._id || user.id;

      if (!groups[userId]) {
        groups[userId] = {
          id: userId,
          name: user.name || "Unknown User",
          email: user.email || "",
          tasks: [],
        };
      }

      groups[userId].tasks.push(task);

      return groups;
    },
    {}
  );

  const users = Object.values(groupedUsers);

  // ==========================================
  // EXPORT PDF
  // ONLY:
  // PROJECT
  // MODULE
  // ACTIVITY
  // ==========================================

  function handleExportPdf() {
    const doc = new jsPDF();

    const pageWidth =
      doc.internal.pageSize.getWidth();

    const pageHeight =
      doc.internal.pageSize.getHeight();

    const margin = 15;

    let y = 20;

    // ==========================================
    // PDF TITLE
    // ==========================================

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");

    doc.text(
      "Taskline Report",
      margin,
      y
    );

    y += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.text(
      `Generated: ${new Date().toLocaleString(
        "en-IN"
      )}`,
      margin,
      y
    );

    y += 12;

    doc.line(
      margin,
      y,
      pageWidth - margin,
      y
    );

    y += 12;

    // ==========================================
    // NO DATA
    // ==========================================

    if (users.length === 0) {
      doc.setFontSize(12);

      doc.text(
        "No tasks available.",
        margin,
        y
      );
    }

    // ==========================================
    // USERS
    // ==========================================

    users.forEach((user) => {
      if (y > pageHeight - 70) {
        doc.addPage();
        y = 20;
      }

      // ========================================
      // USER NAME
      // ========================================

      doc.setFontSize(17);
      doc.setFont("helvetica", "bold");

      doc.text(
        user.name,
        margin,
        y
      );

      y += 7;

      // ========================================
      // USER EMAIL
      // ========================================

      if (user.email) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");

        doc.text(
          user.email,
          margin,
          y
        );

        y += 10;
      }

      // ========================================
      // TASKS
      // ========================================

      user.tasks.forEach((task, index) => {
        if (y > pageHeight - 60) {
          doc.addPage();
          y = 20;
        }

        // ----------------------------------------
        // PROJECT
        // ----------------------------------------

        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");

        doc.text(
          "Project:",
          margin,
          y
        );

        doc.setFont("helvetica", "normal");

        const projectText =
          task.projectName || "-";

        doc.text(
          projectText,
          margin + 28,
          y
        );

        y += 7;

        // ----------------------------------------
        // MODULE
        // ----------------------------------------

        doc.setFont("helvetica", "bold");

        doc.text(
          "Module:",
          margin,
          y
        );

        doc.setFont("helvetica", "normal");

        const moduleText =
          task.module || "-";

        doc.text(
          moduleText,
          margin + 28,
          y
        );

        y += 7;

        // ----------------------------------------
        // ACTIVITY
        // ----------------------------------------

        doc.setFont("helvetica", "bold");

        doc.text(
          "Activity:",
          margin,
          y
        );

        doc.setFont("helvetica", "normal");

        const activityText =
          task.taskName || "-";

        const activityLines =
          doc.splitTextToSize(
            activityText,
            pageWidth - margin * 2 - 28
          );

        activityLines.forEach((line) => {
          doc.text(
            line,
            margin + 28,
            y
          );

          y += 6;
        });

        y += 5;

        // ----------------------------------------
        // SEPARATOR
        // ----------------------------------------

        doc.line(
          margin,
          y,
          pageWidth - margin,
          y
        );

        y += 8;
      });

      y += 5;
    });

    // ==========================================
    // FOOTER
    // ==========================================

    const totalPages =
      doc.internal.getNumberOfPages();

    for (
      let page = 1;
      page <= totalPages;
      page++
    ) {
      doc.setPage(page);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");

      doc.text(
        `Taskline Report - Page ${page} of ${totalPages}`,
        margin,
        pageHeight - 10
      );
    }

    // ==========================================
    // DOWNLOAD
    // ==========================================

    const date = new Date()
      .toLocaleDateString("en-IN")
      .replace(/\//g, "-");

    doc.save(
      `Taskline_Report_${date}.pdf`
    );
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="page-loader">
        <Loader label="Loading report..." />
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="page report-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="report-header">

        <h1>Report</h1>

        <Button
          onClick={handleExportPdf}
        >
          ↓ Export PDF
        </Button>

      </div>

      {/* =====================================
          REPORT CONTENT
      ===================================== */}

      <div className="report-content">

        {users.length === 0 ? (

          <p className="report-empty">
            No tasks available.
          </p>

        ) : (

          users.map((user) => (

            <div
              className="user-report"
              key={user.id}
            >

              {/* =================================
                  USER
              ================================= */}

              <div className="user-report__header">

                <div>

                  <h2>
                    {user.name}
                  </h2>

                  {user.email && (
                    <p>
                      {user.email}
                    </p>
                  )}

                </div>

              </div>

              {/* =================================
                  TASK LIST
              ================================= */}

              <div className="report-task-list">

                {user.tasks.map((task) => {

                  const taskId =
                    task._id || task.id;

                  return (

                    <div
                      className="report-task"
                      key={taskId}
                    >

                      <div className="report-task__content">

                        {/* =========================
                            PROJECT
                        ========================= */}

                        <div className="report-field">

                          <span className="report-field__label">
                            Project
                          </span>

                          <span className="report-field__value">
                            {task.projectName ||
                              "-"}
                          </span>

                        </div>

                        {/* =========================
                            MODULE
                        ========================= */}

                        <div className="report-field">

                          <span className="report-field__label">
                            Module
                          </span>

                          <span className="report-field__value">
                            {task.module ||
                              "-"}
                          </span>

                        </div>

                        {/* =========================
                            ACTIVITY
                        ========================= */}

                        <div className="report-field">

                          <span className="report-field__label">
                            Activity
                          </span>

                          <span className="report-field__value">
                            {task.taskName ||
                              "-"}
                          </span>

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

          ))
        )}

      </div>

    </div>
  );
}