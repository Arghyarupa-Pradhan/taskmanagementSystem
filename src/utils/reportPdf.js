import { jsPDF } from "jspdf";

const MARGIN = 14;
const PAGE_WIDTH = 210; // A4 in mm
const PAGE_HEIGHT = 297;
const BOTTOM_LIMIT = PAGE_HEIGHT - 16;
const BOX_WIDTH = PAGE_WIDTH - MARGIN * 2;

const STATUS_DISPLAY = {
  todo: "PENDING",
  "in-progress": "IN PROGRESS",
  done: "COMPLETED",
};

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatDMY(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function formatTime(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  let hours = d.getHours();
  const minutes = pad2(d.getMinutes());
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

function newPageIfNeeded(doc, y, needed) {
  if (y + needed > BOTTOM_LIMIT) {
    doc.addPage();
    return 20;
  }
  return y;
}

/**
 * Draws one "TASK REPORT" bordered card for a single task and returns
 * the y position just below the card (with a gap for the next card).
 */
function drawTaskReportCard(doc, y, task, employeeName) {
  const innerX = MARGIN + 8;
  const contentWidth = BOX_WIDTH - 16;
  const lineH = 7;

  const descText = task.description && task.description.trim() ? task.description : "-";
  const descLines = doc.splitTextToSize(descText, contentWidth);

  // Estimate the card height up front so we know where to start it.
  let contentHeight = 12; // top padding
  contentHeight += 10; // "TASK REPORT" title + underline
  contentHeight += lineH + 3; // Employee Name
  contentHeight += lineH + 3; // Task Name
  contentHeight += lineH * 2 + 3; // Creation Date + Time
  contentHeight += lineH * 2 + 3; // Priority + Status
  contentHeight += lineH + descLines.length * 5.5; // Notes label + lines
  contentHeight += 10; // bottom padding

  y = newPageIfNeeded(doc, y, contentHeight + 10);
  const boxY = y;

  doc.setDrawColor(170);
  doc.setLineWidth(0.4);
  doc.roundedRect(MARGIN, boxY, BOX_WIDTH, contentHeight, 3, 3);

  let cy = boxY + 12;

  // Title, centered
  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  const title = "TASK REPORT";
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, MARGIN + BOX_WIDTH / 2 - titleWidth / 2, cy);
  doc.setFont(undefined, "normal");
  cy += 3;
  doc.setDrawColor(90);
  doc.line(innerX, cy, MARGIN + BOX_WIDTH - 8, cy);
  cy += 9;

  doc.setFontSize(11);
  doc.setTextColor(20);

  doc.text(`Employee Name: ${employeeName || "Unassigned"}`, innerX, cy);
  cy += lineH + 3;

  doc.text(`Task Name: ${task.title}`, innerX, cy);
  cy += lineH + 3;

  doc.text(`Creation Date: ${formatDMY(task.createdAt)}`, innerX, cy);
  cy += lineH;
  doc.text(`Time: ${formatTime(task.createdAt)}`, innerX, cy);
  cy += lineH + 3;

  doc.text(`Priority: ${(task.priority || "").toUpperCase()}`, innerX, cy);
  cy += lineH;
  doc.text(`Status: ${STATUS_DISPLAY[task.status] || task.status}`, innerX, cy);
  cy += lineH + 3;

  doc.text("Notes:", innerX, cy);
  cy += lineH;
  doc.text(descLines, innerX, cy);

  doc.setTextColor(0);
  return boxY + contentHeight + 10;
}

/**
 * Full combined report: summary stats, project completion, then one
 * Task Report card per task grouped by person, plus a compact all-tasks table.
 */
export function generateReportPdf({ stats, projectRows, personRows, tasks, projects }) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = 20;

  doc.setFontSize(18);
  doc.text("Taskline — Task Report", MARGIN, y);
  y += 6;
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Generated ${new Date().toLocaleString()}`, MARGIN, y);
  doc.setTextColor(0);
  y += 12;

  // ---- Summary stats ----
  doc.setFontSize(13);
  doc.text("Summary", MARGIN, y);
  y += 7;
  doc.setFontSize(10);
  doc.text(
    `Total: ${stats.total}    In progress: ${stats.inProgress}    Completed: ${stats.done}    Overdue: ${stats.overdue}`,
    MARGIN,
    y
  );
  y += 12;

  // ---- Project completion ----
  doc.setFontSize(13);
  doc.text("Project completion", MARGIN, y);
  y += 8;
  doc.setFontSize(10);
  if (projectRows.length === 0) {
    doc.text("No projects yet.", MARGIN, y);
    y += 8;
  } else {
    projectRows.forEach(({ project, total, done, overdue, rate }) => {
      y = newPageIfNeeded(doc, y, 8);
      const overdueText = overdue > 0 ? `  (${overdue} overdue)` : "";
      doc.text(`${project.name}: ${done}/${total} done — ${rate}%${overdueText}`, MARGIN, y);
      y += 6;
    });
    y += 6;
  }

  // ---- By person: one Task Report card per task ----
  y = newPageIfNeeded(doc, y, 14);
  doc.setFontSize(13);
  doc.text("By person", MARGIN, y);
  y += 10;

  personRows.forEach(({ name, personTasks, done, total }) => {
    y = newPageIfNeeded(doc, y, 10);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text(`${name} (${done}/${total} tasks done)`, MARGIN, y);
    doc.setFont(undefined, "normal");
    y += 8;

    if (personTasks.length === 0) {
      doc.setFontSize(10);
      doc.setTextColor(140);
      doc.text("No tasks assigned.", MARGIN, y);
      doc.setTextColor(0);
      y += 10;
    } else {
      personTasks.forEach((task) => {
        y = drawTaskReportCard(doc, y, task, name);
      });
    }
  });

  // ---- All tasks table (compact overview) ----
  y = newPageIfNeeded(doc, y, 14);
  doc.setFontSize(13);
  doc.text("All tasks — overview", MARGIN, y);
  y += 8;
  doc.setFontSize(9);

  const colX = { title: MARGIN, project: 70, assignee: 108, status: 140, due: 170 };
  doc.setFont(undefined, "bold");
  doc.text("Task", colX.title, y);
  doc.text("Project", colX.project, y);
  doc.text("Assignee", colX.assignee, y);
  doc.text("Status", colX.status, y);
  doc.text("Due", colX.due, y);
  doc.setFont(undefined, "normal");
  y += 2;
  doc.setDrawColor(200);
  doc.line(MARGIN, y, 196, y);
  y += 5;

  tasks.forEach((task) => {
    y = newPageIfNeeded(doc, y, 6);
    const project = projects.find((p) => p.id === task.projectId);
    const title = task.title.length > 26 ? `${task.title.slice(0, 25)}…` : task.title;
    doc.text(title, colX.title, y);
    doc.text(project?.name || "—", colX.project, y, { maxWidth: 34 });
    doc.text(task.assignee || "Unassigned", colX.assignee, y, { maxWidth: 30 });
    doc.text(STATUS_DISPLAY[task.status] || task.status, colX.status, y);
    doc.text(formatDMY(task.dueDate), colX.due, y);
    y += 6;
  });

  doc.save(`taskline-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}

/**
 * Single-person report: one Task Report card per task for that person.
 */
export function generatePersonPdf({ name, personTasks, done, total }) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = 20;

  doc.setFontSize(18);
  doc.text(`Taskline — ${name}`, MARGIN, y);
  y += 6;
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Generated ${new Date().toLocaleString()}`, MARGIN, y);
  doc.setTextColor(0);
  y += 10;

  doc.setFontSize(12);
  doc.text(`${done}/${total} tasks done`, MARGIN, y);
  y += 10;

  if (personTasks.length === 0) {
    doc.setFontSize(10);
    doc.setTextColor(140);
    doc.text("No tasks assigned.", MARGIN, y);
    doc.setTextColor(0);
  } else {
    personTasks.forEach((task) => {
      y = drawTaskReportCard(doc, y, task, name);
    });
  }

  const fileSafeName = name.replace(/\s+/g, "-").toLowerCase();
  doc.save(`taskline-${fileSafeName}-${new Date().toISOString().slice(0, 10)}.pdf`);
}
