import { TicketPriority } from '../enumeration/TicketPriority';
import { TicketType } from '../enumeration/TicketType';

export interface CreateTicket {
  title: string;
  context: string;
  ticketType: TicketType;
  priority: TicketPriority;
  assetId: number | null;
}
