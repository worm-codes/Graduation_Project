export function decideToPutZero(num) {
    if(num < 10){
        return '0'+num?.toString();
      } else {
        return num?.toString();
      }
}