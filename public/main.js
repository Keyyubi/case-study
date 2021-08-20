// @ts-check

import { APIWrapper, API_EVENT_TYPE } from "./api.js";
import { addMessage, animateGift, isPossiblyAnimatingGift, isAnimatingGiftUI } from "./dom_updates.js";

const api = new APIWrapper();
let agQueue = [], eQueue = [];

api.setEventHandler((events) => {
  if (events.length > 0) {
    if (agQueue.length === 0) {
      const index = events.findIndex(e => e.type === API_EVENT_TYPE.ANIMATED_GIFT);
      const event = events.splice(index, 1)[0];

      animateGift(event);
    }

    if (eQueue.length === 0) {
      const index = events.findIndex(e => e.type !== API_EVENT_TYPE.ANIMATED_GIFT);
      const event = events.splice(index, 1)[0];

      addMessage(event);
    }

    events.forEach(e => {
      switch (e.type) {
        case API_EVENT_TYPE.ANIMATED_GIFT:
          agQueue.push(e);
          break;
        default:
          eQueue.push(e);
          break;
      };
    });
  }
})

// Showing one event at most in every 500ms
setInterval(() => {
  if (agQueue.length > 0 && !isPossiblyAnimatingGift()) {
    const ag = agQueue.shift();

    animateGift(ag);
  }
  if (eQueue.length > 0) {
    // Gets MESSAGE events newer than 20 sec.
    const e = getSyncedMessage();

    addMessage(e);
  }
}, 500);

/**
 * @function getSyncedMessage
 * @description If the eventType is MESSAGE checks wheter is the event newer than 20 seconds. If eventType is not MESSAGE returns the event immediately
 */
const getSyncedMessage = () => {
  const e = eQueue.shift();
  if (e.type == API_EVENT_TYPE.MESSAGE) {
    const now = new Date();
    const eDate = new Date(e.timestamp);
    const diff = (now.getTime() - eDate.getTime()) / 1000; // => as seconds
    if (Math.abs(diff) > 20) {
      getSyncedMessage();
    }
    return e;
  }
  return e;
}
