$(document).ready(() => {
  $("input[type='checkbox']").click(function () {
    if ($(this).prop("checked") == true) {
      $("#shippingForm").hide();
    } else if ($(this).prop("checked") === false) {
      $("#shippingForm").show();
    }
  });
});

const isBillingInfo = (name) => name.startsWith("billing");

const isShippingInfo = (name) => name.startsWith("shipping");

const isValid = () => {
  let emptyFields = [];
  const requiredInputs = document.getElementsByClassName("required");
  const skipShipping = document.getElementById("shippingSameAsBilling").checked;
  for (let i = 0; i < requiredInputs.length; i++) {
    if (requiredInputs[i].value === "") {
      if (skipShipping && isShippingInfo(requiredInputs[i].name)) continue;
      emptyFields.push(requiredInputs[i].name);
      requiredInputs[i].classList.add("is-invalid");
    }
  }
  setTimeout(() => {
    for (let i = 0; i < requiredInputs.length; i++) {
      requiredInputs[i].classList.remove("is-invalid");
    }
  }, 5000);
  return emptyFields.length === 0;
};

const addressForm = document.querySelector("#addressForm");
const confirmButton = document.querySelector("#confirmButton");

confirmButton.addEventListener("click", (event) => {
  event.preventDefault();
  if (isValid()) {
    addressForm.submit();
  }
});
