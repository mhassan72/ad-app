import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'amplifyVideos',
  access: (allow) => ({
    'media/*': [
      allow.authenticated.to(['read','write']),
      allow.guest.to(['read', 'write'])
    ],
  })
});