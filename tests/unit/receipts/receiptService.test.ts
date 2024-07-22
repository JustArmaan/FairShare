import { expect, test } from "bun:test";

test("python microservice is running and replies to /echo GET", async () => {
  const response = await fetch("https://localhost:5000/echo");
  const reply = await response.json();
  expect(response.status).toBe(200);
  expect(reply.echo).toBe("echo");
});
