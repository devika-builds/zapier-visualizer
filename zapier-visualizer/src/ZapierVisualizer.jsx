import { useState, useCallback } from "react";

// ─── Colors (matches portfolio palette) ────────────────────────────────────
const C = {
  primary: "#1C5A9C",
  secondary: "#6A65A6",
  accent: "#FF6B9D",
  dark: "#0F1B2D",
  card: "#162038",
  darker: "#0a1220",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(255,107,157,0.35)",
  textLight: "#E8EDF4",
  textMuted: "#94A3B8",
  white: "#FFFFFF",
  triggerFill: "rgba(28,90,156,0.18)",
  triggerBorder: "#1C5A9C",
  filterFill: "rgba(180,83,9,0.18)",
  filterBorder: "#d97706",
  actionFill: "rgba(106,101,166,0.18)",
  actionBorder: "#6A65A6",
  endFill: "rgba(5,150,105,0.18)",
  endBorder: "#059669",
};

const APP_COLORS = {
  Typeform: "#262627", HubSpot: "#FF7A59", Gmail: "#EA4335",
  Asana: "#F06A6A", Slack: "#4A154B", "Google Calendar": "#4285F4",
  Calendly: "#006BFF", "Google Sheets": "#34A853", "Google Drive": "#4285F4",
  "Claude AI": "#D97706", Zapier: "#FF4A00", Notion: "#E2E8F0",
};

const APP_INIT = {
  Typeform: "TF", HubSpot: "HS", Gmail: "G", Asana: "As", Slack: "Sl",
  "Google Calendar": "GC", Calendly: "Ca", "Google Sheets": "GS",
  "Google Drive": "GD", "Claude AI": "AI", Zapier: "Zp", Notion: "No",
};

// ─── Workflow data ──────────────────────────────────────────────────────────
const WORKFLOWS = [
  {
    id: "lead-intake",
    title: "Lead Intake & CRM Sync",
    icon: "👥",
    summary: "Zero-touch lead capture. Form → CRM → email → task → Slack in under 30 seconds.",
    timeSaved: "3.5 hrs/week",
    roi: "94% faster response",
    apps: ["Typeform", "HubSpot", "Gmail", "Asana", "Slack"],
    complexity: "Intermediate",
    reliability: {
      retries: "Auto-retry 3× with exponential backoff",
      failures: "Failed steps notify #ops-alerts in Slack",
      monitoring: "Zapier task history + weekly success review",
    },
    nodes: [
      {
        id: "n1", type: "trigger", label: "New Form Submission", app: "Typeform",
        description: "Fires instantly via webhook when a prospect completes the intake form. No polling — sub-second response time.",
        dataUsed: ["Contact name", "Email address", "Company", "Inquiry type", "Timestamp"],
        timeSaved: "5 min per lead × 40 leads/week = 3.3 hrs eliminated",
        setupTime: "~20 min",
        detail: "The entry point of the entire workflow. Typeform sends a webhook payload to Zapier the moment the form is submitted.",
      },
      {
        id: "n2", type: "filter", label: "Filter: Business Email Only", app: "Zapier",
        description: "Checks for personal email domains (gmail, yahoo, hotmail, outlook). Personal emails stop here — prevents CRM pollution.",
        dataUsed: ["Email domain"],
        timeSaved: "Removes 15 min/week cleaning junk CRM entries",
        setupTime: "~5 min",
        detail: "Simple regex check on email domain. ~20% of submissions are personal emails — this filter keeps the pipeline clean automatically.",
      },
      {
        id: "n3", type: "action", label: "Create/Update HubSpot Contact", app: "HubSpot",
        description: "Uses email as unique identifier. Updates existing contact if found, creates new if not. Sets lead source and maps inquiry type to deal stage.",
        dataUsed: ["Full name", "Email", "Company", "Lead source: Web Form", "Inquiry → Deal stage"],
        timeSaved: "Replaces 4 min manual data entry per lead",
        setupTime: "~30 min (field mapping)",
        detail: "Built-in deduplication — never creates duplicate contacts. HubSpot contact URL is captured for downstream steps.",
      },
      {
        id: "n4", type: "action", label: "Send Personalized Welcome Email", app: "Gmail",
        description: "Sends a templated welcome email using the lead's first name and inquiry type. Sent from the executive's address within 30 seconds of submission.",
        dataUsed: ["First name (parsed)", "Inquiry type", "Executive email template"],
        timeSaved: "Replaces 3–5 min email drafting per lead",
        setupTime: "~15 min",
        detail: "Email template stored as a saved Gmail draft with {{first_name}} and {{inquiry_type}} variables. Response time drops from hours to seconds — measurable conversion impact.",
      },
      {
        id: "n5", type: "action", label: "Create Follow-up Task in Asana", app: "Asana",
        description: "Creates a task assigned to the sales rep, due in 24 hours. Task note includes full lead context and the HubSpot contact link.",
        dataUsed: ["Lead name", "Email", "Company", "HubSpot contact URL"],
        timeSaved: "Replaces 2 min task creation per lead",
        setupTime: "~20 min",
        detail: "Task title: 'Follow up: [Name] — [Company]'. HubSpot link in description for one-click context. Zero leads fall through the cracks.",
      },
      {
        id: "n6", type: "end", label: "Notify #leads Slack Channel", app: "Slack",
        description: "Posts a structured card to the team channel. Includes lead summary, HubSpot link, and inquiry type. Everyone is instantly informed.",
        dataUsed: ["Lead name", "Company", "Inquiry", "HubSpot URL"],
        timeSaved: "Eliminates manual team announcements (~5 min/week)",
        setupTime: "~10 min",
        detail: "Slack Block Kit message with action buttons. Replaces ad-hoc Slack messages with a consistent, rich format.",
      },
    ],
  },
  {
    id: "calendar-guard",
    title: "Executive Calendar Guard",
    icon: "🗓️",
    summary: "AI screens every meeting request, checks real availability, and replies with the right booking link — zero executive involvement.",
    timeSaved: "4 hrs/week",
    roi: "100% inbox-zero for scheduling",
    apps: ["Gmail", "Claude AI", "Google Calendar", "Calendly", "Google Sheets"],
    complexity: "Advanced",
    reliability: {
      retries: "Claude API retries 3× on timeout; falls back to manual review",
      failures: "Parser errors route to EA inbox with original email attached",
      monitoring: "Weekly accuracy audit vs. actual meeting outcomes",
    },
    nodes: [
      {
        id: "n1", type: "trigger", label: "Email Labeled 'meeting-request'", app: "Gmail",
        description: "A Gmail filter rule applies the label 'meeting-request' to emails with keywords: meeting, call, connect, discuss, intro. Zapier watches this label.",
        dataUsed: ["Sender email", "Subject line", "Email body", "Timestamp"],
        timeSaved: "Eliminates screening of ~15 requests/week",
        setupTime: "~15 min",
        detail: "Gmail filter + Zapier watch = reliable, low-latency trigger. No missed requests — label is applied server-side before Zapier sees it.",
      },
      {
        id: "n2", type: "action", label: "Extract Intent with Claude AI", app: "Claude AI",
        description: "Email body passed to Claude API. Returns: meeting type (intro/demo/check-in), urgency (1–5), requester company, and any proposed times — as JSON.",
        dataUsed: ["Email body", "Sender name", "Domain → company inference"],
        timeSaved: "3–5 min reading/categorizing per request",
        setupTime: "~45 min (prompt tuning)",
        detail: "Built with Zapier Webhooks → Claude API (API key stored in Zapier secrets, not an official Zapier app). Claude extracts structured data from unstructured email text, enabling all downstream routing decisions.",
      },
      {
        id: "n3", type: "filter", label: "Filter: During Focus Time?", app: "Zapier",
        description: "Checks if the proposed time falls in protected focus blocks (Mon–Wed 9am–12pm). If yes, sends a polite 'not available then' reply and stops.",
        dataUsed: ["Claude-extracted proposed time", "Focus block schedule"],
        timeSaved: "Protects 6 hrs/week of uninterrupted deep work",
        setupTime: "~20 min",
        detail: "Hardcoded time windows. Prevents accidental booking into the executive's most productive hours, automatically.",
      },
      {
        id: "n4", type: "action", label: "Check Real-Time Availability", app: "Google Calendar",
        description: "Queries free/busy API for the executive's calendar. Returns 3 available slots in the next 5 business days matching the required meeting duration.",
        dataUsed: ["Calendar ID", "Date range", "Meeting duration (from Claude)"],
        timeSaved: "Replaces 5–8 min of manual availability checking",
        setupTime: "~30 min",
        detail: "Google Calendar free/busy endpoint via Zapier. Respects buffer time preferences. Returns options, not a direct booking link.",
      },
      {
        id: "n5", type: "action", label: "Reply with Correct Calendly Link", app: "Calendly",
        description: "Sends personalized reply with the right Calendly booking link (15-min intro, 30-min check-in, or 60-min deep-dive) based on Claude's meeting type.",
        dataUsed: ["Meeting type (Claude)", "Requester first name", "Calendly link map"],
        timeSaved: "Replaces 3–5 min email drafting per request",
        setupTime: "~15 min",
        detail: "Three Calendly links stored as Zapier variables (intro_link, checkin_link, deepdive_link). A Zapier Lookup Table maps Claude's 'meeting_type' field to the right one. Reply is personalized with requester's first name.",
      },
      {
        id: "n6", type: "end", label: "Log to Meeting Request Tracker", app: "Google Sheets",
        description: "Appends a row: sender, company, type, urgency, date, response sent, booking status. Enables weekly reporting on scheduling patterns.",
        dataUsed: ["All extracted fields", "Response timestamp", "Calendly link sent"],
        timeSaved: "Eliminates manual logging (~10 min/week)",
        setupTime: "~10 min",
        detail: "Data foundation for optimizing the exec's schedule. % booked, avg response time, top meeting types — all available for monthly reviews.",
      },
    ],
  },
  {
    id: "expense-automation",
    title: "Expense Report Automation",
    icon: "💳",
    summary: "Receipt upload is the only human action required. AI extracts data, auto-approves small amounts, routes large ones for sign-off.",
    timeSaved: "2.5 hrs/week",
    roi: "Zero missed reimbursements",
    apps: ["Google Drive", "Claude AI", "Google Sheets", "Gmail"],
    complexity: "Intermediate",
    reliability: {
      retries: "Vision API retries 3× with 5-sec backoff",
      failures: "Low-confidence receipts (<90%) flagged to Manual Review sheet",
      monitoring: "Monthly reconciliation against submitted expense totals",
    },
    nodes: [
      {
        id: "n1", type: "trigger", label: "New File in /Receipts Folder", app: "Google Drive",
        description: "Fires when any image or PDF lands in the shared Receipts folder. Supports JPEG, PNG, PDF. Works for the executive and any team members who submit.",
        dataUsed: ["File name", "File URL", "Upload timestamp", "Uploader email"],
        timeSaved: "Starts automation instantly — no reminder emails needed",
        setupTime: "~10 min",
        detail: "Shared folder model means anyone on the team can submit expenses. Upload = done. No forms to fill, no emails to send.",
      },
      {
        id: "n2", type: "action", label: "Extract Receipt Data via Claude AI", app: "Claude AI",
        description: "Passes the receipt image to Claude Vision API. Extracts: vendor, amount, date, category, payment method, and flags personal vs. business.",
        dataUsed: ["Receipt image URL"],
        timeSaved: "2–3 min data entry × 30 receipts/week = 1–1.5 hrs",
        setupTime: "~1 hr (vision prompt tuning)",
        detail: "Built with Zapier Webhooks → Claude Vision API (API key in Zapier secrets). ~97% extraction accuracy across restaurant, hotel, airline, and software receipts. Ambiguous cases (<90% confidence) flagged for manual review queue.",
      },
      {
        id: "n3", type: "action", label: "Log to Expense Tracker Sheet", app: "Google Sheets",
        description: "Appends a row with all extracted data: date, vendor, amount, category, submitter, receipt link, and status 'Pending'. Conditional color-coding applied.",
        dataUsed: ["All Claude fields", "Submitter email", "Google Drive file link"],
        timeSaved: "Replaces all manual spreadsheet entry",
        setupTime: "~20 min",
        detail: "Sheet: Date | Vendor | Amount | Category | Submitter | Receipt | Status | Approved By | Reimbursement Date. Audit-ready by default.",
      },
      {
        id: "n4", type: "filter", label: "Filter: Amount > $500?", app: "Zapier",
        description: "Checks extracted amount against the $500 approval threshold. Under → auto-approved instantly. Over → routes to manager approval flow.",
        dataUsed: ["Extracted amount"],
        timeSaved: "Removes approval bottleneck on 80% of receipts",
        setupTime: "~5 min",
        detail: "Configurable threshold. 80% of expenses fall under $500 and are handled without any human involvement.",
      },
      {
        id: "n5", type: "action", label: "Send Manager Approval Request", app: "Gmail",
        description: "For amounts over $500: emails the approver with full details, receipt image, and one-click Approve/Reject buttons. Reminder sent after 48 hrs.",
        dataUsed: ["Expense details", "Receipt URL", "Approver email", "Sheet row link"],
        timeSaved: "Replaces 10 min of manual approval prep per large expense",
        setupTime: "~30 min",
        detail: "Approval buttons link to a simple form that auto-updates the Sheet. 48-hour escalation reminder built in. No chasing approvers manually.",
      },
      {
        id: "n6", type: "end", label: "Archive Receipt + Confirm to Submitter", app: "Google Drive",
        description: "Moves processed receipt to /Receipts/Processed/{Month}. Updates Sheet status. Sends a confirmation email to the submitter with their reimbursement timeline.",
        dataUsed: ["Drive file ID", "Sheet row ID", "Approval status"],
        timeSaved: "Eliminates manual filing and status updates",
        setupTime: "~15 min",
        detail: "End state: receipt archived, sheet updated, submitter informed. Full audit trail exists automatically. Finance loves this.",
      },
    ],
  },
  {
    id: "weekly-briefing",
    title: "Weekly Executive Briefing",
    icon: "📊",
    summary: "Every Friday at 4 PM, a full executive briefing compiles itself from Asana, Gmail, and AI synthesis — delivered to the exec's inbox automatically.",
    timeSaved: "3 hrs/week",
    roi: "100% brief delivery rate",
    apps: ["Zapier", "Asana", "Gmail", "Claude AI", "Google Drive"],
    complexity: "Advanced",
    reliability: {
      retries: "Each data source retries independently; partial data still generates brief",
      failures: "If Claude fails, raw data is emailed as fallback — exec never misses a Friday",
      monitoring: "Delivery confirmation logged each week with status badge",
    },
    nodes: [
      {
        id: "n1", type: "trigger", label: "Schedule: Every Friday 4:00 PM", app: "Zapier",
        description: "Time-based trigger fires every Friday at 4 PM. No external dependencies — fires reliably regardless of what else is happening.",
        dataUsed: ["Current timestamp", "Week date range (Mon–Fri)"],
        timeSaved: "Eliminates all manual report compilation (2–3 hrs/week)",
        setupTime: "~5 min",
        detail: "Zapier's built-in Schedule trigger. Auto-retry on failure. The week's data range is calculated dynamically from the trigger timestamp.",
      },
      {
        id: "n2", type: "action", label: "Pull Completed Tasks from Asana", app: "Asana",
        description: "Queries Asana for all tasks completed this week across the executive's projects. Returns task name, assignee, project, and completion time.",
        dataUsed: ["Project IDs", "Date range: Mon–Fri", "Completion status filter"],
        timeSaved: "Replaces 30 min manual task collection",
        setupTime: "~20 min",
        detail: "Asana API filter: completed_since=Monday, project_ids=[exec projects]. Results are grouped by project and passed to Claude.",
      },
      {
        id: "n3", type: "action", label: "Collect Email Highlights", app: "Gmail",
        description: "Gmail search for important emails this week: starred, from VIP list, or with subject keywords (urgent, action, decision). Returns top 10 results.",
        dataUsed: ["Gmail search query", "VIP sender list", "Star/importance labels"],
        timeSaved: "Replaces 20–30 min inbox scanning",
        setupTime: "~25 min",
        detail: "Search: 'after:{monday} (is:starred OR from:{vips} OR subject:(urgent|action|decision))'. Subjects + senders form the email section of the briefing.",
      },
      {
        id: "n4", type: "action", label: "Generate Briefing with Claude AI", app: "Claude AI",
        description: "All data passed to Claude. Returns structured briefing: wins of the week, open items, email priorities, and a recommended focus for next week.",
        dataUsed: ["Asana task list", "Gmail highlights", "Date range"],
        timeSaved: "Replaces 45 min synthesis and writing",
        setupTime: "~1 hr (prompt engineering)",
        detail: "Built with Zapier Webhooks → Claude API. Structured prompt returns markdown: Wins | Open Items | Email Priorities | Next Week Focus. Concise and scannable.",
      },
      {
        id: "n5", type: "action", label: "Create Google Doc Report", app: "Google Drive",
        description: "Creates a new Google Doc titled 'Briefing · [Date]' in the Executive folder. Formatted briefing pasted in. Shared with the executive.",
        dataUsed: ["Claude markdown output", "Current date", "Executive Drive folder ID"],
        timeSaved: "Replaces 15 min doc creation and formatting",
        setupTime: "~20 min",
        detail: "Historical briefs preserved for reference. Naming: 'Briefing · Apr 18 2026'. The exec builds a searchable archive of weekly summaries.",
      },
      {
        id: "n6", type: "end", label: "Email Briefing to Executive", app: "Gmail",
        description: "Emails the executive with top 3 highlights in the email body and the full Google Doc link. Subject: 'Your Weekly Briefing is Ready'",
        dataUsed: ["Claude top-3 summary", "Google Doc URL", "Executive email"],
        timeSaved: "Guarantees zero missed briefings",
        setupTime: "~10 min",
        detail: "Top highlights are inline — exec gets value without opening the doc. Doc link available for deep dive. Sent from EA's address.",
      },
    ],
  },
];

// ─── SVG Flowchart ──────────────────────────────────────────────────────────
const NODE_W = 238;
const NODE_H = 54;
const NODE_GAP = 48;
const CANVAS_PAD = 16;

function nodeStyle(type) {
  const map = {
    trigger: { fill: C.triggerFill, stroke: C.triggerBorder },
    filter:  { fill: C.filterFill,  stroke: C.filterBorder  },
    action:  { fill: C.actionFill,  stroke: C.actionBorder  },
    end:     { fill: C.endFill,     stroke: C.endBorder     },
  };
  return map[type] || map.action;
}

function typeLabel(type) {
  return { trigger: "TRIGGER", filter: "FILTER", action: "ACTION", end: "ACTION" }[type] || "ACTION";
}

function AppBadge({ app, x, y }) {
  const color = APP_COLORS[app] || "#6A65A6";
  const initials = APP_INIT[app] || app.slice(0, 2);
  return (
    <g>
      <circle cx={x + 12} cy={y} r={12} fill={color} opacity={0.9} />
      <text x={x + 12} y={y + 4} textAnchor="middle"
        style={{ fontSize: 8, fill: "#fff", fontFamily: "'DM Sans',sans-serif", fontWeight: 700 }}>
        {initials.slice(0, 2)}
      </text>
    </g>
  );
}

function FlowNode({ node, index, selected, onClick }) {
  const x = CANVAS_PAD;
  const y = CANVAS_PAD + index * (NODE_H + NODE_GAP);
  const { fill, stroke } = nodeStyle(node.type);
  const isSel = selected === node.id;
  return (
    <g onClick={() => onClick(node.id)} style={{ cursor: "pointer" }}>
      {isSel && (
        <rect x={x - 3} y={y - 3} width={NODE_W + 6} height={NODE_H + 6}
          rx={13} fill="none" stroke={stroke} strokeWidth={2} opacity={0.4} />
      )}
      <rect x={x} y={y} width={NODE_W} height={NODE_H} rx={10} fill={fill}
        stroke={isSel ? stroke : "rgba(255,255,255,0.1)"} strokeWidth={isSel ? 1.5 : 1} />
      <rect x={x} y={y} width={4} height={NODE_H} rx={2} fill={stroke} />
      <rect x={x + 12} y={y + 8} width={52} height={16} rx={8} fill={stroke} opacity={0.25} />
      <text x={x + 38} y={y + 20} textAnchor="middle"
        style={{ fontSize: 8.5, fill: stroke, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, letterSpacing: 1 }}>
        {typeLabel(node.type)}
      </text>
      <text x={x + 14} y={y + 36}
        style={{ fontSize: 12.5, fill: C.textLight, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>
        {node.label.length > 28 ? node.label.slice(0, 26) + "…" : node.label}
      </text>
      <AppBadge app={node.app} x={x + NODE_W - 30} y={y + NODE_H / 2} />
    </g>
  );
}

function FlowArrow({ index, nodeCount }) {
  if (index >= nodeCount - 1) return null;
  const fromY = CANVAS_PAD + index * (NODE_H + NODE_GAP) + NODE_H;
  const toY   = fromY + NODE_GAP;
  const cx    = CANVAS_PAD + NODE_W / 2;
  return (
    <g>
      <line x1={cx} y1={fromY + 2} x2={cx} y2={toY - 8}
        stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} strokeDasharray="3 3" />
      <polygon points={`${cx - 5},${toY - 8} ${cx + 5},${toY - 8} ${cx},${toY - 1}`}
        fill="rgba(255,255,255,0.2)" />
    </g>
  );
}

function FlowChart({ workflow, selectedNode, onSelect }) {
  const canvasH = CANVAS_PAD * 2 + workflow.nodes.length * NODE_H + (workflow.nodes.length - 1) * NODE_GAP;
  const canvasW = CANVAS_PAD * 2 + NODE_W;
  return (
    <div style={{ overflowY: "auto", overflowX: "hidden", maxHeight: 520 }}>
      <svg width={canvasW} height={canvasH} style={{ display: "block" }}>
        {workflow.nodes.map((_, i) => (
          <FlowArrow key={i} index={i} nodeCount={workflow.nodes.length} />
        ))}
        {workflow.nodes.map((node, i) => (
          <FlowNode key={node.id} node={node} index={i} selected={selectedNode} onClick={onSelect} />
        ))}
      </svg>
    </div>
  );
}

// ─── Node Detail Panel ──────────────────────────────────────────────────────
function NodeDetail({ node, onClose }) {
  const { stroke } = nodeStyle(node.type);
  const appColor = APP_COLORS[node.app] || C.secondary;
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 16, padding: 24,
      display: "flex", flexDirection: "column", gap: 18,
      borderLeft: `3px solid ${stroke}`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "3px 10px", borderRadius: 50, marginBottom: 10,
            background: stroke + "20", border: `1px solid ${stroke}40`,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: stroke, display: "inline-block" }} />
            <span style={{ fontSize: 10, color: stroke, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, letterSpacing: 1 }}>
              {typeLabel(node.type)}
            </span>
          </div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.textLight, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.3 }}>
            {node.label}
          </h3>
        </div>
        <button onClick={onClose} style={{
          background: "rgba(255,255,255,0.06)", border: `1px solid ${C.border}`,
          borderRadius: 8, width: 28, height: 28, cursor: "pointer",
          color: C.textMuted, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>✕</button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: appColor,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: "'DM Sans',sans-serif", flexShrink: 0,
        }}>
          {(APP_INIT[node.app] || node.app.slice(0, 2)).slice(0, 2)}
        </div>
        <div>
          <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Sans',sans-serif" }}>App</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.textLight, fontFamily: "'DM Sans',sans-serif" }}>{node.app}</div>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Sans',sans-serif", letterSpacing: 0.5, marginBottom: 6, textTransform: "uppercase" }}>
          What it does
        </div>
        <p style={{ margin: 0, fontSize: 13.5, color: C.textLight, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.7 }}>
          {node.description}
        </p>
      </div>

      <div>
        <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Sans',sans-serif", letterSpacing: 0.5, marginBottom: 8, textTransform: "uppercase" }}>
          Data used
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {node.dataUsed.map((d, i) => (
            <span key={i} style={{
              padding: "3px 10px", borderRadius: 50, fontSize: 11,
              background: "rgba(255,255,255,0.05)", color: C.textMuted,
              border: `1px solid ${C.border}`, fontFamily: "'DM Sans',sans-serif",
            }}>{d}</span>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { label: "Time Impact", value: node.timeSaved, color: "#34D399" },
          { label: "Setup Time",  value: node.setupTime,  color: C.accent  },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: "rgba(255,255,255,0.03)", borderRadius: 10,
            padding: "12px 14px", border: `1px solid ${C.border}`,
          }}>
            <div style={{ fontSize: 10, color: C.textMuted, fontFamily: "'DM Sans',sans-serif", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.4 }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{
        background: "rgba(106,101,166,0.08)", borderRadius: 10,
        padding: "12px 14px", border: "1px solid rgba(106,101,166,0.2)",
      }}>
        <div style={{ fontSize: 10, color: C.secondary, fontFamily: "'DM Sans',sans-serif", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
          Implementation note
        </div>
        <p style={{ margin: 0, fontSize: 12.5, color: C.textMuted, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.6 }}>
          {node.detail}
        </p>
      </div>
    </div>
  );
}

// ─── Workflow Overview ───────────────────────────────────────────────────────
function WorkflowOverview({ workflow }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 16, padding: 24,
      display: "flex", flexDirection: "column", gap: 20,
    }}>
      <div>
        <div style={{ fontSize: 28, marginBottom: 12 }}>{workflow.icon}</div>
        <h3 style={{ margin: "0 0 10px", fontSize: 17, fontWeight: 700, color: C.white, fontFamily: "'DM Sans',sans-serif" }}>
          {workflow.title}
        </h3>
        <p style={{ margin: 0, fontSize: 13.5, color: C.textMuted, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.7 }}>
          {workflow.summary}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { label: "Time Saved", value: workflow.timeSaved, color: "#34D399" },
          { label: "Impact",     value: workflow.roi,       color: C.accent  },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: "rgba(255,255,255,0.03)", borderRadius: 12,
            padding: "14px 16px", border: `1px solid ${C.border}`,
          }}>
            <div style={{ fontSize: 10, color: C.textMuted, fontFamily: "'DM Sans',sans-serif", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color, fontFamily: "'DM Sans',sans-serif" }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{
          padding: "4px 12px", borderRadius: 50, fontSize: 11, fontWeight: 600,
          background: workflow.complexity === "Advanced" ? `${C.accent}20` : `${C.primary}20`,
          color: workflow.complexity === "Advanced" ? C.accent : "#60a5fa",
          border: `1px solid ${workflow.complexity === "Advanced" ? C.accent + "40" : C.primary + "40"}`,
          fontFamily: "'DM Sans',sans-serif",
        }}>{workflow.complexity}</span>
        <span style={{ fontSize: 12, color: C.textMuted, fontFamily: "'DM Sans',sans-serif" }}>
          {workflow.nodes.length} steps
        </span>
      </div>

      <div>
        <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Sans',sans-serif", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
          Apps connected
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {workflow.apps.map(app => (
            <span key={app} style={{
              padding: "4px 12px", borderRadius: 50, fontSize: 11,
              background: (APP_COLORS[app] || C.secondary) + "20",
              color: C.textLight, border: `1px solid ${(APP_COLORS[app] || C.secondary)}30`,
              fontFamily: "'DM Sans',sans-serif",
            }}>{app}</span>
          ))}
        </div>
      </div>

      {workflow.reliability && (
        <div style={{
          background: "rgba(5,150,105,0.06)", borderRadius: 10,
          padding: "12px 14px", border: "1px solid rgba(5,150,105,0.2)",
        }}>
          <div style={{ fontSize: 10, color: "#34D399", fontFamily: "'DM Sans',sans-serif", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>
            Reliability &amp; Error Handling
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { label: "Retries", value: workflow.reliability.retries },
              { label: "Failures", value: workflow.reliability.failures },
              { label: "Monitoring", value: workflow.reliability.monitoring },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ fontSize: 10, color: C.textMuted, fontFamily: "'DM Sans',sans-serif", fontWeight: 600, minWidth: 66, paddingTop: 1, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
                <span style={{ fontSize: 11.5, color: C.textLight, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.5 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p style={{ margin: 0, fontSize: 12, color: C.textMuted, fontFamily: "'DM Sans',sans-serif", fontStyle: "italic", marginTop: "auto" }}>
        Click any step in the diagram to see implementation details
      </p>
    </div>
  );
}

// ─── Legend ──────────────────────────────────────────────────────────────────
function Legend() {
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {[
        { type: "trigger", label: "Trigger"    },
        { type: "filter",  label: "Filter"     },
        { type: "action",  label: "Action"     },
        { type: "end",     label: "Final step" },
      ].map(({ type, label }) => {
        const { stroke } = nodeStyle(type);
        return (
          <div key={type} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: stroke, opacity: 0.8 }} />
            <span style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Sans',sans-serif" }}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function ZapierVisualizer() {
  const [activeId, setActiveId] = useState(WORKFLOWS[0].id);
  const [selectedNode, setSelectedNode] = useState(null);

  const workflow = WORKFLOWS.find(w => w.id === activeId);

  const handleWorkflowChange = useCallback((id) => {
    setActiveId(id);
    const incoming = WORKFLOWS.find(w => w.id === id);
    setSelectedNode(incoming?.nodes[0]?.id ?? null);
  }, []);

  const handleNodeSelect = useCallback((nodeId) => {
    setSelectedNode(prev => prev === nodeId ? null : nodeId);
  }, []);

  // Default to first node if nothing selected — page always opens on step 1
  const activeNode = workflow.nodes.find(n => n.id === selectedNode) || workflow.nodes[0];

  return (
    <div style={{ background: C.dark, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      {/* Page Header */}
      <div style={{ padding: "48px 32px 32px", maxWidth: 1100, margin: "0 auto", borderBottom: `1px solid ${C.border}` }}>
        <div style={{
          display: "inline-block", padding: "4px 16px", borderRadius: 50,
          background: `${C.accent}12`, border: `1px solid ${C.accent}30`,
          fontSize: 11, color: C.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16,
        }}>
          Automation Portfolio
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 4vw, 40px)",
              fontWeight: 700, color: C.white, lineHeight: 1.15, marginBottom: 10,
            }}>
              Zapier Workflow{" "}
              <span style={{ background: `linear-gradient(135deg, ${C.accent}, #c084fc)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Visualizer
              </span>
            </h1>
            <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 560, lineHeight: 1.7 }}>
              4 production-ready automations I've designed and deployed. Click any step to explore implementation logic and time saved.
            </p>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {[
              { value: "13+", label: "hrs saved/week" },
              { value: "4",   label: "live workflows"  },
              { value: "24",  label: "automated steps" },
            ].map(({ value, label }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700,
                  background: `linear-gradient(135deg, ${C.accent}, #c084fc)`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>{value}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workflow tabs */}
      <div style={{
        padding: "0 32px", maxWidth: 1100, margin: "0 auto",
        borderBottom: `1px solid ${C.border}`,
        display: "flex", gap: 4, overflowX: "auto",
      }}>
        {WORKFLOWS.map(w => (
          <button key={w.id} onClick={() => handleWorkflowChange(w.id)} style={{
            padding: "14px 20px", background: "none",
            border: "none", borderBottom: `2px solid ${activeId === w.id ? C.accent : "transparent"}`,
            color: activeId === w.id ? C.white : C.textMuted,
            cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
            fontSize: 13, fontWeight: activeId === w.id ? 600 : 400,
            whiteSpace: "nowrap", transition: "all 0.2s",
          }}>
            <span style={{ marginRight: 6 }}>{w.icon}</span>{w.title}
          </button>
        ))}
      </div>

      {/* Main 2-col layout */}
      <div style={{
        maxWidth: 1100, margin: "0 auto", padding: "32px 32px 64px",
        display: "grid", gridTemplateColumns: "270px 1fr",
        gap: 24, alignItems: "start",
      }}>
        {/* Left: flowchart */}
        <div>
          <div style={{ marginBottom: 16 }}><Legend /></div>
          <FlowChart workflow={workflow} selectedNode={selectedNode} onSelect={handleNodeSelect} />
        </div>

        {/* Right: detail or overview */}
        <div style={{ position: "sticky", top: 24 }}>
          {activeNode
            ? <NodeDetail node={activeNode} onClose={() => setSelectedNode(null)} />
            : <WorkflowOverview workflow={workflow} />
          }
        </div>
      </div>
    </div>
  );
}
