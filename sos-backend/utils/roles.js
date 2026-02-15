const ROLE_VALUES = ['mere', 'tante', 'educateur', 'psychologue', 'directeur', 'admin'];
const MANAGED_ROLE_VALUES = ['mere', 'tante', 'educateur', 'psychologue', 'directeur'];

const ROLE_LABELS = {
  mere: 'Mères SOS',
  tante: 'Tantes SOS',
  educateur: 'Éducateurs',
  psychologue: 'Psychologue',
  directeur: 'Directeur',
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
  directeur: 'directeur',
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
