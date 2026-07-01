export type PhotoTone = "sea" | "harbour" | "sand" | "dusk" | "olive" | "stone";

export const captains = [
  {
    name: "Milan V.",
    location: "Bar",
    languages: "Montenegrin · English · Italian",
    introduction:
      "He begins with strong coffee, explains every knot without hurrying, and never pretends a quiet sea owes anyone a fish.",
    imageLabel: "Portrait placeholder — captain preparing lines before sunrise",
    tone: "harbour" as PhotoTone,
  },
  {
    name: "Jelena M.",
    location: "Budva",
    languages: "Montenegrin · English",
    introduction:
      "She notices when a guest needs a story, when they need an explanation, and when the best thing on board is silence.",
    imageLabel: "Portrait placeholder — captain at the helm in natural light",
    tone: "sea" as PhotoTone,
  },
  {
    name: "Nikola R.",
    location: "Bar",
    languages: "Montenegrin · English · German",
    introduction:
      "On slow mornings he changes the rig, cuts fruit for the children and turns the waiting into a lesson about currents.",
    imageLabel: "Portrait placeholder — captain checking the morning weather",
    tone: "dusk" as PhotoTone,
  },
];

export const stories = [
  {
    title: "The knot tied twice",
    excerpt:
      "A child forgets the first knot before the line reaches the water. The captain starts again, more slowly this time.",
    imageLabel: "Story placeholder — hands teaching a simple fishing knot",
    tone: "stone" as PhotoTone,
  },
  {
    title: "A tuna, there for a second",
    excerpt:
      "No photograph, no catch. Just one dark shape breaking the surface and three people seeing it at the same time.",
    imageLabel: "Story placeholder — quiet open water beyond the boat",
    tone: "sea" as PhotoTone,
  },
  {
    title: "Coffee before the harbour wakes",
    excerpt:
      "The rods can wait. First comes a small metal pot, two cups and the weather moving down from the hills.",
    imageLabel: "Story placeholder — coffee beside rope on a working boat",
    tone: "sand" as PhotoTone,
  },
];

export const destinations = [
  {
    name: "Bar",
    description:
      "A working port, old fishing habits and mornings that begin while the town is still quiet. Bar faces open water and keeps its stories close to the marina.",
    imageLabel: "Destination placeholder — Bar harbour in early morning light",
    tone: "harbour" as PhotoTone,
  },
  {
    name: "Budva",
    description:
      "Small boats leave beside a waterfront that changes character before the streets fill. Here, local knowledge lives between the old coast and busy summer water.",
    imageLabel: "Destination placeholder — Budva shoreline from a small boat",
    tone: "dusk" as PhotoTone,
  },
];

export const seaPractices = [
  {
    title: "Bring back what does not belong",
    text: "A rubbish bag travels on every boat. Floating plastic comes ashore when it can be collected safely.",
    imageLabel: "Photography placeholder — hands collecting floating plastic",
    tone: "olive" as PhotoTone,
  },
  {
    title: "Leave room on the water",
    text: "Other boats, working lines and quiet fishing grounds are given the space they need.",
    imageLabel: "Photography placeholder — two working boats with clear water between them",
    tone: "sea" as PhotoTone,
  },
  {
    title: "Take only what will be used",
    text: "Fish are handled with care, released when appropriate, and never kept merely to make a photograph.",
    imageLabel: "Photography placeholder — careful release beside a small boat",
    tone: "stone" as PhotoTone,
  },
];
