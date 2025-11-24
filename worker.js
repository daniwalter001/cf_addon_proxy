
const addons = {
  1: "https://addons.example.app",
}

const keys = [
  "jkzhejhfkzjhekljhkzefkze" //example key
]

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
}

export default {
  async fetch(request, env, ctx) {

    //https://addons-proxy.shodaime.workers.dev/s/jkzhejhfkzjhekljhkzefkze/1/manifest.json for exemple
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/s\/([^/]+)\/(.+?)\/(.+)$/);
    if (!match) return new Response('Not Found', { status: 404 });

    const key = match[1];
    const file = match[2];
    let reqPath = match[3];

    if (!key || !file) return new Response('Invalid manifest', { status: 400 });

    if (!reqPath) reqPath = "manifest.json"

    const targetUrlStr = addons[file]

    const reelUrl = `${targetUrlStr}/${reqPath}`

    try {
      const reelRequest = await fetch(reelUrl)

      if (reelRequest.status >= 400) return new Response('Oops! ' + reelRequest.statusText, { status: 400 })

      const jsonResponse = await reelRequest.json()
      return new Response(JSON.stringify(jsonResponse), {
        status: 200,
        headers
      })
    } catch (error) {
      return new Response(`Oops! ${error?.message}`, { status: 400 })
    }
  }
};
