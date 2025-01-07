export interface AssetHistory {
  id: number;
  assetId: number;
  adminId: number;
  userId: number | null;
  status: string;
  action: string;
  date: string;
  comment: string;
}
