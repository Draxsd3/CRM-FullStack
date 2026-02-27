const mongoose = require('mongoose');

const PIPELINE_STATUS_ALIASES = {
  Lead: ['Lead'],
  ReuniaoAgendada: ['Reunião Agendada', 'Reuniao Agendada', 'ReuniÃ£o Agendada'],
  ReuniaoRealizada: ['Reunião Realizada', 'Reuniao Realizada', 'ReuniÃ£o Realizada'],
  ReuniaoCancelada: ['Reunião Cancelada', 'Reuniao Cancelada', 'ReuniÃ£o Cancelada'],
  AguardandoDocumentacao: ['Aguardando Documentação', 'Aguardando Documentacao', 'Aguardando DocumentaÃ§Ã£o'],
  CadastroEfetivado: ['Cadastro Efetivado'],
  ClienteOperando: ['Cliente Operando'],
};

const PIPELINE_STATUSES = Object.values(PIPELINE_STATUS_ALIASES).flat();

const QUALIFICATION_STATUSES = ['Lead Qualificado', 'Lead Desqualificado'];

// CNPJ validation function
function validateCNPJ(cnpj) {
  const cleaned = cnpj.replace(/\D/g, '');
  if (cleaned.length !== 14) return false;

  const calculateCheckDigit = (baseNumber, weights) => {
    const sum = baseNumber
      .split('')
      .map((digit, index) => parseInt(digit) * weights[index])
      .reduce((acc, curr) => acc + curr, 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const secondWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const baseFirst = cleaned.slice(0, 12);
  const firstCheck = calculateCheckDigit(baseFirst, firstWeights);
  if (parseInt(cleaned[12]) !== firstCheck) return false;

  const baseSecond = cleaned.slice(0, 13);
  const secondCheck = calculateCheckDigit(baseSecond, secondWeights);
  if (parseInt(cleaned[13]) !== secondCheck) return false;

  return true;
}

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nome da empresa Ã© obrigatÃ³rio'],
      trim: true,
    },
    cnpj: {
      type: String,
      required: [true, 'CNPJ Ã© obrigatÃ³rio'],
      unique: true,
      validate: {
        validator: function (v) {
          const cleaned = v.replace(/\D/g, '');
          return cleaned.length === 14 && /^\d{14}$/.test(cleaned) && validateCNPJ(cleaned);
        },
        message: 'CNPJ invÃ¡lido',
      },
      set: (v) => v.replace(/\D/g, ''), // Always store only digits
    },
    contactName: {
      type: String,
      required: [true, 'Nome do contato Ã© obrigatÃ³rio'],
      trim: true,
    },
    contactPhone: {
      type: String,
      required: [true, 'Telefone Ã© obrigatÃ³rio'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'E-mail Ã© obrigatÃ³rio'],
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'E-mail invÃ¡lido'],
    },
    address: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, maxlength: 2, default: null },
    pipelineStatus: {
      type: String,
      enum: PIPELINE_STATUSES,
      default: 'Lead',
      required: true,
    },
    qualificationStatus: {
      type: String,
      enum: [...QUALIFICATION_STATUSES, null],
      default: null,
    },
    assignedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    maxTransfers: {
      type: Number,
      default: 3,
    },
    transferHistory: {
      type: [
        {
          fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          transferDate: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    ownerType: {
      type: String,
      enum: ['SDR', 'Closer'],
      default: 'SDR',
    },
    lastTransferDate: {
      type: Date,
      default: null,
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

// Virtual populate for AssignedUser
companySchema.virtual('AssignedUser', {
  ref: 'User',
  localField: 'assignedUserId',
  foreignField: '_id',
  justOne: true,
});

// Index for search
companySchema.index({ name: 'text', cnpj: 'text', contactName: 'text', email: 'text' });
companySchema.index({ assignedUserId: 1 });
companySchema.index({ pipelineStatus: 1 });

// Statics
companySchema.statics.PIPELINE_STATUSES = PIPELINE_STATUSES;
companySchema.statics.QUALIFICATION_STATUSES = QUALIFICATION_STATUSES;

const Company = mongoose.model('Company', companySchema);

module.exports = Company;

