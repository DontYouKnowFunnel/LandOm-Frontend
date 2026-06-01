import type { SessionDto } from "../api/generated";
import type { EventDetail } from "../api/generated";

export const MOCK_SESSIONS: SessionDto[] = [
  {
    sessionId: "sess_a1b2c3d4e5f6",
    timestamp: "2025-05-26T14:23:11.000Z",
    device:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    lastSection: "pricing",
    duration: "03:42",
    status: "CONVERTED",
  },
  {
    sessionId: "sess_b7c8d9e0f1a2",
    timestamp: "2025-05-26T13:55:44.000Z",
    device:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
    lastSection: "hero",
    duration: "00:31",
    status: "DROP",
  },
  {
    sessionId: "sess_c3d4e5f6a7b8",
    timestamp: "2025-05-26T12:10:09.000Z",
    device:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
    lastSection: "features",
    duration: "05:18",
    status: null as unknown as string,
  },
  {
    sessionId: "sess_d9e0f1a2b3c4",
    timestamp: "2025-05-26T11:47:30.000Z",
    device:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
    lastSection: "cta",
    duration: "02:05",
    status: "CONVERTED",
  },
  {
    sessionId: "sess_e5f6a7b8c9d0",
    timestamp: "2025-05-26T10:33:55.000Z",
    device:
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
    lastSection: "testimonials",
    duration: "01:22",
    status: "DROP",
  },
  {
    sessionId: "sess_f1a2b3c4d5e6",
    timestamp: "2025-05-26T09:15:02.000Z",
    device:
      "Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
    lastSection: "faq",
    duration: "04:50",
    status: null as unknown as string,
  },
  {
    sessionId: "sess_a7b8c9d0e1f2",
    timestamp: "2025-05-25T22:08:41.000Z",
    device:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    lastSection: "pricing",
    duration: "06:11",
    status: "CONVERTED",
  },
  {
    sessionId: "sess_b3c4d5e6f7a8",
    timestamp: "2025-05-25T20:44:17.000Z",
    device:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
    lastSection: "hero",
    duration: "00:52",
    status: "DROP",
  },
  {
    sessionId: "sess_c9d0e1f2a3b4",
    timestamp: "2025-05-25T18:30:00.000Z",
    device:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15",
    lastSection: "features",
    duration: "03:27",
    status: null as unknown as string,
  },
  {
    sessionId: "sess_d5e6f7a8b9c0",
    timestamp: "2025-05-25T15:12:38.000Z",
    device:
      "Mozilla/5.0 (Linux; Android 13; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
    lastSection: "testimonials",
    duration: "01:04",
    status: "DROP",
  },
];

const BASE = Date.now() - 10_000;

export const MOCK_REPLAY_EVENTS: Record<string, EventDetail[]> = {
  "sess_a1b2c3d4e5f6": [
    { type: "start", timestamp: BASE },
    { type: "scroll", timestamp: BASE + 3200, payload: { yOffset: 320, percentage: 0.18 } },
    { type: "ping", timestamp: BASE + 5100, payload: { sectionId: "hero" } },
    { type: "scroll", timestamp: BASE + 9800, payload: { yOffset: 880, percentage: 0.49 } },
    { type: "click", timestamp: BASE + 12400, cssSelector: "#cta-button", payload: { targetId: "cta-button" } },
    { type: "scroll", timestamp: BASE + 18000, payload: { yOffset: 1540, percentage: 0.74 } },
    { type: "ping", timestamp: BASE + 20300, payload: { sectionId: "pricing" } },
    { type: "click", timestamp: BASE + 24100, cssSelector: "#plan-pro", payload: { targetId: "plan-pro" } },
    { type: "input", timestamp: BASE + 30500, cssSelector: "#email-field", payload: { fieldId: "email-field" } },
    { type: "scroll", timestamp: BASE + 38000, payload: { yOffset: 1980, percentage: 0.91 } },
    { type: "exit", timestamp: BASE + 222000, payload: { lastElementId: "plan-pro", maxDepth: 91 } },
  ],
  "sess_b7c8d9e0f1a2": [
    { type: "start", timestamp: BASE },
    { type: "scroll", timestamp: BASE + 1500, payload: { yOffset: 150, percentage: 0.08 } },
    { type: "ping", timestamp: BASE + 2200, payload: { sectionId: "hero" } },
    { type: "visibility", timestamp: BASE + 5000, payload: { isVisible: false } },
    { type: "visibility", timestamp: BASE + 8000, payload: { isVisible: true } },
    { type: "exit", timestamp: BASE + 31000, payload: { lastElementId: "hero-title", maxDepth: 8 } },
  ],
  "sess_c3d4e5f6a7b8": [
    { type: "start", timestamp: BASE },
    { type: "scroll", timestamp: BASE + 2100, payload: { yOffset: 400, percentage: 0.22 } },
    { type: "ping", timestamp: BASE + 4000, payload: { sectionId: "hero" } },
    { type: "scroll", timestamp: BASE + 8500, payload: { yOffset: 960, percentage: 0.53 } },
    { type: "ping", timestamp: BASE + 10200, payload: { sectionId: "features" } },
    { type: "click", timestamp: BASE + 14700, cssSelector: "#feature-card-1", payload: { targetId: "feature-card-1" } },
    { type: "click", timestamp: BASE + 17300, cssSelector: "#feature-card-3", payload: { targetId: "feature-card-3" } },
    { type: "scroll", timestamp: BASE + 22000, payload: { yOffset: 1700, percentage: 0.82 } },
    { type: "ping", timestamp: BASE + 24500, payload: { sectionId: "testimonials" } },
    { type: "scroll", timestamp: BASE + 30000, payload: { yOffset: 2050, percentage: 0.96 } },
    { type: "visibility", timestamp: BASE + 180000, payload: { isVisible: false } },
    { type: "exit", timestamp: BASE + 318000, payload: { lastElementId: "footer-link", maxDepth: 96 } },
  ],
};
