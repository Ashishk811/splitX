# splitX
A full--stack MERN application to manage group and individual expenses,
create settlements, and track who owes whom.

## 🚀 Features
-   User signup & login (JWT--based authentication)
-   Group creation and member management
-   Add shared or individual expenses
-   Automatic split calculations
-   Settlement between users or within groups
-   Email notifications
-   React + Node.js + MongoDB + JWT

## 📂 Project Structure

expense-app/ │ ├── backend/ \# Node.js + Express + MongoDB API └──
frontend/ \# React Vite UI

## 🛠️ How to Run the Application

### 1️⃣ Download the Project
-   Download the ZIP and extract it.
-   Open the extracted folder.

### 2️⃣ Backend Setup
Go into the backend folder: cd backend

Create a `.env` file inside `backend/` and add:

MONGO_URI=mongodb://localhost:27017/expenseDB 
JWT_SECRET=thisissecret
PORT=5000 
USER="docontap.dev@gmail.com" 
PASS="vaadukoqcwetkddl"
BASE_URL="http://localhost:5173" 
SERVICE="gmail" 
HOST=smtp.gmail.com
EMAIL_PORT=587 
SECURE=false 
OPENAI_API_KEY='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'

### 3️⃣ Install MongoDB (Easy Steps)
Windows Steps: 1. Visit MongoDB Community download page. 2. Install with
default settings. 3. MongoDB runs on port 27017.

### 4️⃣ Run Backend
npm install npm start

### 5️⃣ Run Frontend
cd ../frontend npm install npm run dev
