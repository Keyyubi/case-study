// @ts-check

import { APIWrapper, API_EVENT_TYPE } from "./api.js";
import { addMessage, animateGift, isPossiblyAnimatingGift, isAnimatingGiftUI } from "./dom_updates.js";

const api = new APIWrapper();
let agQueue = [], mQueue = [], gQueue = [];

api.setEventHandler((events) => {
  events.forEach(e => {
    switch (e.type) {
      case API_EVENT_TYPE.ANIMATED_GIFT:
        agQueue.push(e);
        break;
      case API_EVENT_TYPE.MESSAGE:
        mQueue.push(e);
        break;
      case API_EVENT_TYPE.GIFT:
        gQueue.push(e);
        break;
    };
  });
})

// Showing 1 event in every 500ms
setInterval(() => {
  if (agQueue.length > 0 && !isPossiblyAnimatingGift()) {
    const ag = agQueue.shift();

    animateGift(ag);
  }
  else if (mQueue.length > 0) {
    // Uncomment below line after you read PERSONEL NOTE
    // const m = getSyncedMessage(); 

    // Comment below line after you read PERSONEL NOTE
    const m = mQueue.shift();

    addMessage(m);
  }
  else if (gQueue.length > 0) {
    const g = gQueue.shift();

    addMessage(g);
  }
}, 500);

/**
 * PERSONEL NOTE (MK)
 * I'm note sure about the `Events with the type `MESSAGE` older than 20 seconds should not be shown to the user.` option.
 * So I added commented lines as an alternative and you can check it by uncommenting those lines if that's the expectation
 */

/**
 * @function getSyncedMessage
 * @description Finds the first message in the queue that's newer than 20 seconds. Uncomment the function if it's neccesary
 */
// const getSyncedMessage = () => {
//   const m = mQueue.shift();
//   const now = new Date();
//   const mDate = new Date(m.timestamp);
//   const diff = (now.getTime() - mDate.getTime()) / 1000; // => as seconds
//   if(Math.abs(diff) > 20) {
//     getSyncedMessage();
//   } else {
//     return m;
//   }
// }

// NOTE: UI helper methods from `dom_updates` are already imported above.
