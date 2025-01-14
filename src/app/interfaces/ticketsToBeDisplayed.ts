import { TicketPriority } from '../enumeration/TicketPriority';
import { TicketStatus } from '../enumeration/TicketStatus';

export interface TicketsToBeDisplayed {
  id?: number;
  modelName: string;
  username: string;
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  issuedAt: Date | null;
}
