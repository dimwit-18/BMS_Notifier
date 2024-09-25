import express from "express";
import models from "../model/model.js";

const router = express.Router()
const User = models.User;
const Event = models.Event;

// subscribe to event
router.post('/subscribe', async (req, res) => {
    const { email, movieURL, theatreName, bookingURL } = req.body;
    console.log("email and event url", email, movieURL, bookingURL, theatreName)

    try{
        // Find or create the user
        let user = await User.findOne({ email });
        console.log("kpp user is", user);
        if (!user) {
            user = new User({ email, subscriptions: [] });
            await user.save();
        }
    
        // Find or create the event
        let event = await Event.findOne({ url: theatreName?bookingURL:movieURL, theatreName: theatreName});
        if (!event) {
            event = new Event({ url: theatreName?bookingURL:movieURL, theatreName: theatreName});
            await event.save();
        }
    
        // Add the event to user subscriptions and the user to the event's subscribers
        if (!user.subscriptions.includes(event._id)) {
            user.subscriptions.push(event._id);
            event.subscribers.push(user._id);
            await user.save();
            await event.save();
            console.log(user, event);
        }
        res.status(200).json({ message: "Successfully subscribed!" });
    } catch (error) {
        console.error("Error processing subscription:", error);
        res.status(500).json({ message: "An error occurred, please try again." });
    }

})

export default router;