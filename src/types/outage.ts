export interface Outage {
  id: string;
  location: string;
  address: string;
  status: 'investigating' | 'repairing' | 'resolved';
  reportedAt: Date;
  estimatedRestoration?: Date;
  affectedUsers: number;
  description?: string;
}
