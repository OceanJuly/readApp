<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div class="ebook-reader-mask"
         @click="onMaskClick"
         @touchmove="move"
         @touchend="moveEnd"
         @mousedown.left="onMouseEnter"
         @mousemove.left="onMouseMove"
         @mouseup.left="onMouseEnd"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Epub from 'epubjs'
import { ebookMixin } from '../../utils/mixin'
import { getFontFamily, getFontSize, getTheme, saveFontFamily, saveFontSize, saveTheme, getLocation } from '../../utils/localStorage'
import { getLocalForage } from '../../utils/localForage'

export default {
  name: 'EbookReader',
  mixins: [ebookMixin],
  methods: {
    /*
    1 - 鼠标进入
    2 - 鼠标点击后移动
    3 - 鼠标点击后松手
    4 - 鼠标还原
     */
    onMouseEnter (e) {
      this.mouseState = 1
      this.mouseStartTime = e.timestamp
      e.preventDefault()
      e.stopPropagation()
    },
    onMouseMove (e) {
      if (this.mouseState === 1) {
        this.mouseState = 2
      } else if (this.mouseState === 2) {
        let offsetY = 0
        if (this.firstOffsetY) {
          offsetY = e.clientY - this.firstOffsetY
          this.setOffsetY(offsetY)
        } else {
          this.firstOffsetY = e.clientY
        }
      }
      e.preventDefault()
      e.stopPropagation()
    },
    onMouseEnd (e) {
      if (this.mouseState === 2) {
        this.setOffsetY(0)
        this.firstOffsetY = null
        this.mouseState = 3
      } else {
        this.mouseState = 4
      }
      const time = e.timestamp - this.mouseStartTime
      if (time < 100) {
        this.mouseState = 4
      }
      e.preventDefault()
      e.stopPropagation()
    },
    initEpub (url) {
      this.book = new Epub(url)
      this.setCurrentBook(this.book)
      this.initRendition()
      // this.initGestrue()
      this.parseBook()
    },
    // epubjs 初始渲染
    initRendition () {
      this.rendition = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight,
        mothod: 'default'
        // flow: 'scrolled'
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
    // 取代epubjs事件，采用模板事件
    onMaskClick (e) {
      if (this.mouseState && (this.mouseState === 2 || this.mouseState === 3)) {
        return
      }
      const offsettX = e.offsetX
      const width = window.innerWidth
      if (offsettX > 0 && offsettX < width * 0.3) {
        this.prevPage()
      } else if (offsettX > 0 && offsettX > width * 0.7) {
        this.nextPage()
      } else {
        this.showTitleAndMenu()
      }
    },
    move (e) {
      let offsetY = 0
      if (this.firstOffsetY) {
        offsetY = e.changedTouches[0].clientY - this.firstOffsetY
        this.setOffsetY(offsetY)
      } else {
        this.firstOffsetY = e.changedTouches[0].clientY
      }
      e.preventDefault()
      e.stopPropagation()
    },
    moveEnd (e) {
      this.setOffsetY(0)
      this.firstOffsetY = null
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
        // console.log(this.themeList[0].name)
        // const theme = this.themeList[0].name
        saveTheme(this.fileName, this.themeList[0].name)
      }
      this.setDefaultTheme(this.themeList[0].name)
      this.themeList.forEach(theme => {
        this.rendition.themes.register(theme.name, theme.style)
      })
      this.rendition.themes.select(theme)
    },
    parseBook () {
      this.book.loaded.cover.then(cover => {
        this.book.archive.createUrl(cover).then(url => {
          this.setCover(url)
        })
      })
      this.book.loaded.metadata.then(metadata => {
        this.setMetadata(metadata)
      })
      this.book.loaded.navigation.then(nav => {
        const navItem = (function flatten (arr) {
          return [].concat(...arr.map(v => [v, ...flatten(v.subitems)]))
        })(nav.toc)

        function find (item, v = 0) {
          const parent = navItem.filter(it => it.id === item.parent)[0]
          return !item.parent ? v : (parent ? find(parent, ++v) : v)
        }

        navItem.forEach(item => {
          item.level = find(item)
          item.total = 0
          item.pagelist = []
          if (item.href.match(/^(.*)\.html$/)) {
            item.idhref = item.href.match(/^(.*)\.html$/)[1]
          } else if (item.href.match(/^(.*)\.xhtml$/)) {
            item.idhref = item.href.match(/^(.*)\.xhtml$/)[1]
          }
        })
        this.setNavigation(navItem)
      })
      this.book.ready.then(() => {
        this.setCurrentBook(this.book)
        return this.book.locations.generate(750 * (window.innerWidth) / 375 * (getFontSize(this.fileName) / 16))
      }).then(locations => {
        locations.forEach(location => {
          const loc = location.match(/\[(.*)\]!/)[1]
          // console.log(loc)
          this.navigation.forEach(item => {
            if (item.idhref && item.idhref.indexOf(loc) >= 0) {
              item.pagelist.push(location)
            }
          })
          let currentPage = 1
          this.navigation.forEach((item, index) => {
            if (index === 0) {
              item.page = 1
            } else {
              item.page = currentPage
            }
            currentPage += item.pagelist.length + 1
          })
        })
        // saveNavigation(this.fileName, this.navigation)
        this.setPagelist(locations)
        this.setBookAvailable(true)
        this.setIsPaginating(false)
        this.refreshProgress()
      })
    }
  },
  mounted () {
    const books = this.$route.params.fileName.split('|')
    const fileName = books[1]
    getLocalForage(fileName, (err, blob) => {
      if (!err && blob) {
        this.setFileName(books.join('/')).then(() => {
          this.initEpub(blob)
        })
      } else {
        this.setFileName(books.join('/')).then(() => {
          const url = `${process.env.VUE_APP_RES_URL}/resource/epub/${this.fileName}.epub`
          this.initEpub(url)
        })
      }
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
