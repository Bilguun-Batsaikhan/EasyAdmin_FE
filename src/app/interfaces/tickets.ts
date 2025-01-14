import { TicketPriority } from '../enumeration/TicketPriority';
import { TicketStatus } from '../enumeration/TicketStatus';
import { TicketType } from '../enumeration/TicketType';

export interface Ticket {
  id?: number;
  modelName: string;
  username: string;
  title: string;
  context: string; // in the popup
  ticketType: TicketType; // in the popup
  status: TicketStatus;
  priority: TicketPriority;
  issuedAt: Date | null;
  closedAt: Date | null; //in the popup
  resolutionDetails: string; //in the popup
  lastUpdatedAt: Date | null; //in the popup
}
