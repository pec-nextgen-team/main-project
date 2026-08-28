const { PrismaClient, LeaveType, LeaveStatus } = require("@prisma/client");
const prisma = new PrismaClient();

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const LEAVE_TYPE_MAP = {
  "Casual Leave": "CASUAL",
  "Earned Leave": "EARNED",
  "Sick Leave": "SICK",
  Other: "OTHER",
};
const LEAVE_TYPE_LABEL = {
  CASUAL: "Casual Leave",
  EARNED: "Earned Leave",
  SICK: "Sick Leave",
  OTHER: "Other",
};
const STATUS_LABEL = { PENDING: "Pending", APPROVED: "Approved", REJECTED: "Rejected" };

function calcDays(fromDate, toDate) {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  const diff = Math.round((to - from) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff + 1 : null;
}

function serialize(leave) {
  return {
    id: leave.id,
    employeeId: leave.employeeId,
    name: leave.electrician?.name,
    department: leave.electrician?.department,
    leaveType: LEAVE_TYPE_LABEL[leave.leaveType],
    fromDate: leave.fromDate.toISOString().slice(0, 10),
    toDate: leave.toDate.toISOString().slice(0, 10),
    days: leave.days,
    status: STATUS_LABEL[leave.status],
    reason: leave.reason,
  };
}

/** Reject overlapping leave requests for the same electrician
 *  (any PENDING or APPROVED record whose date range intersects). */
async function hasOverlap({ employeeId, fromDate, toDate, excludeId }) {
  const existing = await prisma.leave.findFirst({
    where: {
      employeeId,
      status: { in: ["PENDING", "APPROVED"] },
      id: excludeId ? { not: excludeId } : undefined,
      fromDate: { lte: new Date(toDate) },
      toDate: { gte: new Date(fromDate) },
    },
  });
  return !!existing;
}

/* ------------------------------------------------------------------ */
/* GET /api/leaves                                                     */
/* ------------------------------------------------------------------ */
exports.list = async (req, res) => {
  try {
    const { fromDate, toDate, department, status, leaveType, electricianId, search, page = 1, limit = 50 } = req.query;

    const where = {
      AND: [
        fromDate ? { toDate: { gte: new Date(fromDate) } } : {},
        toDate ? { fromDate: { lte: new Date(toDate) } } : {},
        status && status !== "All Status" ? { status: status.toUpperCase() } : {},
        leaveType && leaveType !== "All Leave Types" ? { leaveType: LEAVE_TYPE_MAP[leaveType] } : {},
        electricianId && electricianId !== "All Electricians" ? { employeeId: electricianId } : {},
        department && department !== "All Departments" ? { electrician: { department } } : {},
        search
          ? {
              OR: [
                { employeeId: { contains: search, mode: "insensitive" } },
                { electrician: { name: { contains: search, mode: "insensitive" } } },
              ],
            }
          : {},
      ],
    };

    const [rows, count] = await Promise.all([
      prisma.leave.findMany({
        where,
        include: { electrician: true },
        orderBy: { fromDate: "desc" },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.leave.count({ where }),
    ]);

    res.json({ data: rows.map(serialize), total: count, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch leave requests." });
  }
};

/* ------------------------------------------------------------------ */
/* GET /api/leaves/summary                                             */
/* ------------------------------------------------------------------ */
exports.summary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalElectricians, onLeaveToday, leaveRequests, pendingApprovals, byType] = await Promise.all([
      prisma.electrician.count(),
      prisma.leave.count({
        where: { status: "APPROVED", fromDate: { lte: today }, toDate: { gte: today } },
      }),
      prisma.leave.count(),
      prisma.leave.count({ where: { status: "PENDING" } }),
      prisma.leave.groupBy({ by: ["leaveType"], _count: true }),
    ]);

    res.json({
      totalElectricians,
      onLeaveToday,
      leaveRequests,
      pendingApprovals,
      leaveTypeSummary: byType.map((t) => ({ type: LEAVE_TYPE_LABEL[t.leaveType], count: t._count })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load summary." });
  }
};

/* ------------------------------------------------------------------ */
/* GET /api/leaves/:id                                                 */
/* ------------------------------------------------------------------ */
exports.getById = async (req, res) => {
  try {
    const leave = await prisma.leave.findUnique({
      where: { id: Number(req.params.id) },
      include: { electrician: true },
    });
    if (!leave) return res.status(404).json({ message: "Leave request not found." });
    res.json(serialize(leave));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch leave request." });
  }
};

/* ------------------------------------------------------------------ */
/* POST /api/leaves                                                    */
/* ------------------------------------------------------------------ */
exports.create = async (req, res) => {
  try {
    const { employeeId, leaveType, fromDate, toDate, reason } = req.body;

    if (!employeeId || !leaveType || !fromDate || !toDate) {
      return res.status(400).json({ message: "employeeId, leaveType, fromDate and toDate are required." });
    }
    if (new Date(toDate) < new Date(fromDate)) {
      return res.status(400).json({ message: "To date cannot be before the from date." });
    }
    if (await hasOverlap({ employeeId, fromDate, toDate })) {
      return res.status(409).json({ message: "This electrician already has a leave request that overlaps these dates." });
    }

    const days = calcDays(fromDate, toDate);
    const created = await prisma.leave.create({
      data: {
        employeeId,
        leaveType: LEAVE_TYPE_MAP[leaveType] || leaveType,
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
        days,
        reason,
        status: "PENDING",
      },
      include: { electrician: true },
    });

    res.status(201).json(serialize(created));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit leave request." });
  }
};

/* ------------------------------------------------------------------ */
/* PUT /api/leaves/:id  (edit — only while PENDING)                    */
/* ------------------------------------------------------------------ */
exports.update = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.leave.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Leave request not found." });
    if (existing.status !== "PENDING") {
      return res.status(400).json({ message: "Only pending leave requests can be edited." });
    }

    const { leaveType, fromDate, toDate, reason } = req.body;
    const nextFrom = fromDate || existing.fromDate;
    const nextTo = toDate || existing.toDate;

    if (new Date(nextTo) < new Date(nextFrom)) {
      return res.status(400).json({ message: "To date cannot be before the from date." });
    }
    if (await hasOverlap({ employeeId: existing.employeeId, fromDate: nextFrom, toDate: nextTo, excludeId: id })) {
      return res.status(409).json({ message: "This electrician already has a leave request that overlaps these dates." });
    }

    const updated = await prisma.leave.update({
      where: { id },
      data: {
        leaveType: leaveType ? LEAVE_TYPE_MAP[leaveType] || leaveType : undefined,
        fromDate: fromDate ? new Date(fromDate) : undefined,
        toDate: toDate ? new Date(toDate) : undefined,
        days: calcDays(nextFrom, nextTo),
        reason,
      },
      include: { electrician: true },
    });

    res.json(serialize(updated));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update leave request." });
  }
};

/* ------------------------------------------------------------------ */
/* DELETE /api/leaves/:id  (cancel — only while PENDING)                */
/* ------------------------------------------------------------------ */
exports.cancel = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.leave.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Leave request not found." });
    if (existing.status !== "PENDING") {
      return res.status(400).json({ message: "Only pending leave requests can be cancelled." });
    }
    await prisma.leave.delete({ where: { id } });
    res.json({ message: "Leave request cancelled." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to cancel leave request." });
  }
};

/* ------------------------------------------------------------------ */
/* PATCH /api/leaves/:id/approve                                       */
/* PATCH /api/leaves/:id/reject                                        */
/* ------------------------------------------------------------------ */
async function decide(req, res, status) {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.leave.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Leave request not found." });
    if (existing.status !== "PENDING") {
      return res.status(400).json({ message: `Only pending requests can be ${status === "APPROVED" ? "approved" : "rejected"}.` });
    }

    const updated = await prisma.leave.update({
      where: { id },
      data: {
        status,
        decidedAt: new Date(),
        decidedBy: req.user?.id || req.user?.name || "system",
        remarks: req.body?.remarks,
      },
      include: { electrician: true },
    });

    res.json(serialize(updated));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update leave status." });
  }
}

exports.approve = (req, res) => decide(req, res, "APPROVED");
exports.reject = (req, res) => decide(req, res, "REJECTED");

/* ------------------------------------------------------------------ */
/* GET /api/leaves/export                                              */
/* ------------------------------------------------------------------ */
exports.exportCsv = async (req, res) => {
  try {
    const { fromDate, toDate, department, status, leaveType, electricianId, search } = req.query;
    req.query = { fromDate, toDate, department, status, leaveType, electricianId, search, page: 1, limit: 10000 };

    const where = {
      AND: [
        fromDate ? { toDate: { gte: new Date(fromDate) } } : {},
        toDate ? { fromDate: { lte: new Date(toDate) } } : {},
        status && status !== "All Status" ? { status: status.toUpperCase() } : {},
        leaveType && leaveType !== "All Leave Types" ? { leaveType: LEAVE_TYPE_MAP[leaveType] } : {},
        electricianId && electricianId !== "All Electricians" ? { employeeId: electricianId } : {},
        department && department !== "All Departments" ? { electrician: { department } } : {},
      ],
    };

    const rows = await prisma.leave.findMany({ where, include: { electrician: true }, orderBy: { fromDate: "desc" } });
    const header = ["S.No", "Employee ID", "Name", "Department", "Leave Type", "From Date", "To Date", "Days", "Status"];
    const lines = rows.map((r, i) => {
      const s = serialize(r);
      return [i + 1, s.employeeId, s.name, s.department, s.leaveType, s.fromDate, s.toDate, s.days, s.status].join(",");
    });
    const csv = [header.join(","), ...lines].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=leave-requests.csv");
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to export leave requests." });
  }
};

/* ------------------------------------------------------------------ */
/* GET /api/electricians/:id/leave-balance                             */
/* ------------------------------------------------------------------ */
exports.leaveBalance = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const ANNUAL_QUOTA = { CASUAL: 12, EARNED: 15, SICK: 10 };

    const usedRaw = await prisma.leave.groupBy({
      by: ["leaveType"],
      where: { employeeId, status: "APPROVED" },
      _sum: { days: true },
    });
    const used = Object.fromEntries(usedRaw.map((u) => [u.leaveType, u._sum.days || 0]));

    const balance = Object.entries(ANNUAL_QUOTA).map(([type, quota]) => ({
      leaveType: LEAVE_TYPE_LABEL[type],
      quota,
      used: used[type] || 0,
      remaining: quota - (used[type] || 0),
    }));

    res.json(balance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch leave balance." });
  }
};
