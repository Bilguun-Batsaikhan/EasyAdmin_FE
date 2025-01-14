export interface AssetHistory {
  id: number;
  admin: string;
  user: string | null;
  modelName: string;
  status: string;
  action: string;
  date: Date | null;
  comment: string;
}
