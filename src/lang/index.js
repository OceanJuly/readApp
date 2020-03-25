import Vue from 'vue'
import I18N from 'vue-i18n'
import cn from './cn'
import en from './en'
import { getLocale, saveLocale } from '../utils/localStorage'

Vue.use(I18N)

const messages = {
  cn,
  en
}

let locale = getLocale()
if (!locale) {
  locale = 'cn'
  saveLocale(locale)
}

const i18n = new I18N({
  messages,
  locale
})

export default i18n
