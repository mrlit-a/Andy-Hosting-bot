const { Youtube } = require('@neoxr/youtube-scraper')
const yt = new Youtube({
   fileAsUrl: false
})
exports.run = {
   usage: ['video'],
   hidden: ['playvid', 'playvideo'],
   use: 'query',
   category: 'feature',
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      env,
      users,
      Scraper,
      Func
   }) => {
      try {
         if (!text) return client.reply(m.chat, Func.example(isPrefix, command, 'lathi'), m)
         client.sendReact(m.chat, '🕒', m.key)
         var json = await yt.play(text, 'video', '720p')
         if (!json.status) {
            var json = await yt.play(text, 'video', '480p')
         }
         if (!json.status) return client.reply(m.chat, global.status.fail, m)
         if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
         let caption = `乂  *Y T - V I D E O*\n\n`
         caption += `	◦  *Title* : ${json.title}\n`
         caption += `	◦  *Size* : ${json.data.size}\n`
         caption += `	◦  *Duration* : ${json.duration}\n`
         caption += `	◦  *Bitrate* : ${json.data.quality}\n\n`
         caption += global.footer   
         const chSize = Func.sizeLimit(json.data.size, users.premium ? env.max_upload : env.max_upload_free)
         const isOver = users.premium ? `💀 File size (${json.data.size}) exceeds the maximum limit.` : `⚠️ File size (${json.data.size}), you can only download files with a maximum size of ${env.max_upload_free} MB and for premium users a maximum of ${env.max_upload} MB.`
         if (chSize.oversize) return client.reply(m.chat, isOver, m)
         let isSize = (json.data.size).replace(/MB/g, '').trim()
         if (isSize > 99) return client.sendFile(m.chat, json.data.url, json.data.filename, caption, m, {
            document: true
         }, {
            jpegThumbnail: await Func.createThumb(json.thumbnail)
         })
         client.sendFile(m.chat, json.data.url, json.data.filename, caption, m)
      } catch (e) {
         client.reply(m.chat, FuncjsonFormat(e), m)
      }
   },
   error: false,
   restrict: true,
   cache: true,
   location: __filename
}