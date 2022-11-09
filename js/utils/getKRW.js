function getKRW(value) {
  const validNum = new Intl.NumberFormat().format(String(value).replace(/\D/g, ""));
  return validNum == 0 ? "" : validNum;
}

export default getKRW;
