import Record from '../models/Record.js';

export const getSummary = async (req, res) => {
  try {
    const summary = await Record.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      income: 0,
      expense: 0,
      balance: 0,
    };

    summary.forEach((item) => {
      if (item._id === 'income') result.income = item.total;
      if (item._id === 'expense') result.expense = item.total;
    });

    result.balance = result.income - result.expense;

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategoryTotals = async (req, res) => {
  try {
    const { type } = req.query;
    const match = { isDeleted: false };
    if (type) match.type = type;

    const categoryTotals = await Record.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.status(200).json({ categoryTotals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMonthlyTrends = async (req, res) => {
  try {
    const trends = await Record.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.status(200).json({ trends });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRecentActivity = async (req, res) => {
  try {
    const records = await Record.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name');

    res.status(200).json({ records });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFullDashboard = async (req, res) => {
  try {
    // Basic aggregation for summary
    const summaryData = await Record.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    const summary = { income: 0, expense: 0, balance: 0 };
    summaryData.forEach((item) => {
      if (item._id === 'income') summary.income = item.total;
      if (item._id === 'expense') summary.expense = item.total;
    });
    summary.balance = summary.income - summary.expense;

    // Recent activities
    const recentActivity = await Record.find({ isDeleted: false })
      .sort({ date: -1 })
      .limit(10)
      .populate('user', 'name');

    // Category breakdown
    const categoryTotals = await Record.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          type: { $first: '$type' },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.status(200).json({
      summary,
      recentActivity,
      categoryTotals,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
