# Name

- The app is called RAid.

# Users

- Users are univeristy residential assistants 

# Value proposition

RA-facing app that  tracks resident information (contact info, emergency contact, supervisor, etc.) and allows RAs to send universal(across all comunication channels) messages to students or their associated contacts for activities, forms to fill, or anything else 

# Key features
Message drafting: 
- RA should be able to type up their broadcast message. Automatically save for the RA to come back to it later. 

# Example scenario

Here is an example session.

- Alice, Bob, Cathy, and Dave are students living in RA Edgar's dorm hall. 
- Alice, Cathy, Cathy, and Dave all have different prefered ways of communication.
- Alice prefers receiving an email at alice@gmail.com, Bob prefers receiving a text at 801-123-4567, Dave perfers a GroupMe message with username @Dave123, and Cathy prefers at cathy@gmail.com. 
- Edgar needs to send an message about an event he wants to host for the floor. 
- After finishing drafting his message and is ready to send the message to his residents, so Edgar selects to send his message. 
- After Edgar presses send, he will be notified of all the channels that successfully sent the message to his residents.

# Coding notes

- Create a json file to map users to their method of communicaton. 

# Testing notes
- Define unit tests for not selecting any channels to send to and attempting to send a message.
- Define unit tests for sending a blank message.
- Define unit test for draft message automatically saving. 
- Define unit test for the popup notifcation that shows the user of the successful channels their message sent to. 
