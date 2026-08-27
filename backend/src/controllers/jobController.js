const prisma = require('../config/db');

const getJobs = async (req, res) => {
  try {
    const technicianId = req.user.id;

    const jobs = await prisma.assignment.findMany({
      where: {
        technicianId,
      },
      orderBy: {
        assignedAt: 'desc',
      },
      include: {
        complaint: {
          select: {
            id: true,
            ticketNumber: true,
            title: true,
            description: true,
            category: true,
            priority: true,
            status: true,
            slaDueAt: true,
            registeredAt: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error('Get jobs error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
    });
  }
};

module.exports = {
  getJobs,
};