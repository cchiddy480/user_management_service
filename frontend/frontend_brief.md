User Management Frontend


Overview
The objective of this project is to build a web-based frontend for the Server you have developed so far.



The app should provide a user interface for interacting with the WebSocket server and allow users to perform CRUD operations against the database.



The purpose is to introduce the frontend development technologies we use.



Functional Requirements
The application should provide the ability to:

Connect to the WebSocket server
Display the connection status
List all users
View an individual user
Create, update and delete a user
Display success and error messages appropriately.


The application should communicate via WebSocket messages using the message format defined by the Server.



Technical Requirements
Framework
Build the application using:

Vue.js
TypeScript
Quasar Framework


Application Structure
The application should be organisation into areas, separating responsibilities such as:

Pages
Reusable components
Services
Data models/interfaces


UI
Doesn't need to be complex, but should provide a good UX. Consider:

Navigation layout
User list/table
Loading states
Confirmation dialogs
Responsive layouts
The application should make good use of Quasar components rather than custom styling.



State Management
Consider how application state should be managed, for example, you could implement a 'store' like Pinia.



Testing
If you get through this quickly, consider creating automated tests for key functionality where appropriate, using Cypress.