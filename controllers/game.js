import { gamesData } from "../data/gamesData.js";
import { formatter, calculateSubTotal } from "../services/functions.js";

export const home = (req, res) => {
  res.render("home");
};

export const games = (req, res) => {
  if (!req.session.selected) req.session.selected = [];
  if (!req.session.subTotal) req.session.subTotal = 0;
  req.session.games = gamesData;
  res.render("games", {
    gamesSelection: req.session.games,
    gamesSelected: req.session.selected,
    subTotal: formatter.format(req.session.subTotal),
  });
};

export const addGame = (req, res) => {
  if (!req.session.selected) req.session.selected = [];
  const game = req.body.name;
  req.session.selected.push(game);
  const subTotal = calculateSubTotal(req.session.selected);
  req.session.subTotal = subTotal;
  res.json({ selected: game, subTotal: formatter.format(subTotal) });
};

export const removeGame = (req, res) => {
    if (!req.session.selected) req.session.selected = []
    const game = req.body.name;
    const newSelection = req.session.selected.filter(g => g !== game)
    req.session.selected = newSelection
    const subTotal = calculateSubTotal(req.session.selected);
    req.session.subTotal = subTotal;
    res.json({ selected: game, subTotal: formatter.format(subTotal) });
};
