export const JOB_TYPES = [
  { value: 'full_time', label: 'Full-Time' },
  { value: 'part_time', label: 'Part-Time' },
  { value: 'contract', label: 'Kontrak' },
  { value: 'intern', label: 'Intern' },
] as const

export const POSITIONS = [
  'Engineering',
  'Mobile',
  'Fullstack',
  'Frontend',
  'Backend',
  'Product',
  'QA',
] as const

export const LOCATIONS = [
  'Bandung',
  'Jakarta',
  'Yogyakarta',
  'Remote',
  'Surabaya',
  'Bali',
] as const

export const EXPERIENCES = [
  { value: 'lt_1', label: 'Kurang dari 1 tahun' },
  { value: '1_3', label: '1-3 tahun' },
  { value: '4_5', label: '4-5 tahun' },
  { value: '6_10', label: '6-10 tahun' },
  { value: 'gt_10', label: 'Lebih dari 10 tahun' },
] as const
