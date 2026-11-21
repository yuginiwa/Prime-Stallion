type ProjectPhoto = { file: string; alt: string; caption: string };

type Project = { slug: string; title: string; location: string; status: string; category: 'build' | 'renovate'; description: string; scope: string[]; photos: [ProjectPhoto, ...ProjectPhoto[]] };

export const projects: Project[] = [
  {
    slug: 'avida-settings-nuvali', title: 'Avida Settings Nuvali', location: 'Nuvali', status: 'Residential design and build', category: 'build',
    description: 'Prime Stallion designed and built this home at Avida Settings Nuvali. The project photos show early groundworks and the finished front façade.',
    scope: ['Residential design', 'Ground-up home construction'],
    photos: [
      { file: 'facade.webp', alt: 'Avida Settings Nuvali home showing the finished front façade', caption: 'Finished front façade' },
      { file: 'groundworks.webp', alt: 'Early groundworks with excavation and reinforcement at the Avida Settings Nuvali project', caption: 'Early groundworks' },
    ],
  },
  {
    slug: 'carmona-renovation', title: 'Second-floor renovation', location: 'Carmona, Cavite', status: 'Completed renovation', category: 'renovate',
    description: 'Prime Stallion renovated the second floor of an existing home in Carmona, including work on the façade, balcony, and interior areas.',
    scope: ['Second-floor renovation', 'Façade and balcony improvements', 'Interior improvements'],
    photos: [
      { file: 'facade.webp', alt: 'Carmona home showing the renovated façade and second-floor balcony', caption: 'Façade and balcony after renovation' },
      { file: 'balcony.webp', alt: 'Second-floor balcony at the Carmona renovation', caption: 'Balcony detail' },
      { file: 'interior.webp', alt: 'Interior room at the Carmona renovation', caption: 'Interior room' },
    ],
  },
  {
    slug: 'tamara-renovation', title: 'Interior renovation & fencing', location: 'Tanza, Cavite', status: 'Completed renovation', category: 'renovate',
    description: 'At Tamara Subdivision, Prime Stallion renovated interior areas and carried out fencing work. The gallery shows the interior, kitchen, and fence from later project stages.',
    scope: ['Interior renovation', 'Kitchen, bathroom, and staircase areas', 'Fencing'],
    photos: [
      { file: 'interior.webp', alt: 'Interior of the renovated Tamara home in Tanza', caption: 'Interior overview' },
      { file: 'kitchen.webp', alt: 'Kitchen at the Tamara interior renovation', caption: 'Kitchen detail' },
      { file: 'fence.webp', alt: 'Inside-facing view of the Tamara fence', caption: 'Fence detail' },
    ],
  },
  {
    slug: 'bellefort-renovation', title: 'Interior & exterior improvements', location: 'Bellefort', status: 'Completed renovation', category: 'renovate',
    description: 'The Bellefort renovation covered interior finishes and storage, exterior improvements, and electrical work.',
    scope: ['Interior tiling, painting, and under-stair cabinetry', 'Gate and fence, roofing and ceiling, exterior painting, and rear floor concreting', 'Electrical works'],
    photos: [
      { file: 'exterior.webp', alt: 'Bellefort home exterior showing the gate and covered entry', caption: 'Exterior and gate' },
      { file: 'cabinetry.webp', alt: 'Under-stair cabinet at the Bellefort renovation', caption: 'Under-stair cabinetry' },
      { file: 'tiling.webp', alt: 'Tiled interior floor at Bellefort', caption: 'Interior tiling' },
    ],
  },
];

export function photoPath(slug: string, file: string) { return `/projects/${slug}/${file}`; }
