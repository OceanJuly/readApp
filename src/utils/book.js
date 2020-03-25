export const FONT_SIZE_LIST = [
  { fontSize: 12 },
  { fontSize: 14 },
  { fontSize: 16 },
  { fontSize: 18 },
  { fontSize: 20 },
  { fontSize: 22 },
  { fontSize: 24 }
]

export const FONT_FAMILY = [
  { font: 'Default' },
  { font: 'Cabin' },
  { font: 'Days One' },
  { font: 'Montserrat' },
  { font: 'Tangerine' }
]

export function themeList (vue) {
  return [
    {
      alias: vue.$t('book.themeDefault'),
      name: 'Default',
      style: {
        body: {
          color: '#4c5059',
          background: '#cecece'
        }
      }
    },
    {
      alias: vue.$t('book.themeGold'),
      name: 'Gold',
      style: {
        body: {
          color: '#5c5b56',
          background: '#c6c2b6'
        }
      }
    },
    {
      alias: vue.$t('book.themeEye'),
      name: 'Eye',
      style: {
        body: {
          color: '#404c42',
          background: '#a9c1a9'
        }
      }
    },
    {
      alias: vue.$t('book.themeNight'),
      name: 'Night',
      style: {
        body: {
          color: '#cecece',
          background: '#000000'
        }
      }
    }
  ]
}

export function addCss (href) {
  const item = document.createElement('link')
  item.setAttribute('type', 'text/css')
  item.setAttribute('rel', 'stylesheet')
  item.setAttribute('href', href)
  document.getElementsByTagName('link')[0].appendChild(item)
}

export function removeCss (href) {
  const links = document.getElementsByTagName('link')
  links.forEach(ele => {
    if (ele && ele.getAttribute('href') && ele.getAttribute('href') === href) {
      ele.parentNode.removeChild(ele)
    }
  })
}

export function removeAllCss () {
  removeCss(`${process.env.VUE_APP_RES_URP}/resource/theme/theme_default`)
  removeCss(`${process.env.VUE_APP_RES_URP}/resource/theme/theme_gold`)
  removeCss(`${process.env.VUE_APP_RES_URP}/resource/theme/theme_eye`)
  removeCss(`${process.env.VUE_APP_RES_URP}/resource/theme/theme_night`)
}
