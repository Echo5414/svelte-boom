export default {
  routes: [
    {
      method: 'POST',
      path: '/grenades/:id/like',
      handler: 'custom-grenade.likeGrenade',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          required: true
        }
      }
    },
    {
      method: 'POST',
      path: '/grenades/:id/unlike',
      handler: 'custom-grenade.unlikeGrenade',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          required: true
        }
      }
    }
  ]
}; 