import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  campaigns as seedCampaigns,
  events as seedEvents,
  myDonations as seedDonations,
  notifications as seedNotifications,
  orphans as seedOrphans,
  type Campaign,
  type CalendarEvent,
  type Donation,
  type Notification,
  type Orphan,
} from "@/data/orphany";

type NotificationPreference = {
  id: string;
  label: string;
  on: boolean;
};

type ProfileState = {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  memberSince: number;
};

type VolunteerNote = {
  id: string;
  orphanId: string;
  note: string;
  createdAt: string;
};

type AddCampaignInput = {
  name: string;
  description: string;
  goal: number;
  category: Campaign["category"];
  endsAt: string;
};

type AddOrphanInput = {
  name: string;
  age: number;
  location: string;
  story: string;
  monthlyCost: number;
  urgency: Orphan["urgency"];
  needs: string[];
};

type UpdateProfileInput = {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
};

type OrphanyStoreValue = {
  campaigns: Campaign[];
  orphans: Orphan[];
  donations: Donation[];
  notifications: Notification[];
  events: CalendarEvent[];
  profile: ProfileState;
  notificationPreferences: NotificationPreference[];
  volunteerNotes: VolunteerNote[];
  addCampaign: (input: AddCampaignInput) => void;
  addOrphan: (input: AddOrphanInput) => void;
  donateToCampaign: (campaignId: string, amount: number) => void;
  sponsorOrphan: (orphanId: string, amount: number) => void;
  addVolunteerNote: (orphanId: string, note: string) => void;
  updateProfile: (input: UpdateProfileInput) => void;
  setNotificationPreference: (id: string, on: boolean) => void;
};

type PersistedOrphanyState = {
  campaigns: Campaign[];
  orphans: Orphan[];
  donations: Donation[];
  notifications: Notification[];
  events: CalendarEvent[];
  profile: ProfileState;
  notificationPreferences: NotificationPreference[];
  volunteerNotes: VolunteerNote[];
};

const initialPreferences: NotificationPreference[] = [
  { id: "monthly-reminders", label: "Monthly sponsorship reminders", on: true },
  { id: "child-updates", label: "Updates from sponsored orphans", on: true },
  { id: "campaign-news", label: "New campaigns and milestones", on: false },
  { id: "tax-receipts", label: "Tax receipts by email", on: true },
];

const OrphanyStoreContext = createContext<OrphanyStoreValue | null>(null);
const STORAGE_KEY = "orphany.store.v1";

const makeId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
const today = () => new Date().toISOString().slice(0, 10);
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export function OrphanyStoreProvider({ children }: { children: ReactNode }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(seedCampaigns);
  const [orphans, setOrphans] = useState<Orphan[]>(seedOrphans);
  const [donations, setDonations] = useState<Donation[]>(seedDonations);
  const [notifications, setNotifications] = useState<Notification[]>(seedNotifications);
  const [events, setEvents] = useState<CalendarEvent[]>(seedEvents);
  const [profile, setProfile] = useState<ProfileState>({
    firstName: "Sara",
    lastName: "Ahmed",
    email: "sara.ahmed@example.com",
    bio: "Passionate about education-focused sponsorship.",
    memberSince: 2024,
  });
  const [notificationPreferences, setNotificationPreferences] =
    useState<NotificationPreference[]>(initialPreferences);
  const [volunteerNotes, setVolunteerNotes] = useState<VolunteerNote[]>([]);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const imageCursorRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }

      const parsed: unknown = JSON.parse(raw);
      if (!isRecord(parsed)) {
        return;
      }

      if (Array.isArray(parsed.campaigns)) {
        setCampaigns(parsed.campaigns as Campaign[]);
      }
      if (Array.isArray(parsed.orphans)) {
        setOrphans(parsed.orphans as Orphan[]);
      }
      if (Array.isArray(parsed.donations)) {
        setDonations(parsed.donations as Donation[]);
      }
      if (Array.isArray(parsed.notifications)) {
        setNotifications(parsed.notifications as Notification[]);
      }
      if (Array.isArray(parsed.events)) {
        setEvents(parsed.events as CalendarEvent[]);
      }
      if (Array.isArray(parsed.notificationPreferences)) {
        setNotificationPreferences(parsed.notificationPreferences as NotificationPreference[]);
      }
      if (Array.isArray(parsed.volunteerNotes)) {
        setVolunteerNotes(parsed.volunteerNotes as VolunteerNote[]);
      }
      if (isRecord(parsed.profile)) {
        setProfile({
          firstName:
            typeof parsed.profile.firstName === "string" ? parsed.profile.firstName : "Sara",
          lastName: typeof parsed.profile.lastName === "string" ? parsed.profile.lastName : "Ahmed",
          email:
            typeof parsed.profile.email === "string"
              ? parsed.profile.email
              : "sara.ahmed@example.com",
          bio:
            typeof parsed.profile.bio === "string"
              ? parsed.profile.bio
              : "Passionate about education-focused sponsorship.",
          memberSince:
            typeof parsed.profile.memberSince === "number"
              ? parsed.profile.memberSince
              : 2024,
        });
      }
    } catch {
      // Ignore invalid storage payloads and fall back to defaults.
    } finally {
      setIsStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isStorageReady) {
      return;
    }

    const payload: PersistedOrphanyState = {
      campaigns,
      orphans,
      donations,
      notifications,
      events,
      profile,
      notificationPreferences,
      volunteerNotes,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [
    campaigns,
    donations,
    events,
    isStorageReady,
    notificationPreferences,
    notifications,
    orphans,
    profile,
    volunteerNotes,
  ]);

  const addFeedItem = (title: string, body: string) => {
    setNotifications((prev) => [{ id: makeId("n"), title, body, time: "Just now", unread: true }, ...prev]);
  };

  const addCampaign = (input: AddCampaignInput) => {
    const campaign: Campaign = {
      id: makeId("c"),
      name: input.name.trim(),
      description: input.description.trim(),
      goal: Math.max(1, Math.round(input.goal)),
      raised: 0,
      category: input.category,
      endsAt: input.endsAt || today(),
    };
    setCampaigns((prev) => [campaign, ...prev]);
    addFeedItem("Campaign created", `${campaign.name} is now live for donations.`);
  };

  const addOrphan = (input: AddOrphanInput) => {
    const nextImage = seedOrphans[imageCursorRef.current % seedOrphans.length]?.image ?? seedOrphans[0]?.image;
    imageCursorRef.current += 1;
    const orphan: Orphan = {
      id: makeId("o"),
      name: input.name.trim(),
      age: Math.max(1, Math.round(input.age)),
      status: "Awaiting Sponsor",
      urgency: input.urgency,
      needs: input.needs.length ? input.needs : ["Education"],
      monthlyCost: Math.max(1, Math.round(input.monthlyCost)),
      raised: 0,
      image: nextImage,
      story: input.story.trim(),
      location: input.location.trim(),
    };
    setOrphans((prev) => [orphan, ...prev]);
    addFeedItem("Orphan profile added", `${orphan.name} is now visible to sponsors.`);
  };

  const donateToCampaign = (campaignId: string, amount: number) => {
    const donationAmount = Math.max(1, Math.round(amount));
    const target = campaigns.find((campaign) => campaign.id === campaignId);
    if (!target) {
      return;
    }

    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.id === campaignId ? { ...campaign, raised: campaign.raised + donationAmount } : campaign,
      ),
    );
    setDonations((prev) => [
      {
        id: makeId("d"),
        amount: donationAmount,
        date: today(),
        type: "Campaign",
        target: target.name,
        status: "Completed",
      },
      ...prev,
    ]);
    setEvents((prev) => [
      {
        id: makeId("e"),
        date: today(),
        title: `Donation $${donationAmount} to ${target.name}`,
        kind: "donation",
      },
      ...prev,
    ]);
    addFeedItem("Donation completed", `$${donationAmount} added to ${target.name}.`);
  };

  const sponsorOrphan = (orphanId: string, amount: number) => {
    const monthlyAmount = Math.max(1, Math.round(amount));
    const target = orphans.find((orphan) => orphan.id === orphanId);
    if (!target) {
      return;
    }

    setOrphans((prev) =>
      prev.map((orphan) => {
        if (orphan.id !== orphanId) {
          return orphan;
        }
        const raised = Math.min(orphan.monthlyCost, orphan.raised + monthlyAmount);
        const status =
          raised >= orphan.monthlyCost
            ? "Sponsored"
            : raised > 0
              ? "Partially Funded"
              : "Awaiting Sponsor";
        return { ...orphan, raised, status };
      }),
    );
    setDonations((prev) => [
      {
        id: makeId("d"),
        amount: monthlyAmount,
        date: today(),
        type: "Sponsorship",
        target: target.name,
        status: "Completed",
      },
      ...prev,
    ]);
    setEvents((prev) => [
      {
        id: makeId("e"),
        date: today(),
        title: `Sponsorship $${monthlyAmount} — ${target.name}`,
        kind: "donation",
      },
      ...prev,
    ]);
    addFeedItem("Sponsorship confirmed", `You pledged $${monthlyAmount}/mo for ${target.name}.`);
  };

  const addVolunteerNote = (orphanId: string, note: string) => {
    const text = note.trim();
    if (!text) {
      return;
    }
    const target = orphans.find((orphan) => orphan.id === orphanId);
    setVolunteerNotes((prev) => [
      { id: makeId("vn"), orphanId, note: text, createdAt: new Date().toISOString() },
      ...prev,
    ]);
    if (target) {
      addFeedItem("Volunteer note added", `New progress note saved for ${target.name}.`);
    }
  };

  const updateProfile = (input: UpdateProfileInput) => {
    setProfile((prev) => ({ ...prev, ...input }));
    addFeedItem("Profile updated", "Your account details were saved successfully.");
  };

  const setNotificationPreference = (id: string, on: boolean) => {
    setNotificationPreferences((prev) =>
      prev.map((preference) => (preference.id === id ? { ...preference, on } : preference)),
    );
  };

  const value = useMemo<OrphanyStoreValue>(
    () => ({
      campaigns,
      orphans,
      donations,
      notifications,
      events,
      profile,
      notificationPreferences,
      volunteerNotes,
      addCampaign,
      addOrphan,
      donateToCampaign,
      sponsorOrphan,
      addVolunteerNote,
      updateProfile,
      setNotificationPreference,
    }),
    [
      campaigns,
      donations,
      events,
      notificationPreferences,
      notifications,
      orphans,
      profile,
      volunteerNotes,
    ],
  );

  return <OrphanyStoreContext.Provider value={value}>{children}</OrphanyStoreContext.Provider>;
}

export function useOrphanyStore() {
  const context = useContext(OrphanyStoreContext);
  if (!context) {
    throw new Error("useOrphanyStore must be used within OrphanyStoreProvider");
  }
  return context;
}
