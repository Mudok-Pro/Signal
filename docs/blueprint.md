# **App Name**: ميكا-تك | MekaTech

## Core Features:

- User Roles: Clients create job requests and view nearby mechanics; Mechanics toggle availability and view open requests.
- Find Nearby Mechanics: Clients can locate nearby mechanics using their location via GeoFirestore.
- Job Requests: Clients submit a form with job details; mechanics get a real-time notification and can accept/decline.
- Live Updates: Firestore snapshot listeners provide real-time job status changes.
- Notifications: Firebase Cloud Messaging alerts mechanics of new requests; optional email notifications.

## Style Guidelines:

- Primary Color: #0077C2 (deep mechanic blue - trust and technology).
- Accent Color: #F28C38 (warm orange - energy and motion).
- Background: #F8F9FB.
- Card Background: #FFFFFF with subtle shadow.
- Font: 'Tajawal' for Arabic, 'Poppins' for English.
- Icons: Flat line icons in blue and gray tones.
- RTL Layout: Arabic by default, with LTR switch available.
- Mobile-first layout (RTL support) using hidden sections or a single-page view with JS toggles.
- Use soft shadows, rounded cards, and high-contrast text for accessibility.