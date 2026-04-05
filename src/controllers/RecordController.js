import Record from '../models/Record.js';

export const createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    const record = await Record.create({
      user: req.user._id,
      amount,
      type,
      category,
      date: date || Date.now(),
      notes,
    });

    res.status(201).json({ message: 'Record created successfully', record });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 10 } = req.query;

    const filter = { isDeleted: false };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const total = await Record.countDocuments(filter);
    const records = await Record.find(filter)
      .populate('user', 'name email role')
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      records,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRecordById = async (req, res) => {
  try {
    const record = await Record.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate('user', 'name email');

    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.status(200).json({ record });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    const record = await Record.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { amount, type, category, date, notes },
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.status(200).json({ message: 'Record updated successfully', record });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
