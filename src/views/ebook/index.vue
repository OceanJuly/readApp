<template>
    <div>
      <ebook-reader></ebook-reader>
      <ebook-title></ebook-title>
      <ebook-menu></ebook-menu>
    </div>
</template>

<script>
import EbookReader from '../../components/ebook/EbookReader'
import EbookTitle from '../../components/ebook/EbookTItle'
import EbookMenu from '../../components/ebook/EbookMenu'
import { getReadTime, saveReadTime } from '../../utils/localStorage'
import { ebookMixin } from '../../utils/mixin'

export default {
  name: 'index',
  mixins: [ebookMixin],
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu
  },
  methods: {
    startLoopReadTime () {
      let readTime = getReadTime(this.fileName)
      if (!readTime) {
        readTime = 0
      }
      this.task = setInterval(() => {
        readTime++
        if (readTime % 30 === 0) {
          saveReadTime(this.fileName, readTime)
        }
      }, 1000)
    }
  },
  mounted () {
    this.startLoopReadTime()
  },
  beforeDestroy () {
    if (this.task) {
      clearInterval(this.task)
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/styles/global";
</style>
