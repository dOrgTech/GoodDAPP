// @flow
import { IdentityDefinitionForm } from '../../../node_modules/@dorgtech/id-dao-client'
import { SocialPostsRecord } from '../API/api'

export default async (socialPosts: SocialPostsRecord) => {
  const identity = new IdentityDefinitionForm()

  identity.$.address.data = '0xfD0174784EbCe943bdb8832Ecdea9Fea30e7C7A9'
  identity.$.socialPosts.data = socialPosts
  const valRes = await identity.$.socialPosts.validate()
  const socialPostErrors = {}
  if (valRes.hasError) {
    Object.keys(socialPosts).forEach(key => {
      socialPostErrors[key] = identity.$.socialPosts.$[key].error
    })
    return socialPostErrors
  }
  return ''
}
