const ROLE_VALUES = ['mere', 'tante', 'educateur', 'psychologue', 'decideur1', 'decideur2', 'admin'];
const MANAGED_ROLE_VALUES = ['mere', 'tante', 'educateur', 'psychologue', 'decideur1', 'decideur2'];

const ROLE_LABELS = {
  mere: 'Mère SOS',
  tante: 'Tante SOS',
  educateur: 'Éducateur',
  psychologue: 'Psychologue',
  decideur1: 'Décideur 1',
  decideur2: 'Décideur 2',
  admin: 'Administrateur'
};

const ROLE_INPUT_MAP = {
  mere: 'mere',
  'mere sos': 'mere',
  meres: 'mere',
  'meres sos': 'mere',
  tante: 'tante',
  'tante sos': 'tante',
  tantes: 'tante',
  'tantes sos': 'tante',
  educateur: 'educateur',
  educateurs: 'educateur',
  psychologue: 'psychologue',
  decideur1: 'decideur1',
  'decideur 1': 'decideur1',
  decideur2: 'decideur2',
  'decideur 2': 'decideur2',
  directeur: 'decideur1',
  admin: 'admin',
  administrateur: 'admin'
};

const normalizeRoleInput = (value) => {
  if (!value || typeof value !== 'string') {
    return null;
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  return ROLE_INPUT_MAP[normalized] || null;
};

module.exports = {
  ROLE_VALUES,
  MANAGED_ROLE_VALUES,
  ROLE_LABELS,
  ROLE_INPUT_MAP,
  normalizeRoleInput
};
