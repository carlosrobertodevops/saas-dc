import {Locale} from './locales';

export async function getMessages(locale: Locale) {
  switch (locale) {
    case 'en-us':
      return (await import('@/messages/en-us.json')).default;
    case 'es-es':
      return (await import('@/messages/es-es.json')).default;
    case 'pt-br':
    default:
      return (await import('@/messages/pt-br.json')).default;
  }
}
