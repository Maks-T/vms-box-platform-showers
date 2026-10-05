import { productData as dataRu } from './data_showers_ru';
import { productData as dataEn } from './data_showers_en';
import { productData as dataDe } from './data_showers_de';
import { productData as dataEs } from './data_showers_es';
import { productData as dataIt } from './data_showers_it';
import { productData as dataPl } from './data_showers_pl';
import { productData as dataTr } from './data_showers_tr';

export const showersDataByLocale: Record<string, any> = {
  ru: dataRu,
  en: dataEn,
  de: dataDe,
  es: dataEs,
  it: dataIt,
  pl: dataPl,
  tr: dataTr,
};

/**
 * Возвращает контент промостраницы душевых для запрошенного языка с авто-фоллбэком на en/ru.
 */
export function getShowersProductData(locale: string = 'en') {
  return showersDataByLocale[locale] || showersDataByLocale.en || showersDataByLocale.ru;
}