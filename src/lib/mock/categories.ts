import type { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    id: "construction",
    name: "Construction",
    short: "Construction",
    code: "CO",
    description: "Excavators, breakers, mixers and compactors.",
    count: 4,
  },
  {
    id: "photography",
    name: "Photography",
    short: "Photo",
    code: "PH",
    description: "Cinema bodies, glass, lighting and grips.",
    count: 4,
  },
  {
    id: "vehicles",
    name: "Vehicles",
    short: "Vehicles",
    code: "VH",
    description: "Trailers, vans, lifts and light trucks.",
    count: 4,
  },
  {
    id: "agriculture",
    name: "Agriculture",
    short: "Agri",
    code: "AG",
    description: "Tractors, tillers, pumps and sprayers.",
    count: 4,
  },
  {
    id: "electronics",
    name: "Electronics",
    short: "Electronics",
    code: "EL",
    description: "Projectors, LED walls, mixers and PA.",
    count: 4,
  },
  {
    id: "event",
    name: "Event",
    short: "Event",
    code: "EV",
    description: "Generators, staging, seating and tents.",
    count: 4,
  },
];

export const categoryById = (id: string) =>
  categories.find((category) => category.id === id);
