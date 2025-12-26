
export interface TicketingData {
  platform: 'Ticketmaster' | 'Eventbrite' | 'Local POS';
  sales: number;
  occupancy: number;
  lastSync: string;
  status: 'connected' | 'syncing' | 'error';
}

export const fetchTicketingData = async (): Promise<TicketingData[]> => {
  // Simulating network latency
  await new Promise(resolve => setTimeout(resolve, 1500));

  return [
    {
      platform: 'Ticketmaster',
      sales: 12450 + Math.random() * 1000,
      occupancy: 0.85 + Math.random() * 0.1,
      lastSync: new Date().toLocaleTimeString(),
      status: 'connected'
    },
    {
      platform: 'Eventbrite',
      sales: 8200 + Math.random() * 500,
      occupancy: 0.72 + Math.random() * 0.05,
      lastSync: new Date().toLocaleTimeString(),
      status: 'connected'
    },
    {
      platform: 'Local POS',
      sales: 4192 + Math.random() * 200,
      occupancy: 0.94,
      lastSync: new Date().toLocaleTimeString(),
      status: 'connected'
    }
  ];
};
