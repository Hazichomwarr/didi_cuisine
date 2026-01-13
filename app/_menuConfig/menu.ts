//_menuConfig/menu.ts

import { Menu } from "../_models/order";

export const MENU = {
  dibi: {
    id: "dibi",
    label: "Grilled Goat (Dibi)",
    price: 15,
  },
  "jollof-rice": {
    id: "jollof-rice",
    label: "Jollof Rice (Riz Gras)",
    price: 5.99,
  },
  chicken: {
    id: "chicken",
    label: "Roasted chicken (Pintade)",
    price: 15,
  },
  "jollof-chicken": {
    id: "jollof-chicken",
    label: "Mix jollof + Chicken",
    price: 15,
  },
  "jollof-dibi": {
    id: "jollof-dibi",
    label: "Mix jollof + Dibi",
    price: 15,
  },
  alloco: {
    id: "alloco",
    label: "Fried plantain (Alloco)",
    price: 4.99,
  },
} satisfies Menu;
