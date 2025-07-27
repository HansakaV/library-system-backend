import mongoose from "mongoose";

type Lending = {
  _id?: string
  id?: string // For frontend compatibility
  bookId: string // Changed from bookname to bookId to match frontend
  readerId: string // Changed from readername to readerId to match frontend
  lendDate: Date | string // Allow both Date and string for flexibility
  dueDate: Date | string
  returnDate?: Date | string | null
  status?: 'active' | 'returned' | 'overdue'
}

const lendingSchema = new mongoose.Schema<Lending>({
  bookId: {
    type: String,
    required: [true, "Book ID is required"],
    trim: true,
  },
  readerId: {
    type: String,
    required: [true, "Reader ID is required"],
    trim: true,
  },
  lendDate: {
    type: Date,
    required: [true, "Lend date is required"],
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: [true, "Due date is required"],
  },
  returnDate: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'returned', 'overdue'],
      message: "Status must be active, returned, or overdue"
    },
    default: 'active',
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      // Convert dates to YYYY-MM-DD format for frontend
      ret.lendDate = ret.lendDate ? ret.lendDate.toISOString().split('T')[0] : null;
      ret.dueDate = ret.dueDate ? ret.dueDate.toISOString().split('T')[0] : null;
      ret.returnDate = ret.returnDate ? ret.returnDate.toISOString().split('T')[0] : null;
      return ret;
    }
  }
})

export const LendingModel = mongoose.model("Lending", lendingSchema)