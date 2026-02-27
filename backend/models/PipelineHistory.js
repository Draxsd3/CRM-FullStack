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

const pipelineHistorySchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    previousStatus: {
      type: String,
      enum: [...PIPELINE_STATUSES, null],
      default: null,
    },
    newStatus: {
      type: String,
      enum: PIPELINE_STATUSES,
      required: true,
      default: 'Lead',
    },
    previousOwnerType: {
      type: String,
      enum: ['SDR', 'Closer', null],
      default: null,
    },
    newOwnerType: {
      type: String,
      enum: ['SDR', 'Closer', null],
      default: null,
    },
    qualificationStatus: {
      type: String,
      enum: ['Lead Qualificado', 'Lead Desqualificado', null],
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    previousAssignedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    newAssignedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    changeDate: {
      type: Date,
      default: Date.now,
    },
    observations: {
      type: String,
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

pipelineHistorySchema.index({ companyId: 1, changeDate: -1 });

const PipelineHistory = mongoose.model('PipelineHistory', pipelineHistorySchema);

module.exports = PipelineHistory;

