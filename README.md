# MeetMint

**Meet people. Mint memories.**

MeetMint is a multiplayer IRL social game built on Monad that turns real-world networking into a game.

Users create a digital identity, discover people around them, meet them in person, scan each other's QR codes, and create verifiable onchain encounters. Every encounter becomes part of their personal collection, earns XP, progresses quests, unlocks achievements, and contributes to a live event leaderboard.

The goal is simple: make meeting people at hackathons, conferences, meetups, universities, and communities more engaging, memorable, and rewarding.

---

## The Idea

Networking has barely changed.

You walk into an event, meet someone interesting, exchange a LinkedIn or X profile, maybe save their Telegram, and move on. After the event, most of those connections disappear into a feed and are rarely revisited.

MeetMint takes a different approach.

Instead of treating networking as exchanging contact information, MeetMint treats every real-world interaction as an **Encounter**.

You meet someone.

You scan their QR.

You connect.

The encounter is recorded onchain.

You receive their Encounter Card.

You earn XP.

Your quest progresses.

Your collection grows.

Your position on the event leaderboard changes.

What was previously an ordinary networking interaction becomes part of a multiplayer social game.

> **Meet people. Mint memories.**

---


## Smart Contracts

Foundry contracts in `contracts/src/`, deployed on **Monad Testnet** (chain id `10143`):

| Contract | Purpose | Address |
|----------|---------|---------|
| `MeetMintIdentity` | User identity NFTs | [`0x38922F3aA335a392f66ab01292db369564C007Fa`](https://testnet.monadvision.com/address/0x38922F3aA335a392f66ab01292db369564C007Fa) |
| `MeetMintEncounter` | Onchain encounter records | [`0x37068dB6bf8628ECBD685608d616E2026291B63c`](https://testnet.monadvision.com/address/0x37068dB6bf8628ECBD685608d616E2026291B63c) |
| `MeetMintBadge` | Achievement badges | [`0x92369A8527557955e6A81e98c090D2d3dB043758`](https://testnet.monadvision.com/address/0x92369A8527557955e6A81e98c090D2d3dB043758) |
| `MeetMintEvent` | Event drops | [`0x372C7acdf91A62b9A8957B2298A50bcb0515961A`](https://testnet.monadvision.com/address/0x372C7acdf91A62b9A8957B2298A50bcb0515961A) |

Set these in `web/.env.local`:

```env
NEXT_PUBLIC_IDENTITY_CONTRACT=0x38922F3aA335a392f66ab01292db369564C007Fa
NEXT_PUBLIC_ENCOUNTER_CONTRACT=0x37068dB6bf8628ECBD685608d616E2026291B63c
NEXT_PUBLIC_BADGE_CONTRACT=0x92369A8527557955e6A81e98c090D2d3dB043758
NEXT_PUBLIC_EVENT_CONTRACT=0x372C7acdf91A62b9A8957B2298A50bcb0515961A
```



## How It Works

The core gameplay loop is:

```text
Create your identity
        |
        v
Enter an event world
        |
        v
Discover people nearby
        |
        v
Meet someone in real life
        |
        v
Scan their QR profile
        |
        v
Create an onchain Encounter
        |
        v
Receive their Encounter Card
        |
        v
Earn XP and progress quests
        |
        v
Unlock badges and event drops
        |
        v
Compete on the leaderboard
````

The blockchain is intentionally abstracted away from the primary user experience.

Users should feel like they are playing a social game, not interacting with a blockchain application.

---

# Core Product

## 1. MeetMint Identity

Every user starts by creating a MeetMint profile.

The profile becomes their digital identity inside the MeetMint ecosystem and includes:

* Name
* Avatar
* Role
* Interests
* Experience level
* XP
* Encounter count
* Badges
* Shareable QR code

A user's profile is represented as a collectible identity card.

Example:

```text
MEETMINT

NAKSHATRA GOEL

BUILDER
WEB3 · AI · PRODUCT

LEVEL 7
1,240 XP

38 ENCOUNTERS
7 BADGES

[ QR CODE ]
```

The QR code is the primary mechanism for exchanging identities in person.

Instead of typing usernames, searching profiles, or exchanging multiple social handles, users can simply scan and connect.

---

## 2. Event Worlds

MeetMint organizes users into event-specific worlds.

For the hackathon, the default world is:

```text
MONAD BLITZ DELHI

82 EXPLORERS
147 ENCOUNTERS
23 QUESTS COMPLETED
```

An event world contains:

* Participants
* Nearby users
* Encounters
* Quests
* Leaderboards
* Event-specific badges
* Limited collectibles
* Event drops

This allows MeetMint to become a reusable engagement layer for physical events.

The same model can work for:

* Hackathons
* Developer conferences
* Web3 events
* Startup meetups
* University events
* Creator gatherings
* Community events
* Brand activations

---

## 3. Nearby Discovery

Users can discover other MeetMint participants around them through a privacy-preserving proximity interface.

Instead of exposing precise GPS coordinates, MeetMint uses approximate proximity zones.

Users might see:

```text
5 people nearby

3 builders
1 creator
1 founder
```

Or:

```text
RARE ENCOUNTER NEARBY

Builder
Monad
```

The goal is to create a sense of exploration without turning the application into a real-time location tracker.

For the hackathon MVP, the event map is represented as a stylized interactive environment rather than relying on a full mapping platform.

---

## 4. Encounters

An Encounter is the fundamental social primitive in MeetMint.

When two people meet, one user scans the other's QR profile.

The other person confirms the connection.

MeetMint then creates an Encounter.

```text
NEW ENCOUNTER

You met Arjun

BUILDER
MONAD
SOLIDITY

+25 XP

NEW CARD ADDED
```

The encounter records information such as:

* User A
* User B
* Event
* Timestamp
* Encounter ID

The interaction can then be used to update:

* User XP
* Quest progress
* Collection
* Achievement progress
* Event statistics
* Leaderboard position

This creates a verifiable record of an IRL interaction.

---

## 5. Encounter Cards

Every Encounter can become a collectible digital card.

The collection represents the people and experiences a user has encountered throughout their MeetMint journey.

Example:

```text
MY COLLECTION

PEOPLE

Arjun
Builder
Monad

Riya
Creator
AI

Dev
Developer
DeFi

47 PEOPLE ENCOUNTERED
```

Cards can contain:

* Profile information
* Role
* Interests
* Event
* Date of encounter
* Encounter number
* Achievements
* Rarity or status

The goal is not to create another NFT marketplace.

The collectible is the memory of the interaction.

---

## 6. Quests

Quests give users a reason to actively explore an event and meet new people.

Example:

```text
MONAD BLITZ QUEST

Meet 3 new people       2/3
Meet a Builder          1/1
Meet someone new        2/1
Complete your profile   1/1

REWARD

+100 XP
BLITZ EXPLORER
```

Example quests include:

### The Connector

Meet 10 unique people.

### The Builder

Meet 3 developers or builders.

### The Explorer

Meet someone you have never encountered before.

### Speedrunner

Complete 3 encounters within 5 minutes.

### Collector

Collect 10 Encounter Cards.

### Social Butterfly

Meet people from 5 different categories.

Quests transform networking from a passive activity into something users actively participate in.

---

## 7. XP and Levels

Every interaction contributes to a user's progression.

Example XP system:

| Action                    |   XP |
| ------------------------- | ---: |
| First Encounter           |  +50 |
| Normal Encounter          |  +25 |
| Complete Quest            | +100 |
| Attend Event              | +100 |
| Complete Event Collection | +250 |
| Claim Event Drop          | +250 |

Users progress through levels as they accumulate XP.

```text
LEVEL 1
Explorer

LEVEL 5
Connector

LEVEL 10
Socializer

LEVEL 25
Community Builder

LEVEL 50
MeetMint Legend
```

The progression system gives users a reason to keep participating even after their first interaction.

---

## 8. Badges and Achievements

Users can unlock permanent achievements based on their activity.

Examples:

```text
FIRST CONTACT
Complete your first Encounter.

CONNECTOR
Meet 25 unique people.

EXPLORER
Attend 3 different events.

BUILDER
Meet 10 builders.

EVENT CHAMPION
Finish an event in the top 3.

MONAD OG
Participate in an early Monad event.
```

Badges become part of the user's identity and collection.

Unlike arbitrary profile badges, they are earned through actions inside MeetMint.

---

## 9. Event Drops

Events can create limited edition digital collectibles.

Example:

```text
MONAD BLITZ 2026

LIMITED EVENT DROP

382 / 500 CLAIMED

Requirements:

Attend the event
Meet 3 people
Complete the Blitz Quest

[ CLAIM DROP ]
```

This gives event organizers a new way to reward participation.

Over time, users could build collections of event experiences:

```text
MONAD BLITZ 2026
ETHINDIA 2026
DEVCON 2026
IITR HACKATHON
MONAD COMMUNITY MEETUP
```

The collection becomes a record of where a user has participated and what they accomplished.

---

## 10. Live Leaderboard

MeetMint turns the event itself into a multiplayer competition.

Example:

```text
MONAD BLITZ

1. Nakshatra       425 XP
2. Arjun           380 XP
3. Riya            350 XP
4. Dev             325 XP
5. Ankit           290 XP
```

As users complete encounters and quests, the leaderboard changes.

This is particularly important for live events because the application can be used by multiple people simultaneously.

The hackathon itself becomes the game world.

---

# Why Monad?

MeetMint is designed around a type of application that can generate a large number of small, frequent interactions.

Imagine an event with 100 participants.

If every participant creates 10 encounters:

```text
100 users
x
10 encounters
=
1,000 social interactions
```

An Encounter can also affect several pieces of game state:

```text
Encounter
    |
    +-- XP
    |
    +-- Quest Progress
    |
    +-- Collection
    |
    +-- Badge Progress
    |
    +-- Leaderboard
```

This makes MeetMint a high-frequency consumer application rather than a traditional NFT application where users perform a handful of transactions.

Monad is used as the onchain multiplayer layer for these interactions.

The goal is to make onchain activity feel instantaneous and natural enough that users don't think about the underlying blockchain.

Instead of:

```text
Sign transaction
Wait for confirmation
Check wallet
Find NFT
```

the user experiences:

```text
You met Arjun.

+25 XP

New card added.
```

The blockchain is underneath the interaction, not in the way of it.

---

# Why Blockchain?

A traditional social application can tell you that you met someone.

MeetMint can create a verifiable record of that interaction.

This introduces a new primitive:

## Proof of Encounter

An Encounter represents a mutually confirmed real-world interaction between two users.

This can eventually become part of a user's permanent onchain social history.

Instead of building a social graph around:

```text
Follow
Like
Message
Friend Request
```

MeetMint builds a graph around:

```text
Actually Met
```

That distinction is the foundation of the product.

---

# Consumer-First Web3

MeetMint intentionally hides unnecessary crypto complexity.

Users should be able to enter the application through a familiar authentication flow and receive an embedded wallet without needing to understand:

* Seed phrases
* Gas
* Chain IDs
* Contract addresses
* Transaction mechanics

The application exposes blockchain information only when useful.

For example:

```text
VERIFIED ON MONAD

View transaction
```

This allows MeetMint to maintain the benefits of onchain ownership and verification while keeping the user experience familiar to mainstream consumers.

---

# The MeetMint Passport

The long-term vision is a personal IRL Passport.

After attending multiple events and meeting hundreds of people, a user's profile could look like:

```text
MEETMINT PASSPORT

NAKSHATRA GOEL

LEVEL 12
4,250 XP

184 ENCOUNTERS
12 EVENTS
23 BADGES
7 CITIES

EVENTS

MONAD BLITZ
ETHINDIA
DEVCON
IITR HACKATHON
```

The passport becomes a visual representation of a user's real-world journey.

It can answer:

* Who have you met?
* Which communities have you participated in?
* Which events have you attended?
* What achievements have you earned?
* How active are you within a community?

This is the long-term social identity layer behind MeetMint.

---

# What Makes MeetMint Different?

Most Web3 social applications start with the blockchain and try to find a reason for users to interact with it.

MeetMint starts with a familiar consumer problem:

> **Meeting people at real-world events is boring and forgettable.**

Then it adds game mechanics:

```text
People
+
Encounters
+
Quests
+
XP
+
Collections
+
Leaderboards
```

And uses blockchain as the infrastructure underneath those mechanics.

The result is not an NFT profile application.

It is a multiplayer social game where **people and experiences become the collectibles**.

---

# Hackathon Demo

The Monad Hackathon itself is the perfect environment for MeetMint.

A live demo can work like this:

### Step 1

A user enters MeetMint.

### Step 2

They create their profile card.

### Step 3

They enter the Monad Blitz event world.

### Step 4

They see other participants nearby.

### Step 5

They walk up to another participant and scan their QR.

### Step 6

Both users confirm the interaction.

### Step 7

MeetMint creates the Encounter.

```text
NEW ENCOUNTER

You met Arjun

+25 XP
```

### Step 8

The Encounter Card appears in the collection.

### Step 9

The active quest updates:

```text
MEET 3 PEOPLE

2 / 3
```

### Step 10

The user's XP and leaderboard position update.

The result is a demo where judges don't just watch the product.

They can participate in it.

---

# Product Architecture

```text
                     MEETMINT
                         |
          +--------------+--------------+
          |                             |
      Consumer UI                  Game Layer
          |                             |
      Next.js                    XP / Quests
      React                      Badges
      Tailwind                   Collections
      Framer Motion              Leaderboard
          |                             |
          +--------------+--------------+
                         |
                    Web3 Layer
                         |
                 Privy / Wallet
                         |
                    wagmi / viem
                         |
                       Monad
                         |
        +----------------+----------------+
        |                |                |
    Identity         Encounter         Events
    Contract         Contract         Contract
        |                |                |
        +----------------+----------------+
                         |
                   Onchain State
```

Supabase is used for application-level data and realtime synchronization where configured.

The blockchain layer handles the parts of the experience that benefit from onchain ownership and verification.

---

# Smart Contracts

The project includes four primary contract concepts.

## MeetMintIdentity

Handles user identity and identity cards.

Responsibilities:

* Create identity
* Store identity reference
* Associate identity with wallet
* Support identity metadata

## MeetMintEncounter

Handles onchain Encounters.

Responsibilities:

* Create encounter
* Associate two users
* Associate encounter with event
* Record timestamp
* Emit encounter events

## MeetMintBadge

Handles achievement badges.

Responsibilities:

* Award badges
* Track achievement ownership
* Support event-specific achievements

## MeetMintEvent

Handles event-specific experiences.

Responsibilities:

* Create events
* Configure event drops
* Track event participation
* Support event-specific collectibles

The MVP intentionally keeps the contracts simple so the consumer experience remains the focus.

---

# Tech Stack

### Frontend

* Next.js 16
* React
* TypeScript
* Tailwind CSS
* Framer Motion

### Web3

* Monad Testnet
* wagmi
* viem
* MetaMask
* Solidity
* Foundry

### Authentication

* Privy / embedded wallet infrastructure

### Data

* Supabase
* PostgreSQL
* Supabase Realtime
* localStorage fallback for demo mode

### QR

* html5-qrcode
* qrcode.react

### Avatars

* DiceBear generated avatars

---

# Project Structure

```text
meetmint/
|
├── web/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   ├── onboarding/
│   │   │   ├── explore/
│   │   │   ├── quests/
│   │   │   ├── collection/
│   │   │   └── profile/
│   │   │
│   │   ├── components/
│   │   │   ├── branding/
│   │   │   ├── cards/
│   │   │   ├── game/
│   │   │   ├── social/
│   │   │   ├── map/
│   │   │   ├── navigation/
│   │   │   └── ui/
│   │   │
│   │   ├── lib/
│   │   │   ├── blockchain/
│   │   │   ├── game/
│   │   │   ├── mock/
│   │   │   └── supabase/
│   │   │
│   │   └── providers/
│   │
│   └── .env.local
│
├── contracts/
│   ├── src/
│   │   ├── MeetMintIdentity.sol
│   │   ├── MeetMintEncounter.sol
│   │   ├── MeetMintBadge.sol
│   │   └── MeetMintEvent.sol
│   │
│   ├── script/
│   └── test/
│
└── supabase/
    └── schema.sql
```

---

# Quick Start

Clone the repository and install dependencies:

```bash
cd web
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Wallet Authentication

By default:

```env
NEXT_PUBLIC_DEMO_MODE=false
```

Users authenticate with MetaMask and interact with the Monad Testnet.

For hackathon demonstrations, the application can run in demo mode:

```env
NEXT_PUBLIC_DEMO_MODE=true
```

Demo mode allows users to experience the complete product without requiring a configured wallet.

---

# Supabase Setup

MeetMint can use Supabase for persistent application state and realtime updates.

When the following environment variables are configured:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

the application stores and synchronizes:

* Profiles
* Encounters
* Quests
* Collection items
* Leaderboard state
* Event information

Supabase Realtime is used to synchronize leaderboard and relevant application state.

If Supabase is not configured, the application falls back to localStorage and demo data.

### Setup

1. Create a Supabase project.
2. Open the SQL Editor.
3. Run:

```text
supabase/schema.sql
```

4. Add the Supabase environment variables to:

```text
web/.env.local
```

5. Restart the development server.

---

# Demo Mode

The project includes a demo environment designed specifically for live hackathon demonstrations.

Demo users include:

```text
Arjun Mehta
Builder
Monad / Solidity

Riya Sharma
Creator
AI / Content

Dev Patel
Developer
DeFi / Infrastructure

Ananya Rao
Designer
Product / UX

Karan Singh
Founder
Consumer / Web3
```

The demo environment includes:

* Monad Blitz event
* Nearby participants
* Existing encounters
* Quest progress
* XP
* Badges
* Collection cards
* Leaderboard data
* Event drops

This makes it possible to demonstrate the complete product even without waiting for real event participation.

---

# Design System

MeetMint uses a Neo-Brutalist design language.

The visual identity is intentionally different from conventional Web3 applications.

Key principles:

* Strong black borders
* Hard offset shadows
* Bold typography
* High contrast
* Solid colors
* Chunky buttons
* Collectible-card aesthetics
* Playful interactions
* Strong visual hierarchy
* Mobile-first interaction design

The application avoids:

* Glassmorphism
* Generic dark crypto dashboards
* Excessive gradients
* Corporate SaaS styling
* Dense technical interfaces
* Wallet-first UX

The goal is for MeetMint to feel like a consumer game first and a Web3 application second.

---

# Privacy

MeetMint is designed around the idea that discovering nearby people should not require exposing exact user locations.

The MVP uses approximate proximity rather than displaying precise coordinates.

The long-term system can further improve privacy through:

* Coarse location zones
* Event-specific proximity
* Opt-in discoverability
* Temporary presence
* Zero-knowledge or privacy-preserving encounter verification

The objective is to make IRL discovery useful without creating an unnecessary location surveillance layer.

---

# Future Roadmap

## Phase 1: Event Networking

Focus on hackathons, conferences, and meetups.

Core features:

* Profiles
* Encounters
* QR connections
* Quests
* XP
* Leaderboards
* Event drops

## Phase 2: Community Layer

Allow communities and organizers to create their own MeetMint Worlds.

Features:

* Custom events
* Custom quests
* Custom badges
* Custom drops
* Community leaderboards
* Organizer analytics

## Phase 3: MeetMint Passport

Build a persistent IRL identity layer.

Users can accumulate:

* People encountered
* Events attended
* Communities joined
* Achievements
* Cities explored
* Experiences collected

## Phase 4: IRL Social Graph

Build a broader social graph based on real-world interactions.

The goal is to create a network where reputation is based less on who you follow and more on the communities and people you have actually interacted with.

---

# Vision

MeetMint starts with a simple question:

> **What if meeting people was actually fun?**

The current internet is built around digital interactions.

MeetMint is designed around the physical world.

Instead of turning every interaction into another follower count, MeetMint turns it into an experience.

Instead of collecting followers, you collect encounters.

Instead of scrolling through a feed, you explore the people around you.

Instead of leaving an event with a list of forgotten contacts, you leave with a collection of memories.

The long-term vision is to create an onchain social layer for the real world.

**Meet people. Mint memories.**
