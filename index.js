const got = (() => {
  const options = {
    method: 'GET',
    form: true,
    json: true,
    ajax: true,
  };

  const headers = {
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
  };

  function qs(data) {
    return Object.keys(data)
      .map(k => `${k}=${decodeURIComponent(data[k])}`)
      .join('&');
  }

  function got(url, opts = {}) {
    if (typeof url === 'string') {
      opts.url = url;
    }

    opts = Object.assign({}, options, opts);

    const details = {
      url: opts.url,
      method: opts.method,
      headers: Object.assign({}, headers, opts.headers),
    };

    if (opts.json) {
      details.responseType = 'json';
    }

    if (opts.query) {
      details.url += `?${qs(opts.query)}`;
    }

    if (opts.body) {
      details.data = opts.form ? qs(opts.body) : JSON.stringify(opts.body);
    }

    if (!opts.form) {
      details.headers['Content-Type'] = 'application/json; charset=UTF-8';
    }

    if (opts.timeout) {
      details.timeout = opts.timeout;
    }

    if (opts.ajax) {
      details.headers['X-Requested-With'] = 'XMLHttpRequest';
    }

    return new Promise((resolve, reject) => {
      details.onload = res => {
        res.body = res.response;
        resolve(res);
      };
      details.onabort = reject;
      details.onerror = reject;
      details.ontimeout = reject;
      GM_xmlhttpRequest(details);
    });
  }

  ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].forEach(method => {
    got[method.toLowerCase()] = (url, opts) =>
      got(url, Object.assign(opts, { method }));
  });

  return got;
})();
