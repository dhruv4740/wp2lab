// Exp 8: query with a comparison operator ($gt) and a descending sort.
import { students } from '../db.js';

// Eligible for scholarship: CGPA greater than 9
export async function scholarshipList() {
  return (await students()).find({ cgpa: { $gt: 9 } }).sort({ cgpa: -1 }).toArray();
}
