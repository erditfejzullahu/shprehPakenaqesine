import {z} from "zod"
export const contributionsSchema = z.object({
  attachments: z.array(z.string().regex(/^data:image\/(png|jpeg|jpg|gif|webp);base64,/, {
    message: "Bashkëngjitjet duhet të jenë imazhe në formatin base64 (PNG, JPEG, JPG, WEBP ose GIF)"
  })).optional(),
  audiosAttached: z.array(z.string().regex(/^data:audio\/(mp3|wav|ogg);base64,/, {
      message: "Audiot e bashkëngjitura duhet të jenë në formatin base64 (MP3, WAV ose OGG)"
  })).optional(),
  videosAttached: z.array(z.string().regex(/^data:video\/(mp4|webm|ogg);base64,/, {
      message: "Videot e bashkëngjitura duhet të jenë në formatin base64 (MP4, WebM ose OGG)"
  })).optional(),
})