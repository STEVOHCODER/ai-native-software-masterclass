# Chapter 09 Testing Walkthrough

The test's `Promise.all` starts three writers from the same version. The server's compare-and-swap rule makes exactly one request succeed, two return `409`, and the final version become `1`. This is a concurrency proof, not a unit test of an internal helper.

`self-correct.js` spawns the configured command, captures both stdout and stderr, mirrors output for the learner, writes only the last bounded portion to diagnostics, and exits with the test's status. The agent receives evidence without an infinite retry loop or full secret-bearing logs.

