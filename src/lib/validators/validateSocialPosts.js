// @flow
import { SocialPostsForm } from '../../../node_modules/@dorgtech/id-dao-client'
import { SocialPostsRecord } from '../API/api'

export default async (socialPosts: SocialPostsRecord) => {
  const socialPostsError = { twitter: '', github: '' }

  const _socialPosts = new SocialPostsForm()
  _socialPosts.data = {}
  if (socialPosts.github) {
    _socialPosts.data = socialPosts.github
    const res = await socialPostsError.value.github.validate()
    if (res.hasErrr) {
      socialPostsError.github = _socialPosts.value.github.error
    }
  }
  if (socialPosts.twitter) {
    _socialPosts.data = socialPosts.twitter
    const res = await socialPostsError.value.twitter.validate()
    if (res.hasErrr) {
      socialPostsError.twitter = _socialPosts.value.twitter.error
    }
  }
  return socialPostsError
}
