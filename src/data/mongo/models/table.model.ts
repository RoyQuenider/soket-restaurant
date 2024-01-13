
import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Name is required'],
    unique: true
  },
  state: {
    type: [String],
    default: 'EMPTY',
    enum: ['EMPTY', 'BUSY'],
  },
  userUpdate: {
    type: String,
  }
})
export const TableModel = mongoose.model('Table', tableSchema)
