"use client";

import {
  Home,
  ShoppingCart,
  CreditCard,
  Users,
  Star,
  CheckCircle2,
  Sparkles,
  Instagram,
  Twitter,
  Music,
  Trash2,
  ShoppingBag,
  DollarSign,
} from "lucide-react";

export const prefixes = ["Room", "Flat", "House", "Soul"];

export const featureHighlights = [
  {
    icon: Trash2,
    title: "Chores",
    description: "Assign, repeat, done. No chasing, no nagging.",
    emoji: "🧹",
  },
  {
    icon: ShoppingBag,
    title: "Groceries",
    description: "Add once, auto-merge. No duplicate buys.",
    emoji: "🛒",
  },
  {
    icon: DollarSign,
    title: "Ledger",
    description: "Split bills instantly. No awkward reminders.",
    emoji: "💸",
  },
];

export const beforeAfter = {
  before: [
    "Wait, who's on trash duty?",
    "Didn't we already have milk?",
    "Who paid the water bill?",
  ],
  after: [
    "Clear tasks, clear deadlines.",
    "Synced grocery lists.",
    "Auto expense splits.",
  ],
};

export const testimonials = [
  {
    text: "We ditched 3 apps for this. My roommate actually enjoys splitting chores now.",
    author: "Priya",
    location: "Mumbai",
    rating: 5,
  },
  {
    text: "This feels more like a lifestyle app than a utility. Gorgeous design.",
    author: "Alex",
    location: "London",
    rating: 5,
  },
  {
    text: "We finally stopped fighting over who bought milk last.",
    author: "Jordan",
    location: "NYC",
    rating: 5,
  },
];

export const faqs = [
  {
    q: "Can I use it with just one roommate?",
    a: "Absolutely! Mates works perfectly for 2 people or 10+. Scale it to your household size.",
  },
  {
    q: "Does it work offline?",
    a: "Yes! Add tasks, update lists, and track expenses offline. Everything syncs when you're back online.",
  },
  {
    q: "Is it free?",
    a: "Beta is completely free. We'll introduce premium features later (custom themes, analytics, unlimited households).",
  },
  {
    q: "What about privacy?",
    a: "Your data stays private. We use bank-level encryption and never sell your information.",
  },
];

export const features = [
  {
    icon: Home,
    title: "Smart Chores",
    description:
      "Assign, track, repeat. AI suggests fair rotations and sends gentle reminders.",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: ShoppingCart,
    title: "Shared Shopping",
    description:
      "Collaborative lists with smart merge. Never buy duplicates again.",
    color: "from-pink-500 to-pink-600",
    bgColor: "bg-pink-50",
  },
  {
    icon: CreditCard,
    title: "Easy Splitting",
    description:
      "Automatic bill splitting with receipt scanning. No more awkward money talks.",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
  },
];

export const stats = [
  { number: "15K+", label: "Happy Households", icon: Users },
  { number: "50K+", label: "Tasks Completed", icon: CheckCircle2 },
  { number: "4.9/5", label: "App Store Rating", icon: Star },
  { number: "12", label: "Countries", icon: Sparkles },
];

export const socialLinks = [
  { icon: Instagram, href: "#" },
  { icon: Twitter, href: "#" },
  { icon: Music, href: "#" },
];
