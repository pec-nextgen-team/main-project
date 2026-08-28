const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* ------------------------------------------------------------------ */
/* GET /api/electricians                                               */
/* ------------------------------------------------------------------ */
exports.list = async (req, res) => {
  try {
    const {
      search,
      department,
      specialization,
      status,
      fromDate,
      toDate,
      employmentType,
      location,
      page = 1,
      limit = 10,
    } = req.query;

    const where = {
      AND: [
        department && department !== "All Departments" ? { department } : {},
        specialization && specialization !== "All Specializations" ? { skills: { contains: specialization, mode: "insensitive" } } : {},
        status && status !== "All Status" ? { status } : {},
        employmentType && employmentType !== "All Types" ? { employmentType } : {},
        location && location !== "All Locations" ? { location } : {},
        fromDate ? { joinedOn: { gte: new Date(fromDate) } } : {},
        toDate ? { joinedOn: { lte: new Date(toDate) } } : {},
        search
          ? {
              OR: [
                { id: { contains: search, mode: "insensitive" } },
                { name: { contains: search, mode: "insensitive" } },
                { phone: { contains: search.replace(/\s/g, "") } },
              ],
            }
          : {},
      ],
    };

    const [rows, count] = await Promise.all([
      prisma.electrician.findMany({
        where,
        orderBy: { id: "asc" },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.electrician.count({ where }),
    ]);

    res.json({ data: rows, total: count, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch electricians." });
  }
};

/* ------------------------------------------------------------------ */
/* GET /api/electricians/summary                                       */
/* ------------------------------------------------------------------ */
exports.summary = async (req, res) => {
  try {
    const [total, active, onLeave, inactive, departments] = await Promise.all([
      prisma.electrician.count(),
      prisma.electrician.count({ where: { status: "Active" } }),
      prisma.electrician.count({ where: { status: "On Leave" } }),
      prisma.electrician.count({ where: { status: "Inactive" } }),
      prisma.electrician.findMany({ distinct: ["department"], select: { department: true } }),
    ]);
    res.json({ total, active, onLeave, inactive, departments: departments.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load summary." });
  }
};

/* ------------------------------------------------------------------ */
/* GET /api/electricians/:id                                           */
/* ------------------------------------------------------------------ */
exports.getById = async (req, res) => {
  try {
    const electrician = await prisma.electrician.findUnique({ where: { id: req.params.id } });
    if (!electrician) return res.status(404).json({ message: "Electrician not found." });
    res.json(electrician);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch electrician." });
  }
};

/* ------------------------------------------------------------------ */
/* POST /api/electricians                                              */
/* ------------------------------------------------------------------ */
exports.create = async (req, res) => {
  try {
    const { id, name, department, skills, phone, status, availability, employmentType, location } = req.body;
    if (!id || !name || !phone) {
      return res.status(400).json({ message: "Employee ID, name, and phone are required." });
    }
    const exists = await prisma.electrician.findUnique({ where: { id } });
    if (exists) return res.status(409).json({ message: `Employee ID ${id} already exists.` });

    const created = await prisma.electrician.create({
      data: {
        id,
        name,
        department,
        skills,
        phone,
        status: status || "Active",
        availability: availability || "Available",
        employmentType: employmentType || "Full-time",
        location,
        joinedOn: new Date(),
      },
    });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create electrician." });
  }
};

/* ------------------------------------------------------------------ */
/* PUT /api/electricians/:id                                           */
/* ------------------------------------------------------------------ */
exports.update = async (req, res) => {
  try {
    const { name, department, skills, phone, status, availability, employmentType, location } = req.body;
    const updated = await prisma.electrician.update({
      where: { id: req.params.id },
      data: { name, department, skills, phone, status, availability, employmentType, location },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update electrician." });
  }
};

/* ------------------------------------------------------------------ */
/* PATCH /api/electricians/:id/status                                  */
/* ------------------------------------------------------------------ */
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Active", "On Leave", "Inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }
    const updated = await prisma.electrician.update({
      where: { id: req.params.id },
      data: { status, availability: status === "Active" ? "Available" : "Not Available" },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update status." });
  }
};

/* ------------------------------------------------------------------ */
/* PATCH /api/electricians/bulk-status                                 */
/* ------------------------------------------------------------------ */
exports.bulkUpdateStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || !ids.length || !["Active", "On Leave", "Inactive"].includes(status)) {
      return res.status(400).json({ message: "ids array and a valid status are required." });
    }
    const result = await prisma.electrician.updateMany({
      where: { id: { in: ids } },
      data: { status, availability: status === "Active" ? "Available" : "Not Available" },
    });
    res.json({ updated: result.count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to bulk update status." });
  }
};

/* ------------------------------------------------------------------ */
/* DELETE /api/electricians/:id                                        */
/* ------------------------------------------------------------------ */
exports.remove = async (req, res) => {
  try {
    await prisma.electrician.delete({ where: { id: req.params.id } });
    res.json({ message: "Electrician removed." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove electrician." });
  }
};

/* ------------------------------------------------------------------ */
/* GET /api/electricians/export                                        */
/* ------------------------------------------------------------------ */
exports.exportCsv = async (req, res) => {
  try {
    const { department, specialization, status, employmentType, location, search } = req.query;
    const where = {
      AND: [
        department && department !== "All Departments" ? { department } : {},
        specialization && specialization !== "All Specializations" ? { skills: { contains: specialization, mode: "insensitive" } } : {},
        status && status !== "All Status" ? { status } : {},
        employmentType && employmentType !== "All Types" ? { employmentType } : {},
        location && location !== "All Locations" ? { location } : {},
        search
          ? {
              OR: [
                { id: { contains: search, mode: "insensitive" } },
                { name: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
      ],
    };
    const rows = await prisma.electrician.findMany({ where, orderBy: { id: "asc" } });
    const header = ["S.No", "Employee ID", "Name", "Department", "Skills", "Phone", "Status", "Availability"];
    const lines = rows.map((r, i) => [i + 1, r.id, r.name, r.department, r.skills, r.phone, r.status, r.availability].join(","));
    const csv = [header.join(","), ...lines].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=electricians.csv");
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to export electricians." });
  }
};

/* ------------------------------------------------------------------ */
/* POST /api/electricians/import  (multipart CSV upload)               */
/* Expects a CSV with header:                                          */
/* id,name,department,skills,phone,status,availability,employmentType,location */
/* ------------------------------------------------------------------ */
exports.importCsv = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded." });

    const text = req.file.buffer.toString("utf-8");
    const [headerLine, ...lines] = text.trim().split("\n");
    const headers = headerLine.split(",").map((h) => h.trim());

    const records = lines
      .filter(Boolean)
      .map((line) => {
        const values = line.split(",").map((v) => v.trim());
        return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
      });

    const created = await prisma.$transaction(
      records.map((r) =>
        prisma.electrician.upsert({
          where: { id: r.id },
          update: r,
          create: { ...r, joinedOn: new Date() },
        })
      )
    );

    res.json({ imported: created.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to import electricians." });
  }
};
