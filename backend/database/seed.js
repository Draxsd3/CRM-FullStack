/**
 * Seed script - populates MongoDB with initial data
 * Run: node database/seed.js
 * Run reset: node database/seed.js --drop
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Company = require('../models/Company');
const Meeting = require('../models/Meeting');
const PipelineHistory = require('../models/PipelineHistory');
const KYCReport = require('../models/KYCReport');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crm_leads';

function buildValidCnpj(base12) {
  const digits = String(base12).replace(/\D/g, '');
  if (digits.length !== 12) {
    throw new Error('Base CNPJ precisa ter 12 digitos');
  }

  const calcDigit = (input, weights) => {
    const sum = input
      .split('')
      .reduce((acc, char, idx) => acc + Number(char) * weights[idx], 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const d1 = calcDigit(digits, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d2 = calcDigit(`${digits}${d1}`, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return `${digits}${d1}${d2}`;
}

async function seedDatabase({ drop = false } = {}) {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
    console.log(`Connected to MongoDB at ${MONGODB_URI}`);
  }

  if (drop) {
    await mongoose.connection.dropDatabase();
    console.log('Database dropped');
  } else {
    await Promise.all([
      User.deleteMany({}),
      Company.deleteMany({}),
      Meeting.deleteMany({}),
      PipelineHistory.deleteMany({}),
      KYCReport.deleteMany({}),
    ]);
    console.log('Existing data cleared');
  }

  const salt = await bcrypt.genSalt(10);

  const users = await User.create([
    {
      name: 'Administrador',
      email: 'admin@crmleads.com',
      password: await bcrypt.hash('Admin@2024', salt),
      role: 'ADM',
      position: 'Administrador do Sistema',
    },
    {
      name: 'Renan Ramos',
      email: 'renan@crmleads.com',
      password: await bcrypt.hash('Renan@2004', salt),
      role: 'SDR',
      position: 'SDR Senior',
      performanceScore: 87,
    },
    {
      name: 'Maria Silva',
      email: 'maria@crmleads.com',
      password: await bcrypt.hash('Maria@2024', salt),
      role: 'Closer',
      closerSpecialty: 'Imobiliario',
      position: 'Closer',
      performanceScore: 92,
    },
    {
      name: 'Carlos Supervisor',
      email: 'carlos@crmleads.com',
      password: await bcrypt.hash('Carlos@2024', salt),
      role: 'Supervisor',
      position: 'Supervisor Comercial',
      performanceScore: 90,
    },
  ]);
  console.log(`Created ${users.length} users`);

  const cnpjs = [
    buildValidCnpj('112223330001'),
    buildValidCnpj('334445550001'),
    buildValidCnpj('556667770001'),
    buildValidCnpj('778889990001'),
    buildValidCnpj('990001110001'),
  ];

  const companies = await Company.create([
    {
      name: 'Tech Solutions LTDA',
      cnpj: cnpjs[0],
      contactName: 'Joao Silva',
      contactPhone: '11999990001',
      email: 'joao@techsolutions.com',
      address: 'Av Paulista 1000',
      city: 'Sao Paulo',
      state: 'SP',
      pipelineStatus: 'Lead',
      qualificationStatus: 'Lead Qualificado',
      assignedUserId: users[1]._id,
      ownerType: 'SDR',
    },
    {
      name: 'Construtora ABC SA',
      cnpj: cnpjs[1],
      contactName: 'Ana Costa',
      contactPhone: '21999990002',
      email: 'ana@construtoraabc.com',
      address: 'Rua do Comercio 500',
      city: 'Rio de Janeiro',
      state: 'RJ',
      pipelineStatus: 'Reunião Agendada',
      qualificationStatus: 'Lead Qualificado',
      assignedUserId: users[1]._id,
      ownerType: 'SDR',
    },
    {
      name: 'Imobiliaria Premium',
      cnpj: cnpjs[2],
      contactName: 'Pedro Santos',
      contactPhone: '31999990003',
      email: 'pedro@imobpremium.com',
      address: 'Rua das Flores 200',
      city: 'Belo Horizonte',
      state: 'MG',
      pipelineStatus: 'Reunião Realizada',
      qualificationStatus: 'Lead Qualificado',
      assignedUserId: users[2]._id,
      ownerType: 'Closer',
    },
    {
      name: 'Agro Finance',
      cnpj: cnpjs[3],
      contactName: 'Lucia Oliveira',
      contactPhone: '62999990004',
      email: 'lucia@agrofinance.com',
      address: 'Av Goias 300',
      city: 'Goiania',
      state: 'GO',
      pipelineStatus: 'Aguardando Documentação',
      qualificationStatus: 'Lead Qualificado',
      assignedUserId: users[2]._id,
      ownerType: 'Closer',
    },
    {
      name: 'Solar Energy Corp',
      cnpj: cnpjs[4],
      contactName: 'Roberto Lima',
      contactPhone: '71999990005',
      email: 'roberto@solarenergy.com',
      address: 'Rua Solar 100',
      city: 'Salvador',
      state: 'BA',
      pipelineStatus: 'Cliente Operando',
      qualificationStatus: 'Lead Qualificado',
      assignedUserId: users[2]._id,
      ownerType: 'Closer',
    },
  ]);
  console.log(`Created ${companies.length} companies`);

  const now = new Date();
  const meetings = await Meeting.create([
    {
      title: 'Apresentacao CRM - Tech Solutions',
      description: 'Apresentacao inicial do sistema',
      startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + 25 * 60 * 60 * 1000),
      location: 'Google Meet',
      meetingType: 'Virtual',
      status: 'Agendada',
      companyId: companies[0]._id,
      ownerUserId: users[1]._id,
    },
    {
      title: 'Follow-up Construtora ABC',
      description: 'Acompanhamento da proposta',
      startTime: new Date(now.getTime() - 48 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() - 47 * 60 * 60 * 1000),
      location: 'Escritorio',
      meetingType: 'Presencial',
      status: 'Realizada',
      companyId: companies[1]._id,
      ownerUserId: users[2]._id,
    },
    {
      title: 'Validacao documental Agro Finance',
      description: 'Checklist de documentos pendentes',
      startTime: new Date(now.getTime() + 72 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + 73 * 60 * 60 * 1000),
      location: 'Microsoft Teams',
      meetingType: 'Virtual',
      status: 'Agendada',
      companyId: companies[3]._id,
      ownerUserId: users[2]._id,
    },
  ]);
  console.log(`Created ${meetings.length} meetings`);

  const history = await PipelineHistory.create([
    {
      companyId: companies[0]._id,
      previousStatus: null,
      newStatus: 'Lead',
      observations: 'Empresa cadastrada',
      userId: users[1]._id,
    },
    {
      companyId: companies[1]._id,
      previousStatus: 'Lead',
      newStatus: 'Reunião Agendada',
      observations: 'Reuniao agendada com sucesso',
      userId: users[1]._id,
    },
    {
      companyId: companies[2]._id,
      previousStatus: 'Reunião Agendada',
      newStatus: 'Reunião Realizada',
      observations: 'Reuniao presencial realizada',
      userId: users[2]._id,
    },
    {
      companyId: companies[3]._id,
      previousStatus: 'Reunião Realizada',
      newStatus: 'Aguardando Documentação',
      observations: 'Aguardando contrato social e balanco',
      userId: users[2]._id,
    },
    {
      companyId: companies[4]._id,
      previousStatus: 'Cadastro Efetivado',
      newStatus: 'Cliente Operando',
      observations: 'Cliente iniciou operacao',
      userId: users[2]._id,
    },
  ]);
  console.log(`Created ${history.length} pipeline history records`);

  const kycReports = await KYCReport.create([
    {
      companyId: companies[2]._id,
      userId: users[2]._id,
      userName: users[2].name,
      reportType: 'KYC Inicial',
      content: 'Empresa validada sem restricoes relevantes. Documentacao consistente.',
    },
    {
      companyId: companies[4]._id,
      userId: users[3]._id,
      userName: users[3].name,
      reportType: 'KYC Atualizacao',
      content: 'Revisao anual concluida. Estrutura societaria mantida.',
    },
  ]);
  console.log(`Created ${kycReports.length} KYC reports`);

  await Promise.all([
    User.syncIndexes(),
    Company.syncIndexes(),
    Meeting.syncIndexes(),
    PipelineHistory.syncIndexes(),
    KYCReport.syncIndexes(),
  ]);
  console.log('Indexes synchronized');

  return {
    users: users.length,
    companies: companies.length,
    meetings: meetings.length,
    pipelineHistory: history.length,
    kycReports: kycReports.length,
  };
}

async function runFromCli() {
  const shouldDrop = process.argv.includes('--drop');

  try {
    const summary = await seedDatabase({ drop: shouldDrop });
    console.log('\nSeed completed successfully');
    console.log(summary);
    console.log('\nLogin credentials:');
    console.log('Admin: admin@crmleads.com / Admin@2024');
    console.log('SDR: renan@crmleads.com / Renan@2004');
    console.log('Closer: maria@crmleads.com / Maria@2024');
    console.log('Supervisor: carlos@crmleads.com / Carlos@2024');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

if (require.main === module) {
  runFromCli();
}

module.exports = { seedDatabase };
