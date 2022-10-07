import cola from "./dummy_data/cola.js";

const state = {
  cola,
};

// 음료 데이터 렌더링
function setBeverages(beverages) {
  const ul = document.querySelector(".list-beverages");

  beverages.forEach((beverage) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    const img = document.createElement("img");
    const colaNameText = document.createTextNode(`${beverage.name}`);
    const span = document.createElement("span");

    li.classList.add("list-item-beverage");
    button.classList.add("btn-beverage");
    img.classList.add("img-beverage");
    span.classList.add("txt-price");

    ul.appendChild(li);
    li.appendChild(button);
    button.append(img, colaNameText, span);

    img.src = `${beverage.image}`;
    span.innerHTML = `${beverage.price}원`;

    if (!beverage.quantity) {
      const divEl = document.createElement("div");
      divEl.classList.add("bg-soldout");
      const soldOutImg = document.createElement("img");
      soldOutImg.classList.add("img-soldout");
      soldOutImg.src = "../../images/sold_out.png";
      divEl.appendChild(soldOutImg);
      li.appendChild(divEl);
    }
  });
}

function init() {
  setBeverages(state.cola);
}

init();
