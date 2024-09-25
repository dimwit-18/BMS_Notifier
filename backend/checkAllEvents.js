import runWebScrapingService from './utilities/webScrapingService.js'; 
import notifyUsers from './utilities/userNotificationService.js';
import models from "./model/model.js";
import plimit from 'p-limit'

const Event = models.Event;
const limit = plimit(10); // limit for number of concurrent webscraping services that can be run

async function checkAllEvents() {
  try {
    // Fetch all events
    const events = await Event.find({});
    console.log('Entered checkAllEvents function');

    if (events.length === 0) {
      console.log('No events to check.');
      return;
    }

    const eventCheckPromises = events.map((event) => limit(async () => {
      const isAvailable = await runWebScrapingService(event.theatreName?'':event.url, event.theatreName?event.url:'', event.theatreName);
      console.log("event and availability", event.url, isAvailable);
      if (isAvailable) {
        await notifyUsers(event);
        await Event.deleteOne({ _id: event._id });
        console.log(`Event ${event.url} deleted after notification.`);
      } else {
        console.log(`No tickets available for event: ${event.url}`);
      }
    })
    );

    await Promise.all(eventCheckPromises);
    console.log('All events checked.');
  } catch (error) {
    console.error('Error checking events:', error);
  }
}

export default checkAllEvents;
