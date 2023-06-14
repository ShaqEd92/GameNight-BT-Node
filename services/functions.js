import { gamesData } from "../data/gamesData.js";

export const calculateSubTotal = (gamesSelected) => {
  let subTotal = 0;
  const gamesDataCopy = gamesData.map((c) => Object.assign({}, c));
  for (let i = 0; i < gamesSelected.length; i++) {
    for (let j = 0; j < gamesDataCopy.length; j++) {
      if (gamesSelected[i] === gamesDataCopy[j].name) {
        subTotal += Number(gamesDataCopy[j].price);
      }
    }
  }
  return subTotal;
};

export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export const generateOrderID = () => {
  const selection =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVQXYZ0123456789";
  let id = "";
  for (let i = 0; i < 10; i++) {
    id += selection[Math.floor(Math.random() * 62)];
  }
  return id;
};
