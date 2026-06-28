export interface Issue {
  id: number;
  title: string;
  description: string;
  status: string;
  tags: string[];
  createdAt: string; // The .NET API will return a standard ISO 8601 string
}
