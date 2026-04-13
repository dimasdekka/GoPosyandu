import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateAgePosyandu(birthDate: string | Date): string {
  if (!birthDate) return "-";
  const born = new Date(birthDate);
  if (isNaN(born.getTime())) return "-";
  const now = new Date();
  
  // Total diff in days
  const diffTime = Math.abs(now.getTime() - born.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const totalMonths = (now.getFullYear() - born.getFullYear()) * 12 + (now.getMonth() - born.getMonth());
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  // Case 1: Over 2 Years -> X Thn Y Bln
  if (totalMonths >= 24) {
    if (months === 0) return `${years} Thn`;
    return `${years} Thn ${months} Bln`;
  }

  // Case 2: Under 2 Years (Bayi/Batita)
  // Precise weeks calculation from remaining days in the latest month
  const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const daysInMonth = lastMonth.getDate();
  
  let remDays = now.getDate() - born.getDate();
  if (remDays < 0) {
    remDays += daysInMonth; 
  }
  const weeks = Math.floor(remDays / 7);

  if (totalMonths === 0) {
    return `${weeks > 0 ? weeks : 0} Mgg`;
  }
  
  if (weeks === 0) return `${totalMonths} Bln`;
  return `${totalMonths} Bln ${weeks} Mgg`;
}
