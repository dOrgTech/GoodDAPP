// @flow
import { IdentityDefinitionForm } from '../../../node_modules/@dorgtech/id-dao-client'
import { SocialPostsRecord } from '../API/api'

// function d1() {
//   console.log('1')
// }
// function d2() {
//   console.log('2')
// }
// function d3() {
//   console.log('3')
// }
// function d4() {
//   console.log('4')
// }

// function d5() {
//   console.log('5')
// }
// function d6() {
//   console.log('6')
// }

function log(...args) {
  console.log(...args)
}

function dir(arg) {
  console.dir(arg)
}

export default async (socialPosts: SocialPostsRecord) => {
  log('validatesocialposts')
  dir(socialPosts)
  const socialPostsError = { twitter: '', github: '' }
  const identity = new IdentityDefinitionForm()
  const _socialPosts = identity.$.socialPosts
  _socialPosts.data = socialPosts
  _socialPosts.data = {
    github: 'https://gist.github.com/dOrgJelli/5088cddf1c58d417b9654500b49d4aa2',
    twitter: 'https://twitter.com/dOrgJelli/status/1172340539376599046',
  }
  const res = await _socialPosts.validate()
  if (res.hasError) {
    log('githuberror')
    dir(socialPosts.$.github.error)
    log('twittererror')
    dir(socialPosts.$.twitter.error)
  }

  // if (socialPosts.hasOwnProperty('github')) {
  //   d1()
  //   _socialPosts.$.github.data = socialPosts.github
  //   const res = await socialPostsError.$.github.validate()
  //   if (res.hasErrr) {
  //     d2()
  //     socialPostsError.github = _socialPosts.$.github.error
  //   }
  // }
  // if (socialPosts.hasOwnProperty(socialPosts, 'twitter')) {
  //   d3()
  //   _socialPosts.$.twitter.data = socialPosts.twitter
  //   const res = await socialPostsError.$.twitter.validate()
  //   if (res.hasErrr) {
  //     d4()
  //     socialPostsError.twitter = _socialPosts.$.twitter.error
  //   }
  // }
  log('validatesocial')
  log('errors')
  dir(socialPostsError)

  // if (Object.hasOwnProperty(socialPosts, 'github')) {
  //   _socialPosts.data = socialPosts.github
  //   const res = await socialPostsError.value.github.validate()
  //   if (res.hasErrr) {
  //     socialPostsError.github = _socialPosts.value.github.error
  //   }
  // }
  // if (Object.hasOwnProperty(socialPosts, 'twitter')) {
  //   _socialPosts.data = socialPosts.twitter
  //   const res = await socialPostsError.value.twitter.validate()
  //   if (res.hasErrr) {
  //     socialPostsError.twitter = _socialPosts.value.twitter.error
  //   }
  // }
  return socialPostsError === {} ? socialPosts : ''
}
