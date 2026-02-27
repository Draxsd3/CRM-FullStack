const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Título da reunião é obrigatório'],
      trim: true,
    },
    description: {
      type: String,
      default: null,
    },
    startTime: {
      type: Date,
      required: [true, 'Data e hora de início são obrigatórias'],
    },
    endTime: {
      type: Date,
      required: [true, 'Data e hora de término são obrigatórias'],
    },
    location: {
      type: String,
      default: null,
    },
    meetingType: {
      type: String,
      enum: ['Presencial', 'Virtual', 'Telefônica'],
      default: 'Presencial',
    },
    status: {
      type: String,
      enum: ['Agendada', 'Realizada', 'Cancelada', 'Reagendada'],
      default: 'Agendada',
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'ID da empresa é obrigatório'],
    },
    ownerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    enableNotification: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

meetingSchema.index({ companyId: 1 });
meetingSchema.index({ startTime: 1 });
meetingSchema.index({ ownerUserId: 1 });

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;
