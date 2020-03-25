<template>
    <div id="read"></div>
</template>

<script>
import { mapGetters } from 'vuex'
import Epub from 'epubjs'
import { ebookMixin } from '../../utils/mixin'
import { getFontFamily, getFontSize, getTheme, saveFontFamily, saveFontSize, saveTheme, getLocation } from '../../utils/localStorage'

export default {
  name: 'EbookReader',
  mixins: [ebookMixin],
  methods: {
    initEpub () {
      const url = `${process.env.VUE_APP_RES_URL}/resource/epub/${this.fileName}.epub`
      this.book = new Epub(url)
      this.setCurrentBook(this.book)
      this.initRendition()
      this.initGestrue()
      this.book.ready.then(() => {
        return this.book.locations.generate(750 * (window.innerWidth) / 375 * (getFontSize(this.fileName) / 16))
      }).then(() => {
        this.setBookAvailable(true)
        this.refreshProgress()
      })
    },
    // epubjs 初始渲染
    initRendition () {
      this.rendition = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight,
        mothod: 'default'
      })
      const location = getLocation(this.fileName)
      this.display(location, () => {
        this.initFontFamily()
        this.initFontSize()
        this.initTheme()
        this.initGlobleTheme()
      })
      this.rendition.hooks.content.register(contents => {
        Promise.all([
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/resource/fonts/daysOne.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/resource/fonts/cabin.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/resource/fonts/montserrat.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/resource/fonts/tangerine.css`)
        ])
      })
    },
    // epubjs 事件处理
    initGestrue () {
      this.rendition.on('touchstart', event => {
        this.touchStartX = event.changedTouches[0].clientX
        this.touchStartTime = event.timeStamp
      })
      this.rendition.on('touchend', event => {
        const offSetX = event.changedTouches[0].clientX - this.touchStartX
        const time = event.timeStamp - this.touchStartTime
        // console.log(offSetX, time)
        if (time < 500 && offSetX > 40) {
          this.prevPage()
        } else if (time < 500 && offSetX < -40) {
          this.nextPage()
        } else {
          this.showTitleAndMenu()
        }
      })
    },
    prevPage () {
      if (this.rendition) {
        this.rendition.prev().then(() => {
          this.refreshProgress()
        })
        this.hideTitleAndMenu()
      }
    },
    nextPage () {
      if (this.rendition) {
        this.rendition.next().then(() => {
          this.refreshProgress()
        })
        this.hideTitleAndMenu()
      }
    },
    showTitleAndMenu () {
      if (this.menuVisible) {
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      }
      this.setMenuVisible(!this.menuVisible)
    },
    hideTitleAndMenu () {
      this.setMenuVisible(false)
      this.setSettingVisible(-1)
      this.setFontFamilyVisible(false)
    },
    initFontFamily () {
      const font = getFontFamily(this.fileName)
      if (!font) {
        saveFontFamily(this.fileName, this.defaultFontFamily)
      } else {
        this.rendition.themes.font(font)
        this.setDefaultFontFamily(font)
      }
    },
    initFontSize () {
      const fontSize = getFontSize(this.fileName)
      if (!fontSize) {
        saveFontSize(this.fileName, this.defaultFontSize)
      } else {
        this.rendition.themes.fontSize(fontSize + 'px')
        this.setDefaultFontSize(fontSize)
      }
    },
    initTheme () {
      const theme = getTheme(this.fileName)
      if (!theme) {
        const theme = this.themeList[0].name
        saveTheme(this.fileName, theme)
      }
      this.setDefaultTheme(theme)
      this.themeList.forEach(theme => {
        this.rendition.themes.register(theme.name, theme.style)
      })
      this.rendition.themes.select(theme)
    }
  },
  mounted () {
    const fileName = this.$route.params.fileName.split('|').join('/')
    this.$store.dispatch('setFileName', fileName).then(() => {
      this.initEpub()
    })
  },
  computed: {
    ...mapGetters([
      'fileName'
    ])
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .ebook-reader {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .ebook-reader-mask {
      position: absolute;
      top: 0;
      left: 0;
      background: transparent;
      z-index: 150;
      width: 100%;
      height: 100%;
    }
  }
</style>
