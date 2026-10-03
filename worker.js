export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Try to serve the exact static asset from dist
    let response = await env.ASSETS.fetch(request);

    // 2. If it's a 404 and not a file asset with an extension,
    // fallback to index.html with HTTP 200 for SPA client-side routing
    if (response.status === 404 && !url.pathname.split('/').pop().includes('.')) {
      url.pathname = '/';
      response = await env.ASSETS.fetch(new Request(url.toString(), request));
    }

    return response;
  }
};
