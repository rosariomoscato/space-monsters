export const site = {
  name: "Space Monsters",
  description: "Space Monsters: gioco arcade spaziale 8-bit per computer e telefono. A free 8-bit space arcade game for desktop and mobile.",
};

export const siteUrl = (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const publicPages = [
  { path: "/", title: site.name, summary: "Gioco arcade bilingue a una sola ondata / Bilingual one-wave arcade game, with keyboard and touch controls." },
];
