// src/models/ShiftType.js
const SHIFT_TYPES = {
  MANUAL: 'manual',
  AUTOMATED: 'automated',
  SCHEDULED: 'scheduled',
  LEAVE: 'leave'
};

const SHIFT_TYPE_VALUES = Object.values(SHIFT_TYPES);

module.exports = {
  SHIFT_TYPES,
  SHIFT_TYPE_VALUES
};
