import { mapGetters, mapActions } from 'vuex'
import { addCss, removeAllCss, themeList } from './book'
import { saveLocation } from './localStorage'

export const ebookMixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable',
      'progress',
      'section',
      'isPaginating',
      'currentBook',
      'navigation',
      'cover',
      'metadata',
      'paginate',
      'pagelist',
      'offsetY',
      'isBookmark'
    ]),
    themeList () {
      return themeList(this)
    }
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setIsPaginating',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetY',
      'setIsBookmark'
    ]),
    initGlobleTheme () {
      removeAllCss()
      const theme = this.defaultTheme.toLowerCase()
      const href = `${process.env.VUE_APP_RES_URL}/resource/theme/theme_${theme}.css`
      addCss(href)
    },
    refreshProgress () {
      const currentLocation = this.currentBook.rendition.currentLocation()
      const startCfi = currentLocation.start.cfi
      const progress = this.currentBook.locations.percentageFromCfi(startCfi)
      this.setProgress(Math.floor(progress * 100))
      this.setSection(currentLocation.start.index)
      saveLocation(this.fileName, startCfi)
    },
    display (target, fn) {
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          this.refreshProgress()
          if (fn) fn()
        })
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshProgress()
          if (fn) fn()
        })
      }
    }
  }
}
