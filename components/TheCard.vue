<template lang="pug">
.c(ref="div")
  .overlay
    h3(v-if="card.title" v-html="card.title")
  span(v-if="card.images")
    span(v-if="card.featuredImage")
      //- It's a video
      span(v-if="card.categories.includes(5)")
        div.fix
          img(ref="img"
            :src="'https://' + tld + '/wp-content/uploads/' + card.featuredImage.media_details.file"
            :srcset="`data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==`"
            :datasrcset="'https://' + tld + '/wp-content/uploads/' + card.featuredImage.media_details.file"
            alt="")
          TheLoading
          svg.placeholder(width="400" height="225" viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg")
            path(d="M0 0h400v225H0z" fill="#f2f2f2")
        div.fix.mb(v-if="card.additional && $store.state.category !== 5")
          img(ref="img"
            :src="card.additional.url"
            :srcset="`data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==`"
            :datasrcset="card.additional.url"
            alt="")
          TheLoading
          svg.placeholder(width="400" height="225" viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg")
            path(d="M0 0h400v225H0z" fill="#f2f2f2")
      span(v-else)
        img(
          ref="img"
          :src="card.featuredImage.media_details.sizes.w400.source_url"
          :srcset="`data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==`"
          :datasrcset="card.featuredImage.media_details.sizes.w400.source_url"
          :alt="card.featuredImage.alt_text")
        TheLoading
        svg.placeholder(
          :height="card.featuredImage.media_details.sizes.w400.height"
          :viewBox="'0 0 ' +  card.featuredImage.media_details.sizes.w400.width + ' ' + card.featuredImage.media_details.sizes.w400.height"
          :width="card.featuredImage.media_details.sizes.w400.width" xmlns="http://www.w3.org/2000/svg")
          path(
            :d="'M0 0h' + card.featuredImage.media_details.sizes.w400.width + 'v' + card.featuredImage.media_details.sizes.w400.height + 'H0z'"
            fill="#f2f2f2")
</template>

<script>
import TheLoading from '@/components/TheLoading'

export default {
  components: { TheLoading },

  props: {
    card: {
      type: Object,
      default () {
        return []
      }
    },
    id: {
      type: [Number, String],
      default: null
    }
  },

  data () {
    return {
      tld: process.env.CMS_DOMAIN,
      observer: null
    }
  },

  computed: {
    isGif () {
      this.images.forEach(img => img.setAttribute('src', img.getAttribute('datasrc')))
      const { w400 } = this.card.featuredImage.media_details.sizes
      return w400['mime-type'] === 'image/gif'
    }
  },

  mounted () {
    const images =  [...document.getElementsByTagName('img')]

    if ('IntersectionObserver' in window) {
      this.observer =  new IntersectionObserver(entries =>{
        entries.forEach(change => {
          if (change.isIntersecting) {
            const image = change.target
            if (image) {
              image.setAttribute('srcset', image.getAttribute('datasrcset'))
              this.observer.unobserve(image)
            }
          }
        })
      },{
        root: this.$refs.div[0],
        rootMargin: '0px',
        threshold: [0],
      })

      images.forEach(img => this.observer.observe(img))
    } else {
      // IntersectionObserver  Not Supported
      images.forEach(img => img.setAttribute('srcset', img.getAttribute('datasrcset')))
    }
  },

  beforeDestroy () {
    if ('IntersectionObserver' in window) {
      this.observer.disconnect()
    }
  }
}
</script>


<style lang="stylus" scoped>
.fix
  position relative
  // margin-bottom 50px
.fix:first-child
.fix:last-child
  margin-bottom 50px
.c
  position relative
  margin-bottom 50px
  &:hover .overlay
    animation fadein 0.3s
    opacity 1
  &:hover .iconPlay
    opacity 0
img
  // border 1px solid #f2f2f2
  z-index 3
img
svg
  width 100%
  height auto
  vertical-align middle
img
.overlay
  position absolute
  top 0
  left 0
.overlay
  width 100%
  height 100%
  background-color rgba(white, 0.8)
  z-index 4
  display flex
  align-items center
  justify-content center
  opacity 0
  cursor pointer

h3
  color black
  margin-top 5px
  margin-bottom 0
  font-size 18px
  letter-spacing 4.8px
  line-height 28.8px
  font-weight 400
  text-align center
  padding-left 20px
  text-transform uppercase
  padding-right 20px
@media (max-width 512px)
  .overlay
    background-color transparent
  h3
    display none
  .c
  .fix:first-child
    margin-bottom 16px
  .fix:last-child
    margin-bottom 0
@keyframes fadein
  from
    opacity 0
  to
    opacity 1
</style>
