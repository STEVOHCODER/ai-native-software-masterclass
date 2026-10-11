'use strict';

const test = require('node:test'); // Use Node's built-in test runner.
const assert = require('node:assert/strict'); // Use strict equality assertions.
const { app, records } = require('../chapter-08-backend-pipelines-concurrency/server'); // Test the real API module.
const http = require('node:http'); // Issue requests without an external test client.

function request(method, path, body) { // Wrap one HTTP request in a promise.
  return new Promise((resolve, reject) => {
    const server = app.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const req = http.request({ hostname: '127.0.0.1', port: address.port, path, method, headers: { 'content-type': 'application/json', origin: 'http://localhost:5173' } }, (res) => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => { server.close(); resolve({ status: res.statusCode, body: JSON.parse(data) }); });
      });
      req.on('error', (error) => { server.close(); reject(error); });
      req.end(JSON.stringify(body));
    });
  });
}

test('three concurrent users produce one winner and two version conflicts', async () => { // Prove compare-and-swap behavior.
  records.set('course-progress', { id: 'course-progress', title: 'Local Sandbox Wiring', progress: 0, __v: 0 });
  const writes = await Promise.all([25, 50, 75].map((progress) => request('PATCH', '/api/progress/course-progress', { progress, __v: 0 })));
  assert.equal(writes.filter((result) => result.status === 200).length, 1);
  assert.equal(writes.filter((result) => result.status === 409).length, 2);
  assert.equal(records.get('course-progress').__v, 1);
});
