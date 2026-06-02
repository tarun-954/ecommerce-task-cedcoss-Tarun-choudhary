# Process Document Draft (Round 2)

Use this as the base text for your Google Doc submission.

## 1) What I understood from the task
I needed to build a Product Review and Rating section for an e-commerce product page (SoundHub headphones), where users can:
- give a rating from 1 to 5,
- write a short review,
- see all submitted reviews,
- and see the average rating at the top.

Bonus requirement was allowing users to mark reviews as Helpful.

## 2) What I decided to build and why
I built a full-stack mini app with:
- React frontend for interactive UI,
- Node.js + Express backend for API handling,
- MongoDB for storing reviews.

I chose this because it matches common e-commerce architecture and scales better than a frontend-only demo.

## 3) Planning before coding
I split work into small modules and committed each one:
1. Base structure setup
2. Backend review APIs
3. Frontend review UI
4. Helpful vote UX improvements
5. Final polish and documentation

This approach helped me avoid confusion and keep progress visible.

## 4) Tools/frameworks used and why
- React.js: component-based UI and fast iteration
- Vite: quick dev server and build
- Node.js + Express: simple REST API setup
- MongoDB + Mongoose: flexible schema for review data
- Git/GitHub: version tracking with incremental commits

## 5) AI usage
Yes, I used AI assistance during development.

How it helped:
- structured implementation plan in modules,
- generated/refined boilerplate faster,
- helped with debugging and review of incremental changes.

I verified and understood each part before finalizing.

## 6) Day-by-day progress log

### Day 1
- Read and broke down task requirements
- Created project structure (client/server/docs)
- Initialized repository and first commit

### Day 2
- Built backend model, routes, controllers
- Added create review, list review, and helpful endpoints
- Connected MongoDB and tested API flow

### Day 3
- Built frontend review form and review list
- Added average rating summary
- Implemented Helpful button and improved UX
- Finalized README and submission documentation

## 7) Hardest part and solution
The hardest part was coordinating frontend and backend state updates cleanly after creating a review or marking Helpful.

I solved this by centralizing data refresh with a single `fetchReviews()` flow and handling loading/error states explicitly.

## 8) Final project status
Working features:
- Add review with 1-5 star rating
- Display all reviews
- Display average rating and review count
- Mark reviews as Helpful

If I had more time:
- Add authentication to prevent abuse
- Add edit/delete review by owner
- Add pagination and filtering
- Deploy app online with CI/CD

## 9) Repository and submission links
- GitHub Repo: [paste your GitHub link here]
- Google Doc Link: [paste your Google Doc link here]
