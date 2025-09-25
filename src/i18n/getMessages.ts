import {Locale} from '@/src/i18n/locales';

export async function getMessages(locale: Locale) {
  switch (locale) {
    case 'en-us':
      return (await import('@/src/messages/en-us.json')).default;
    case 'es-es':
      return (await import('@/src/messages/es-es.json')).default;
    case 'pt-br':
    default:
      return (await import('@/src/messages/pt-br.json')).default;
  }
}
