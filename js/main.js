import beverage from "./dummy_data/beverage.js";
import getKRW from "./utils/getKRW.js";

const state = {
  beverage: beverage,
  listSelected: [],
  userBeverage: [],
  moneyLeft: 0,
  userMoney: 0,
  userTotal: 0,
};

const btnChange = document.querySelector(".btn-change");
const btnMoney = document.querySelector(".btn-money");
const btnComplete = document.querySelector(".btn-complete");
const moneyLeftTxt = document.querySelector(".txt-money > span");
const inpUserMoney = document.querySelector(".txt-mymoney > input");
const inpDeposit = document.querySelector(".input-money");
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
      soldOutImg.src = "images/sold_out.png";
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

function checkInput(event) {
  const inpValid = getKRW(event.target.value);
  event.target.value = inpValid;
}

function saveUserMoney() {
  if (inpUserMoney.value) {
    state.userMoney += parseInt(inpUserMoney.value.replaceAll(",", ""));
  }
}

function acceptMoney() {
  const inpVal = inpDeposit.value.replaceAll(",", "");
  if (inpVal === "" || state.userMoney < parseInt(inpVal)) return;
  state.moneyLeft += parseInt(inpVal);
  state.userMoney -= parseInt(inpVal);
  moneyLeftTxt.textContent = new Intl.NumberFormat().format(state.moneyLeft) + "원";
  inpUserMoney.value = getKRW(state.userMoney);
}

function returnChange() {
  if (!state.moneyLeft) return;

  state.userMoney += state.moneyLeft;
  state.moneyLeft = 0;
  moneyLeftTxt.textContent = new Intl.NumberFormat().format(state.moneyLeft) + "원";
  inpUserMoney.value = getKRW(state.userMoney);
}

function getUserBeverage() {
  if (!state.moneyLeft || !state.listSelected.length) return;

  const totalSelected = getTotal();

  if (totalSelected <= state.moneyLeft) {
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
    state.moneyLeft -= totalSelected;
    state.userTotal += totalSelected;
    moneyLeftTxt.textContent = new Intl.NumberFormat().format(state.moneyLeft) + "원";
    userTotalTxt.textContent = "총금액: " + new Intl.NumberFormat().format(state.userTotal) + "원";
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
    return state.listSelected.reduce((total, item) => total + item.price * item.quantity, 0);
  }
  return 0;
}

function init() {
  createBeverageItems(state.beverage);
  btnChange.addEventListener("click", returnChange);
  btnMoney.addEventListener("click", acceptMoney);
  btnComplete.addEventListener("click", getUserBeverage);
  inpUserMoney.addEventListener("change", saveUserMoney);
  inpUserMoney.addEventListener("input", checkInput);
  inpDeposit.addEventListener("input", checkInput);
}

init();
