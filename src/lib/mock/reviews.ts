import type { Review } from "@/lib/types";

export const reviews: Review[] = [
  {
    id: "rv-01",
    name: "Maliha Noor",
    initials: "MN",
    location: "Bashundhara, Dhaka",
    rating: 5,
    comment:
      "The excavator arrived before the crew did. Rafiul walked the operator through the drainage plan and stayed until the first trench was opened.",
    equipment: "CAT 320 Hydraulic Excavator",
    date: "2026-10-18",
  },
  {
    id: "rv-02",
    name: "Rifat Hasan",
    initials: "RH",
    location: "Mohakhali, Dhaka",
    rating: 5,
    comment:
      "Three interview days on the FX6 and not one hiccup. Batteries labelled, cards formatted, and the kit came in a case with room for our own matte box.",
    equipment: "Sony FX6 Cinema Line Body",
    date: "2026-10-04",
  },
  {
    id: "rv-03",
    name: "Tanvir Ahmed",
    initials: "TA",
    location: "Dhanmondi, Dhaka",
    rating: 4,
    comment:
      "Generator did the job through a six-hour load-shedding window. The cable run was 10m short for our layout, but the team brought a second reel the same evening.",
    equipment: "250kVA Silent Diesel Generator",
    date: "2026-09-22",
  },
  {
    id: "rv-04",
    name: "Shreya Das",
    initials: "SD",
    location: "Agrabad, Chattogram",
    rating: 5,
    comment:
      "Tractor and operator for four days of paddy prep. Turned up at 6am, fuel was exactly as quoted, and Mahin checked the field before taking payment.",
    equipment: "Massey Ferguson 385 Tractor",
    date: "2026-09-09",
  },
  {
    id: "rv-05",
    name: "Arafat Karim",
    initials: "AK",
    location: "Gulshan, Dhaka",
    rating: 5,
    comment:
      "The LED wall was built and tested by 2pm for a 7pm launch. One spare panel was already on site, which turned out to matter. Zero flicker on camera.",
    equipment: "LED Wall P3.9 — 5m × 3m",
    date: "2026-08-27",
  },
  {
    id: "rv-06",
    name: "Nabila Sultana",
    initials: "NS",
    location: "Uttara, Dhaka",
    rating: 4,
    comment:
      "Fifty chairs, a tent and a stage for my sister's wedding. Everything was counted and clean. The crew came back for the weights the next morning, which saved us the trip.",
    equipment: "10m × 10m Pagoda Tent",
    date: "2026-08-12",
  },
];

export const featuredReviews = reviews.slice(0, 3);
