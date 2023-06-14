import gateway from "../lib/gateway.js";
import { formatter, generateOrderID } from "../services/functions.js";

export const addressForm = (req, res) => {
  if (!req.session.selected) req.session.selected = [];
  if (req.session.selected.length === 0) res.redirect("/games");
  if (!req.session.sameBillingAndShipping)
    req.session.sameBillingAndShipping = "checked";
  if (!req.session.billingInformation) {
    req.session.billingInformation = {
      firstName: "",
      lastName: "",
      streetAddress: "",
      extendedAddress: "",
      locality: "",
      region: "",
      postalCode: "",
    };
  }
  if (!req.session.shippingInformation) {
    req.session.shippingInformation = {
      firstName: "",
      lastName: "",
      streetAddress: "",
      extendedAddress: "",
      locality: "",
      region: "",
      postalCode: "",
    };
  }
  const subtotal = req.session.subTotal;
  const deliveryFee = 5;
  const tax = (subtotal + deliveryFee) * 0.1025;
  const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;
  req.session.orderTotal = {
    subtotal,
    stringSubtotal: formatter.format(subtotal),
    deliveryFee,
    stringDeliveryFee: formatter.format(deliveryFee),
    tax,
    stringTax: formatter.format(tax),
    total,
    stringTotal: formatter.format(total),
  };
  res.render("addressForm", {
    gamesSelected: req.session.selected,
    orderTotal: req.session.orderTotal,
    sameBillingAndShipping: req.session.sameBillingAndShipping,
    billingInformation: req.session.billingInformation,
    shippingInformation: req.session.shippingInformation,
  });
};

export const saveAddress = (req, res) => {
  if (!req.session.selected) res.redirect("/games");
  const billingObject = {
    firstName: req.body.billingFirstName,
    lastName: req.body.billingLastName,
    streetAddress: req.body.billingStreetAddress,
    extendedAddress: req.body.billingExtendedAddress,
    locality: req.body.billingCity,
    region: req.body.billingState,
    postalCode: req.body.billingPostalCode,
    countryCodeAlpha2: "US",
  };
  let shippingObject;
  if (req.body.shippingSameAsBilling) {
    shippingObject = billingObject;
  } else {
    req.session.sameBillingAndShipping = "unchecked";
    shippingObject = {
      firstName: req.body.shippingFirstName,
      lastName: req.body.shippingLastName,
      streetAddress: req.body.shippingStreetAddress,
      extendedAddress: req.body.shippingExtendedAddress,
      locality: req.body.shippingCity,
      region: req.body.shippingState,
      postalCode: req.body.shippingPostalCode,
      countryCodeAlpha2: "US",
    };
  }
  req.session.billingInformation = billingObject;
  req.session.shippingInformation = shippingObject;
  res.redirect("/payment-details");
};

export const paymentForm = (req, res) => {
  if (!req.session.selected) req.session.selected = [];
  if (req.session.selected.length === 0) res.redirect("/games");
  // GENERATE CLIENT TOKEN
  gateway.clientToken.generate({}, (err, response) => {
    const clientToken = response.clientToken;
    res.render("payment", { clientToken });
  });
};

export const handlePayment = (req, res) => {
  if (!req.session.selected) res.redirect("/games");
  const nonce = req.body.paymentMethodNonce;
  const billingAddress = req.session.billingInformation;
  const amount = Math.round(req.session.orderTotal.total * 100) / 100;
  const orderId = generateOrderID();
  // CUSTOMER CREATE
  gateway.customer.create(
    {
      firstName: billingAddress.firstName,
      lastName: billingAddress.lastName,
      paymentMethodNonce: nonce,
      creditCard: {
        billingAddress: billingAddress,
        options: {
          verifyCard: true,
        },
      },
    },
    (err, result) => {
      if (err) {
        req.session.failureFeedback = {
          status: "Looks like something went wrong.",
          info: "",
        };
        res.redirect("/failure");
      }
      if (!result.success) {
        req.session.failureFeedback = {
          status: "Looks like something went wrong.",
          info: result.message,
        };
        res.redirect("/failure");
      }
      if (result.success) {
        const paymentMethodToken = result.customer.paymentMethods[0].token;
        // TRANSACTION SALE
        gateway.transaction.sale(
          {
            amount: amount,
            orderId: orderId,
            paymentMethodToken: paymentMethodToken,
            options: {
              submitForSettlement: true,
            },
          },
          (err, result) => {
            if (err) {
              req.session.failureFeedback = {
                status: "Looks like something went wrong.",
                info: "err",
              };
              res.redirect("/failure");
            }
            if (!result.success) {
              req.session.failureFeedback = {
                status: "Looks like something went wrong.",
                info: result.message,
              };
              res.redirect("/failure");
            } else res.redirect(`/success/${orderId}`);
          }
        );
      }
    }
  );
};

export const success = (req, res) => {
  req.session.destroy();
  res.render("success", { orderId: req.params.id });
};

export const failure = (req, res) => {
  if (!req.session.selected) res.redirect("/games");
  res.render("failure", { userFeedback: req.session.failureFeedback });
};
