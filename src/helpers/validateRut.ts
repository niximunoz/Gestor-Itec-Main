
export const rutLikePattern = (): RegExp => /^(\d{0,2})\.?(\d{3})\.?(\d{3})-?(\d|k)$/gi;
export const rutLikePatternSinPunto = (): RegExp => /^(\d{7,8})-?(\d|K)$/gi;

const suspiciousRutPattern = (): RegExp => /^(\d)\1?\.?(\1{3})\.?(\1{3})-?(\d|k)?$/gi;

export const isRutLike = (rut: string): boolean => rutLikePattern().test(rut);
export const isRutLikeSinPunto = (rut: string): boolean => rutLikePatternSinPunto().test(rut);
export const isSuspiciousRut = (rut: string): boolean => suspiciousRutPattern().test(rut);
export const cleanRut = (rut: string): string => (isRutLike(rut) ? rut.replace(/[^0-9k]/gi, '') : '');
export const getRutDigits = (rut: string): string => cleanRut(rut).slice(0, -1);
export const getRutVerifier = (rut: string): string => cleanRut(rut).slice(-1);

export const calculateRutVerificador = (digits: string): string => {
  let sum = 0;
  let mul = 2;

  let i = digits.length;
  while (i--) {
    sum = sum + parseInt(digits.charAt(i)) * mul;
    if (mul % 7 === 0) {
      mul = 2;
    } else {
      mul++;
    }
  }

  const res = sum % 11;

  if (res === 0) {
    return '0';
  } else if (res === 1) {
    return 'K';
  }

  return `${11 - res}`;
};

export const validateRut = (rut: string, noSuspicious = true): boolean => {
  if (!isRutLike(rut)) return false;
  if (noSuspicious && isSuspiciousRut(rut)) return false;
  
  return getRutVerifier(rut).toLowerCase() === calculateRutVerificador(getRutDigits(rut)).toLowerCase();
}

export const validateRutSinPunto = (rut: string): boolean => {
  if (!isRutLikeSinPunto(rut)) return false;

  return getRutVerifier(rut).toLowerCase() === calculateRutVerificador(getRutDigits(rut)).toLowerCase();
}