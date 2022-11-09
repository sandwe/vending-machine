function checkNumFormat(number) {
  if (/\D/g.test(number)) {
    return false;
  } else {
    return true;
  }
}

export default checkNumFormat;
