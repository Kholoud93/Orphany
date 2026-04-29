import o1 from "@/assets/orphan-1.jpg";
import o2 from "@/assets/orphan-2.jpg";
import o3 from "@/assets/orphan-3.jpg";
import o4 from "@/assets/orphan-4.jpg";
import o5 from "@/assets/orphan-5.jpg";
import o6 from "@/assets/orphan-6.jpg";

export type Role = "admin" | "donor" | "volunteer";

export type Orphan = {
  id: string;
  name: string;
  age: number;
  status: "Sponsored" | "Partially Funded" | "Awaiting Sponsor";
  urgency: "Low" | "Medium" | "High";
  needs: string[];
  monthlyCost: number;
  raised: number;
  image: string;
  story: string;
  location: string;
};

export const orphans: Orphan[] = [
  { id: "o1", name: "Yusuf A.", age: 7, status: "Partially Funded", urgency: "Medium", needs: ["Education", "Clothing"], monthlyCost: 80, raised: 52, image: o1, story: "Loves drawing and football. Top of his class in math.", location: "Amman, Jordan" },
  { id: "o2", name: "Amina K.", age: 9, status: "Awaiting Sponsor", urgency: "High", needs: ["Medical", "Food"], monthlyCost: 120, raised: 18, image: o2, story: "Recovering from surgery. Dreams of becoming a doctor.", location: "Nairobi, Kenya" },
  { id: "o3", name: "Bilal R.", age: 11, status: "Sponsored", urgency: "Low", needs: ["Education"], monthlyCost: 75, raised: 75, image: o3, story: "Avid reader, learning English and coding.", location: "Istanbul, Turkey" },
  { id: "o4", name: "Layla M.", age: 6, status: "Partially Funded", urgency: "Medium", needs: ["Food", "Clothing"], monthlyCost: 70, raised: 44, image: o4, story: "Cheerful and curious. Loves butterflies and stories.", location: "Karachi, Pakistan" },
  { id: "o5", name: "Omar T.", age: 10, status: "Awaiting Sponsor", urgency: "High", needs: ["Education", "Medical"], monthlyCost: 95, raised: 12, image: o5, story: "Wants to be an engineer. Needs glasses and tutoring.", location: "Beirut, Lebanon" },
  { id: "o6", name: "Hana S.", age: 5, status: "Sponsored", urgency: "Low", needs: ["Food"], monthlyCost: 60, raised: 60, image: o6, story: "Always laughing. Started kindergarten this year.", location: "Cairo, Egypt" },
];

export type Campaign = {
  id: string;
  name: string;
  description: string;
  goal: number;
  raised: number;
  category: "Ramadan" | "Education" | "Medical" | "Emergency";
  endsAt: string;
};

export const campaigns: Campaign[] = [
  { id: "c1", name: "Ramadan Food Baskets", description: "Provide monthly food baskets to 500 families during Ramadan.", goal: 50000, raised: 32400, category: "Ramadan", endsAt: "2026-05-20" },
  { id: "c2", name: "Back to School", description: "School supplies and uniforms for orphans aged 5–15.", goal: 25000, raised: 18900, category: "Education", endsAt: "2026-08-15" },
  { id: "c3", name: "Emergency Medical Fund", description: "Surgeries and treatment for orphans in critical condition.", goal: 80000, raised: 21500, category: "Medical", endsAt: "2026-12-31" },
  { id: "c4", name: "Winter Warmth Drive", description: "Coats, blankets and heating for cold-region shelters.", goal: 18000, raised: 15200, category: "Emergency", endsAt: "2026-11-30" },
];

export type Donation = {
  id: string;
  amount: number;
  date: string;
  type: "Sponsorship" | "Campaign" | "One-time";
  target: string;
  status: "Completed" | "Upcoming" | "Pending";
};

export const myDonations: Donation[] = [
  { id: "d1", amount: 80, date: "2026-04-01", type: "Sponsorship", target: "Yusuf A.", status: "Completed" },
  { id: "d2", amount: 250, date: "2026-03-22", type: "Campaign", target: "Ramadan Food Baskets", status: "Completed" },
  { id: "d3", amount: 80, date: "2026-05-01", type: "Sponsorship", target: "Yusuf A.", status: "Upcoming" },
  { id: "d4", amount: 100, date: "2026-02-14", type: "One-time", target: "General Fund", status: "Completed" },
  { id: "d5", amount: 150, date: "2026-05-10", type: "Campaign", target: "Emergency Medical Fund", status: "Upcoming" },
];

export type CalendarEvent = {
  id: string;
  date: string;
  title: string;
  kind: "donation" | "reminder" | "update";
};

export const events: CalendarEvent[] = [
  { id: "e1", date: "2026-04-29", title: "Monthly sponsorship — Yusuf A.", kind: "reminder" },
  { id: "e2", date: "2026-05-01", title: "Auto-donation $80", kind: "donation" },
  { id: "e3", date: "2026-05-05", title: "Update from Bilal R.", kind: "update" },
  { id: "e4", date: "2026-05-10", title: "Pledge to Medical Fund", kind: "donation" },
  { id: "e5", date: "2026-05-20", title: "Ramadan campaign closes", kind: "reminder" },
];

export type Notification = {
  id: string;
  title: string;
  body: string;
  time: string;
  unread?: boolean;
};

export const notifications: Notification[] = [
  { id: "n1", title: "Sponsorship reminder", body: "Your monthly sponsorship for Yusuf A. is due May 1.", time: "2h ago", unread: true },
  { id: "n2", title: "New update", body: "Bilal R. just finished his school term — see report.", time: "1d ago", unread: true },
  { id: "n3", title: "Campaign milestone", body: "Ramadan Food Baskets reached 65% of its goal!", time: "3d ago" },
];
