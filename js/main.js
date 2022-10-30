import beverage from "./dummy_data/beverage.js";

const state = {
  beverage: beverage,
  listSelected: [],
  userBeverage: [],
  cashLeft: 0,
  userMoney: 0,
  userTotal: 0,
};

const btnChange = document.querySelector(".btn-change");
const btnCash = document.querySelector(".btn-cash");
const btnComplete = document.querySelector(".btn-complete");
const cashLeftTxt = document.querySelector(".txt-cash > span");
const userMoneyTxt = document.querySelector(".txt-mycash > span");
const userTotalTxt = document.querySelector(".txt-total");
const ulSelected = document.querySelector(".cont-selected .list-selected");

// 음료 데이터 렌더링
function createBeverageItems(beverages) {
  const ul = document.querySelector(".list-beverages");
  ul.innerHTML = "";

  beverages.forEach((beverage) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    const img = document.createElement("img");
    const span = document.createElement("span");

    li.classList.add("list-item-beverage");
    button.classList.add("btn-beverage");
    img.classList.add("img-beverage");
    span.classList.add("txt-price");

    img.src = `${beverage.image}`;
    span.textContent = `${beverage.price}원`;

    ul.appendChild(li);
    li.appendChild(button);
    button.append(img, beverage.name, span);

    if (!beverage.quantity) {
      const soldout = document.createElement("div");
      const soldOutImg = document.createElement("img");

      li.classList.add("soldout");
      soldout.classList.add("bg-soldout");
      soldOutImg.classList.add("img-soldout");
      soldOutImg.src = "../../images/sold_out.png";
      button.setAttribute("disabled", "");

      soldout.appendChild(soldOutImg);
      li.appendChild(soldout);
    }

    button.addEventListener("click", () => {
      if (beverage.quantity) decreaseQuantity(beverage.id);
    });
  });
}

// 음료 개수 감소
function decreaseQuantity(id) {
  const selectedItem = state.beverage.find((v) => v.id === id);
  selectedItem.quantity -= 1;

  createBeverageItems(state.beverage);
  addSelectedItems(selectedItem);
}

// 선택한 음료 추가
function addSelectedItems(item) {
  const itemFound = state.listSelected.find((el) => el.id === item.id);

  if (itemFound) {
    itemFound.quantity += 1;
  } else {
    state.listSelected.push({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    });
  }

  showSelectedItems();
}

// 선택한 음료 보여주기
function showSelectedItems() {
  ulSelected.innerHTML = "";

  state.listSelected.forEach((item) => {
    const li = document.createElement("li");
    const img = document.createElement("img");
    const span = document.createElement("span");

    li.classList.add("list-item-selected");
    img.src = `${item.image}`;
    span.classList.add("item-count");
    span.textContent = item.quantity;

    li.append(img, item.name, span);
    ulSelected.appendChild(li);
  });
}

function userMoneyInfo() {
  let userMoney = parseInt(localStorage.getItem("userMoney")) || 0;

  if (!userMoney) {
    userMoney += parseInt(prompt("소지금이 없어요. 소지금을 입력해주세요.", 1000));
    localStorage.setItem("userMoney", userMoney);
  }

  state.userMoney = userMoney;
  userMoneyTxt.textContent = `${state.userMoney} 원`;
}

function acceptCash() {
  const inpVal = parseInt(document.querySelector(".input-cash").value) || 0;

  if (!inpVal || state.userMoney < inpVal) return;

  state.cashLeft += inpVal;
  state.userMoney -= inpVal;
  localStorage.setItem("userMoney", state.userMoney);
  cashLeftTxt.textContent = `${state.cashLeft} 원`;
  userMoneyTxt.textContent = `${state.userMoney} 원`;
}

function returnChange() {
  if (!state.cashLeft) return;

  state.userMoney += state.cashLeft;
  state.cashLeft = 0;
  localStorage.setItem("userMoney", state.userMoney);
  cashLeftTxt.textContent = `${state.cashLeft} 원`;
  userMoneyTxt.textContent = `${state.userMoney} 원`;
}

function getUserBeverage() {
  if (!state.cashLeft || !state.listSelected.length) return;

  const totalSelected = getTotal();

  if (totalSelected <= state.cashLeft) {
    state.listSelected.forEach((item) => {
      const itemAlready = state.userBeverage.find((v) => v.id === item.id);

      if (itemAlready) {
        itemAlready.quantity += item.quantity;
      } else {
        state.userBeverage.push({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        });
      }
    });
    state.cashLeft -= totalSelected;
    state.userTotal += totalSelected;
    cashLeftTxt.textContent = `${state.cashLeft} 원`;
    userTotalTxt.textContent = `총금액: ${state.userTotal}원`;
    state.listSelected = [];
    ulSelected.innerHTML = "";

    showUserBeverage();
  }
}

function showUserBeverage() {
  const ul = document.querySelector(".cont-mybeverage .list-selected");
  ul.innerHTML = "";

  state.userBeverage.forEach((item) => {
    const li = document.createElement("li");
    const img = document.createElement("img");
    const span = document.createElement("span");

    li.classList.add("list-item-selected");
    img.src = `${item.image}`;
    span.classList.add("item-count");
    span.textContent = item.quantity;

    li.append(img, item.name, span);
    ul.appendChild(li);
  });
}

function getTotal() {
  if (state.listSelected) {
    return state.listSelected.reduce((total, item) => total + item.price, 0);
  }
  return 0;
}

function init() {
  createBeverageItems(state.beverage);
  btnChange.addEventListener("click", returnChange);
  btnCash.addEventListener("click", acceptCash);
  btnComplete.addEventListener("click", getUserBeverage);
  userMoneyInfo();
}

init();
