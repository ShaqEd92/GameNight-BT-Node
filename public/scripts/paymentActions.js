// CREDIT CARD ANIMATION

const flipButton = document.getElementById("flipCard");

let front = true;
const flipCard = () => {
  const card = document.getElementsByClassName("credit-card-inner")[0];
  const cardNum = document.getElementById("card-number");
  const expDate = document.getElementById("expiration-date");
  const cardName = document.getElementById("cardholder-name");
  const img = document.getElementById("cardTypeImg2");
  if (front) {
    card.classList.add("flip-effect");
    cardNum.classList.add("cc-hidden");
    expDate.classList.add("cc-hidden");
    cardName.classList.add("cc-hidden");
    img.classList.add("cc-hidden");
    front = false;
  } else {
    card.classList.remove("flip-effect");
    const cardNum = document.getElementById("card-number");
    cardNum.classList.remove("cc-hidden");
    expDate.classList.remove("cc-hidden");
    cardName.classList.remove("cc-hidden");
    img.classList.remove("cc-hidden");
    front = true;
  }
};

flipButton.addEventListener("click", () => flipCard());

// Responsiveness

let screenSize = window.innerWidth;
let fontSize;

$(document).ready(() => {
  screenSize > 1000 ? (fontSize = "22px") : (fontSize = "16px");
});

// HOSTED FIELDS

const clientToken = document.getElementById("clientToken").innerText;
const form = document.getElementById("paymentForm");
const submit = document.getElementById("submitButton");

braintree.client.create(
  {
    authorization: clientToken,
  },
  (clientErr, clientInstance) => {
    if (clientErr) {
      console.error(clientErr);
      return;
    }
    braintree.hostedFields.create(
      {
        client: clientInstance,
        preventAutofill: true,
        styles: {
          input: {
            "font-size": fontSize,
          },
          "input.invalid": {
            color: "red",
          },
          "input.valid": {
            color: "green",
          },
        },
        fields: {
          cardholderName: {
            selector: "#cardholder-name",
            placeholder: "Your Name",
          },
          number: {
            selector: "#card-number",
            placeholder: "4111 1111 1111 1111",
          },
          cvv: {
            selector: "#cvv",
            placeholder: "123",
          },
          expirationDate: {
            selector: "#expiration-date",
            placeholder: "MM/YY",
          },
        },
      },
      (hostedFieldsErr, hostedFieldsInstance) => {
        if (hostedFieldsErr) {
          console.error(hostedFieldsErr);
          return;
        }

        submit.addEventListener("click", (event) => {
          submit.setAttribute("disabled", true);
          event.preventDefault();
          hostedFieldsInstance.tokenize((tokenizeErr, payload) => {
            if (tokenizeErr) {
              submit.removeAttribute("disabled");
              handleInputError(tokenizeErr.details);
              return;
            }
            document.getElementById("paymentMethodNonce").value = payload.nonce;
            form.submit();
          });
        });
      }
    );
  }
);

var handleInputError = (details) => {
  let errorMessage = "";
  const instructions = document.getElementById("paymentInstructions");
  if (details === undefined) {
    errorMessage =
      "Please be sure to enter your payment details before submitting";
    instructions.innerText = errorMessage;
    return;
  }
  if (
    details.invalidFieldKeys.length === 1 &&
    details.invalidFieldKeys.includes("cvv")
  ) {
    errorMessage += " CVV -";
    errorMessage = "Don't forget to enter your CVV";
    instructions.innerText = errorMessage;
    flipCard();
    return;
  }
  errorMessage = "Please enter a valid -";
  if (details.invalidFieldKeys.includes("number"))
    errorMessage += " card number - ";
  if (details.invalidFieldKeys.includes("expirationDate"))
    errorMessage += " expiration date -";
  if (details.invalidFieldKeys.includes("cardholderName"))
    errorMessage += " cardholder name -";
  if (details.invalidFieldKeys.includes("cvv")) errorMessage += " CVV -";
  instructions.innerText = errorMessage.substring(0, errorMessage.length - 1);
  return;
};
