import assert from "node:assert/strict";
import test from "node:test";
import { publicIPv4, remotePdf } from "../src/server/repositories/remote-pdf";

test("PDF downloads reject private, reserved and non-IPv4 addresses", () => {
  for (const ip of ["0.0.0.0", "10.1.2.3", "127.0.0.1", "169.254.169.254", "172.16.0.1", "192.168.1.1", "100.64.0.1", "198.18.0.1", "224.0.0.1", "::1"]) assert.equal(publicIPv4(ip), false, ip);
  assert.equal(publicIPv4("8.8.8.8"), true);
});

test("remote PDF source rejects unsafe protocols, credentials, ports and IP literals before fetching", async () => {
  for (const url of ["http://example.com/a.pdf", "https://127.0.0.1/a.pdf", "https://[::1]/a.pdf", "https://user:pass@example.com/a.pdf", "https://example.com:8080/a.pdf"]) await assert.rejects(remotePdf(url));
});
