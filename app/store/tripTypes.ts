export interface Trip {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  visaRequired: boolean;
  user: string;
  days: string[];
  expenses: string[];
  budget: number;
}
