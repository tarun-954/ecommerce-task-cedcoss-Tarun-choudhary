# ecommerce-task-cedcoss-Tarun-choudhary

Round 2 task project for Cedcoss x LPU placement drive.

## Tech Stack
- React.js (frontend)
- Node.js + Express (backend)
- MongoDB (database)

## Features
- Submit product reviews with 1-5 star ratings
- Show average rating and total number of reviews
- List all reviews for the product
- Mark a review as Helpful (thumbs-up)
- Prevent repeated helpful votes per browser (basic localStorage guard)

## Folder Structure
```text
client/   -> React + Vite frontend
server/   -> Node.js + Express + MongoDB backend
docs/     -> process and submission notes
```

## Setup Instructions

### 1) Backend
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### 2) Frontend
```bash
cd client
npm install
npm run dev
```

### 3) Open App
- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:5000/api/health`

## API Endpoints

### `POST /api/reviews`
Create a new review.

Request body:
```json
{
  "productId": "soundhub-headphones-001",
  "customerName": "Tarun",
  "rating": 5,
  "comment": "Great sound quality and battery backup."
}
```

### `GET /api/reviews/:productId`
Fetch all reviews for a product, including average rating and total count.

### `POST /api/reviews/:id/helpful`
Increment helpful count for a review.

## Project Modules (Incremental Commits)
1. Module 1: Base project structure
2. Module 2: Backend API (reviews CRUD)
3. Module 3: Frontend UI for ratings + reviews
4. Module 4: Helpful vote UX improvements
5. Module 5: README + process-document support

## Tools Used
- React + Vite
- Node.js + Express
- MongoDB + Mongoose
- AI assistance for implementation guidance and iteration

## Reference
UI inspiration: [Stitch - Design with AI](https://stitch.withgoogle.com/projects/952285540254595572)
