const prisma = require('../config/db');

function complaintTransaction(handler) {
  return async (req, res, next) => {
    let statusCode = 200;

    try {
      const result = await prisma.$transaction(
        async (tx) => {
          const scopedReq = Object.assign(Object.create(req), {
            db: tx,
          });

          const originalJson = res.json.bind(res);

          res.json = (data) => {
            statusCode = res.statusCode;
            return data;
          };

          const response = await handler(scopedReq, res, next);

          return response;
        },
        {
          isolationLevel: 'ReadCommitted',
          maxWait: 10000,
          timeout: 60000
        }
      );

      return res.status(statusCode).json(result);

    } catch (error) {
      console.error("Complaint transaction failed:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to update complaint. Please retry."
      });
    }
  };
}

module.exports = {
  complaintTransaction
};