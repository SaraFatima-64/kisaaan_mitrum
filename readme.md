# Kisan Project — README

<!-- AGENT INSTRUCTIONS
This file is the single source of truth for the Kisan project.
CRITICAL MANDATORY RULE: Whenever any new functionality, feature, or structural change is made to the codebase in the future, you MUST automatically update this README file to reflect those changes.
When making changes:
  1. Update the relevant section(s) (e.g., [COMPONENTS], [UI_DESIGN], etc.).
  2. Increment the version number in the [Meta] block below.
  3. Update the `last_updated` date.
  4. Add a descriptive entry under [Changelog] documenting the new functionality.
Sections use SCREAMING_SNAKE_CASE anchors so agents can locate them with a grep or keyword search.
-->

---

## [META]
```
project_name   : Kisan
version        : 2.2.0
last_updated   : 2026-04-18
status         : In Development
document_owner : Project Team
```

---

## [PROJECT_OVERVIEW]

Kisan is an AI-powered personal farming assistant designed for Kerala farmers.
It combines a **software platform** (Kisan Mitrum) with a **hardware rover** (Kisan Sakhi)
to deliver personalized, real-time agricultural guidance using AI, IoT, and Machine Learning.

---

## [COMPONENTS]

### 1. Kisan Mitrum — Software Platform
> Type: Web Application

A React.js + FastAPI web platform that acts as the farmer's digital assistant.

**Features:**
- User Authentication System (Sign In/Log In modal with dynamic user profile display)
- Multilingual support with explicit language toggling functionality
- Responsive Navigation (Top status bar and collapsible left-hand menu)
- AI Chatbot (OpenAI LLM API integration with rule-based fallback and Voice-to-Text input)
- Weather alerts dashboard
- Activity logging system (dynamic entry with adaptive virtual Hindi/Malayalam keyboard)
- E-commerce marketplace (with cart management and image-mapped inventory)
- Government schemes portal
- Rover booking page (for Kisan Sakhi)
- Data analysis dashboard (displays rover-collected data)

---

### 2. Kisan Sakhi — Hardware Rover
> Type: Robotic field rover

A physical rover deployed in the field that collects agricultural data
and transmits it to Kisan Mitrum for AI processing.

**Hardware Components:**
- Arduino Uno
- Raspberry Pi
- Pi Camera
- Soil moisture sensor
- pH measurement mechanism
- Motors (movement + camera control)

**Software on Rover:**
- YOLO-based object detection
- Embedded C logic for robot control

---

## [TECH_STACK]

| Layer       | Technology                          |
|-------------|--------------------------------------|
| Frontend    | React.js                             |
| Backend     | FastAPI (Python)                     |
| Database    | SQLite                               |
| AI / ML     | LLM (chatbot), YOLO (object detect.) |
| Logic       | Rule-based + Decision Trees          |
| Embedded    | Embedded C (Arduino/Raspberry Pi)    |

---

## [SYSTEM_WORKFLOW]

```
[Field]                     [Platform]                  [Farmer]
Kisan Sakhi (rover)  -->  Kisan Mitrum (web app)  -->  Recommendations
  - Soil moisture             - AI model processing        - Chatbot
  - pH levels                 - Data analysis              - Dashboard
  - Camera / YOLO             - Alerts & insights          - Alerts
```

1. Kisan Sakhi collects field data (soil, pH, visual).
2. Data is transmitted to Kisan Mitrum.
3. AI models process the data.
4. Personalized recommendations are delivered to the farmer via the web platform.

---

## [UI_DESIGN]

- **Color Theme:** Green and brown (representing agriculture and soil)
- **Logo:** Kisan Mitrum logo — top-left corner
- **Layout:** Multi-page with dedicated routes for each feature

**Pages / Routes:**
```
/chatbot        → AI Chatbot with voice interface
/weather        → Weather alerts dashboard
/activity       → Activity logging system
/marketplace    → E-commerce marketplace
/schemes        → Government schemes portal
/rover-booking  → Kisan Sakhi rover booking
/dashboard      → Data analysis dashboard
```

---

## [CHANGELOG]

| Version | Date       | Change                                                                                                                                                                      |
|---------|------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 2.2.0   | 2026-04-18 | Elevated Marketplace/Rover Booking with mapped inventory images and confirmation popups; implemented dynamic Activity Logging via a custom multi-language Virtual Keyboard.   |
| 2.1.0   | 2026-04-18 | Added User Authentication, Multilingual localization/toggle, Navigation refactoring, Chatbot migration to OpenAI & offline fallback, and secured environment configurations. |
| 2.0.0   | 2025-07-11 | Initial README created from v2 project document                                                                                                                             |

---

<!-- END OF FILE — Do not add content below this line -->