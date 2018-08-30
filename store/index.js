import Vuex from 'vuex'
import r2 from 'r2'
import cookieparser from 'cookieparser'

const createStore = () => {
  return new Vuex.Store({
    state: {
      gotIt: null,
      category: 'sticky',
      posts: [],
      email: null
    },

    mutations: {
      setGotIt (state, value) {
        state.gotIt = value
      },
      setCategory (state, value) {
        state.category = value
      },
      setPosts (state, value) {
        state.posts = value
      },
      setEmail (state, value) {
        state.email = value
      }
    },

    actions: {
      async nuxtServerInit ({ commit }, { req }) {
        const { CMS_DOMAIN } = process.env
        const featured = await r2(`https://${CMS_DOMAIN}/wp-json/wp/v2/posts?per_page=100`).response
        const posts = await featured.json()

        const mapPosts = posts.map(post => {
          const { id, title, slug, sticky, content, acf, better_featured_image } = post

          return {
            id,
            title: title.rendered,
            slug: slug,
            sticky,
            content: content.rendered,
            categories: post.categories,
            featuredImage: better_featured_image.media_details.sizes,
            images: acf.gallery_images
          }
        })

        commit('setPosts', mapPosts)

        let privacy = null
        if (req.headers.cookie) {
          let parsed = cookieparser.parse(req.headers.cookie)
          privacy = JSON.parse(parsed.gotIt)
        }
        commit('setGotIt', privacy)
      }
    }
  })
}

export default createStore
