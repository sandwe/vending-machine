function getKRW(value) {
  const validNum = new Intl.NumberFormat().format(value.replace(/\D/g, ""));
  return validNum == 0 ? "" : validNum;
}

export default getKRW;
