import prisma from "../lib/prisma.js";

export async function openTicket(req, res) {
  try {
    const complaintId = Number(req.params.complaintId);

    if (!Number.isInteger(complaintId) || complaintId <= 0) {
      return res.status(400).json({
        message: "Invalid complaint ID"
      });
    }

    const complaint = await prisma.complaint.findUnique({
      where: {
        id: complaintId
      },
      include: {
        ticket: true
      }
    });

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    if (complaint.status !== "APPROVED") {
      return res.status(400).json({
        message: "Only APPROVED complaints can be converted into a ticket"
      });
    }

    if (complaint.ticket) {
      return res.status(409).json({
        message: "Ticket already exists for this complaint"
      });
    }

    const ticket = await prisma.ticket.create({
      data: {
        complaintId: complaint.id,
        status: "TICKET_OPEN"
      }
    });

    return res.status(201).json({
      message: "Ticket opened successfully",
      ticket
    });
  } catch (error) {
    console.error("Open ticket error:", error);

    // Handle concurrent ticket creation
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Ticket already exists for this complaint"
      });
    }

    return res.status(500).json({
      message: "Failed to open ticket"
    });
  }
}

export async function getElectricians(req, res) {
  try {
    const electricians = await prisma.user.findMany({
      where: {
        role: "ELECTRICIAN"
      },
      select: {
        id: true,
        identifier: true,
        role: true
      },
      orderBy: {
        id: "asc"
      }
    });

    return res.status(200).json(electricians);
  } catch (error) {
    console.error("Get electricians error:", error);

    return res.status(500).json({
      message: "Failed to fetch electricians"
    });
  }
}

export async function assignElectrician(req, res) {
  try {
    const ticketId = Number(req.params.id);
    const { electricianId } = req.body;

    if (!Number.isInteger(ticketId) || ticketId <= 0) {
      return res.status(400).json({
        message: "Invalid ticket ID"
      });
    }

    if (!Number.isInteger(Number(electricianId))) {
      return res.status(400).json({
        message: "electricianId must be a valid number"
      });
    }

    const electrician = await prisma.user.findUnique({
      where: {
        id: Number(electricianId)
      }
    });

    if (!electrician) {
      return res.status(404).json({
        message: "Electrician not found"
      });
    }

    if (electrician.role !== "ELECTRICIAN") {
      return res.status(400).json({
        message: "Selected user is not an ELECTRICIAN"
      });
    }

    const ticket = await prisma.ticket.findUnique({
      where: {
        id: ticketId
      }
    });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found"
      });
    }

    if (ticket.status !== "TICKET_OPEN") {
      return res.status(400).json({
        message: "Only open tickets can be assigned"
      });
    }

    const assignedAt = new Date();

    const slaTarget = new Date(assignedAt);
    slaTarget.setDate(slaTarget.getDate() + 3);

    // Atomically assign the electrician only if the ticket is still open
    const assignment = await prisma.ticket.updateMany({
      where: {
        id: ticketId,
        status: "TICKET_OPEN"
      },
      data: {
        assignedElectricianId: electrician.id,
        assignedAt: assignedAt,
        slaTarget: slaTarget,
        status: "ASSIGNED"
      }
    });

    if (assignment.count === 0) {
      return res.status(409).json({
        message: "Ticket is no longer open or has already been assigned"
      });
    }

    const updatedTicket = await prisma.ticket.findUnique({
      where: {
        id: ticketId
      },
      include: {
        assignedElectrician: {
          select: {
            id: true,
            identifier: true,
            role: true
          }
        },
        complaint: true
      }
    });

    return res.status(200).json({
      message: "Electrician assigned successfully",
      ticket: updatedTicket
    });
  } catch (error) {
    console.error("Assign electrician error:", error);

    return res.status(500).json({
      message: "Failed to assign electrician"
    });
  }
}