# Name

- The app is called RAid.

# Users

- Users are unveristy residential asisstants 

# Value proposition

RA-facing app that  tracks resident information (contact info, emergency contact, supervisor, etc.) and allows RAs to send universal(across all comunication channels) messages to students or their associated contacts for activities, forms to fill, or anything else 

# Key features
Message drafting: 
- RA should be able to type up their broadcast message. Automatically save for the RA to come back to it later. 

Communication channel selection 
- RA should be able to select which communication channel they want to send the message to (email, GroupMe, text, etc). 


# Example scenario

Here is an example session.

- Alice, Bob, Cathy, and Dave are students living in RA Edgar's dorm hall. 
- Alice, Cathy, Cathy, and Dave all have different prefered ways of communication.
- Alice prefers email, Bob prefers text, Dave perfers GroupMe, and Cathy prefers email. 
- Edgar needs to send an message about an event he wants to host for the floor. 
- Edgar opens the app and drafts his message.
- Edgar stops the drafting the message and closes the application to send a text to someone else, when Edgar returns to the application his drafted message is still there.
- After finishing his message and is ready to send the message to his residents, so Edgar selects to send his message. 
- A second screen pops up with checkboxes of the different channels of commmunication for Edgar to select. 
- Edgar selects the channels he wants the message to send to and pressed send. 
- After Edgar presses send, he will be notified of all the channels that successfully sent the message to his residents.

# Coding notes

- Use variable 'channels' to store the different channel methods and generate a list of possible methods.

# Testing notes
- Define unit tests for not selecting any channels to send to and attempting to send a message.
- Define unit tests for sending a blank message.
- Define unit test for draft message automatically saving. 
- Define unit test for the popup notifcation that shows the user of the successful channels their message sent to. 
