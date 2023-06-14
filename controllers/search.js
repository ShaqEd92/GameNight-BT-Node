import gateway from "../lib/gateway.js";

export const searchPage = (req, res) => {
  if (!req.session.transactionData) req.session.transactionData = [];
  res.render("search", { transactionList: req.session.transactionData });
};

export const transactionSearch = (req, res) => {
  const today = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  req.session.transactionData = [];

  const transactionStream = gateway.transaction.search((search) => {
    search.createdAt().between(threeMonthsAgo, today);
  });

  transactionStream.on("data", (transaction) => {
    req.session.transactionData.push(transaction);
  });
  transactionStream.on("end", () => {
    res.render("searchResults", {
      transactionList: req.session.transactionData,
    });
  });
};
