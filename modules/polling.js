function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function poll(server, delay) {
  server().then(wait(delay).then(() => poll(server, delay)));
}

exports.poll = poll;
