import type { Outage } from '../types/outage';

const LOCATIONS = [
  'Downtown District', 'West Side', 'North End', 'East Side', 'South District',
  'Industrial Park Zone', 'Maple Grove Area', 'Commerce Center', 'Riverfront',
  'Uptown Heights', 'Tech Hub', 'University Campus', 'Old Town', 'Airport Road',
  'Suburban Sprawl', 'Harbor View', 'Valley Basin', 'Hillside Residential',
  'Retail Boulevard', 'Medical District'
];

const STREET_PREFIXES = ['1st', '2nd', '3rd', '4th', 'Main', 'Oak', 'Pine', 'Maple', 'Cedar', 'Elm', 'Washington', 'Lake', 'Hill', 'Park', 'River'];
const STREET_SUFFIXES = ['Ave', 'St', 'Blvd', 'Rd', 'Ln', 'Dr', 'Ct', 'Way'];

const DESCRIPTIONS = [
  'Transformer failure affecting multiple buildings',
  'Storm damage to overhead lines',
  'Underground cable fault',
  'Equipment malfunction at substation',
  'Fallen tree on power lines',
  'Vehicle collision with utility pole',
  'Scheduled maintenance and upgrades',
  'Overload due to extreme weather conditions',
  'Wildlife interference with equipment',
  'Unknown cause, currently under investigation'
];

const STATUSES: ('investigating' | 'repairing' | 'resolved')[] = ['investigating', 'repairing', 'resolved'];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem<T>(array: T[]): T {
  return array[getRandomInt(0, array.length - 1)];
}

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function generateMockOutages(count: number): Outage[] {
  const outages: Outage[] = [];
  const now = Date.now();

  const targetInvestigating = 34;
  const targetRepairing = 43;
  const targetResolved = Math.max(0, count - (targetInvestigating + targetRepairing));
  const fixedStatuses: ('investigating' | 'repairing' | 'resolved')[] = [
    ...Array(targetInvestigating).fill('investigating'),
    ...Array(targetRepairing).fill('repairing'),
    ...Array(targetResolved).fill('resolved')
  ];

  const statusPool = shuffleArray(fixedStatuses);

  for (let i = 0; i < count; i++) {
    const status = statusPool[i];
    const reportedAgoMinutes = getRandomInt(5, 60 * 72); // Between 5 mins and 72 hours ago
    const reportedAt = new Date(now - reportedAgoMinutes * 60000);
    
    let estimatedRestoration: Date | undefined;
    if (status !== 'resolved') {
      const restInMinutes = getRandomInt(20, 60 * 30); // Between 20 mins and 30 hours from now
      estimatedRestoration = new Date(now + restInMinutes * 60000);
    }

    const affectedUsers = getRandomInt(10, 50000);
    const location = getRandomItem(LOCATIONS);
    const address = `${getRandomInt(10, 9999)} ${getRandomItem(STREET_PREFIXES)} ${getRandomItem(STREET_SUFFIXES)}`;

    // Give some outages a description, but not all
    const description = Math.random() > 0.3 ? getRandomItem(DESCRIPTIONS) : undefined;

    outages.push({
      id: `outage-${i + 1}-${Date.now()}`,
      location,
      address,
      status,
      reportedAt,
      estimatedRestoration,
      affectedUsers,
      description
    });
  }

  return outages.sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime());
}

export const MOCK_OUTAGES = generateMockOutages(120);
