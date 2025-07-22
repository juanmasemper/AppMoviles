import palabrasData from '../../assets/palabras.json';

export const PALABRAS_VALIDAS: string[] = palabrasData;

export const obtenerPalabraDelDia = (): string => {
  const hoy = new Date();
  const seed = hoy.getFullYear() * 10000 + (hoy.getMonth() + 1) * 100 + hoy.getDate();
  const indice = seed % PALABRAS_VALIDAS.length;
  
  return PALABRAS_VALIDAS[indice].toUpperCase();
};

export const PALABRA_DEL_DIA = obtenerPalabraDelDia();