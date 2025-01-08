import { AssetStatus } from '../enumeration/AssetStatus';
export interface Asset {
  id?: number;
  modelName: string;
  type: string;
  status: AssetStatus;
  cost: number;
  username: string;
}
