$(".gameButton").click(({ target }) => {
  const data = { name: target.id };
  const element = document.getElementById(target.id);
  const subTotal = document.getElementById("subTotal");
  element.classList.add("disabled-choice");
  $.post("/add-game", data, (res) => {
    subTotal.innerHTML = res.subTotal;
    $(".added-games").append(
      ` <button class="gameSelectedButton selected-${res.selected.replace(/ /g,'')}" id="${res.selected}">${res.selected}</button>`
    );
  });
});

$(document).on("click", ".gameSelectedButton", ({ target }) => {
  const data = { name: target.id };
  const element = document.getElementById(target.id);
  const subTotal = document.getElementById("subTotal");
  element.classList.remove("disabled-choice");
  $.post("/remove-game", data, (res) => {
    subTotal.innerHTML = res.subTotal;
    $("button").remove(`.selected-${res.selected.replace(/ /g,'')}`)
  });
});
