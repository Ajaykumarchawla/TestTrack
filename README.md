# 🚀 TestTrack

**Track your learning. Improve with every question.**

TestTrack is an offline-friendly MCQ testing platform designed to help learners not only take quizzes, but also track their performance, measure improvement over time, and identify knowledge gaps.

With simple test creation via JSON files and a zero-setup launch experience, TestTrack is ideal for students, educators, and self-learners.

📊 Personalized analytics let users see how well they’re doing — and what to focus on next.

<!-- 🧠 In the future, TestTrack will include AI-powered question generation based on user weaknesses, making learning smarter and more adaptive. -->

## 🟣 One-Time Setup (Only Once)

1. ✅ Install **[Node.js (LTS)](https://nodejs.org/)**
   - During install, check ✅ “Add to PATH”

---

## 🚀 How to Use

1. Run the build (only required if you're developing):

   ```bash
   npm install
   npm run build
   ```

2. ✅ **Double-click `start_server.bat`**
   - Starts the platform at: `http://localhost:5000`
   - Automatically opens your browser
   - Automatically stops when the window is closed

---

## 📂 Add Your Own Tests

1. Go to:

   ```
   public/mcqs/
   ```

2. Create folders for topics and subtopics:

   ```
   public/mcqs/Maths/Algebra/
   ```

3. Add your test files like:

   ```
   test1.json
   ```

4. ✅ JSON Format for test files:

   ```json
   {
     "1": {
       "Question": "What is 2 + 2?",
       "Options": {
         "A": "3",
         "B": "4",
         "C": "5",
         "D": "6"
       },
       "correct option": {
         "option key": "B",
         "description": "2 + 2 = 4"
       }
     }
   }
   ```

5. After adding tests:
   - Run `npm run build`
   - Then double-click `start_server.bat`

---

## 🧪 Developer Commands

```bash
npm install     # install dependencies
npm run dev     # development mode with live reload
npm run build   # creates static build in /dist
```

---

## 📦 Distribute the Platform

Once built:

- Zip the `/dist` folder and `start_server.bat`
- Anyone can unzip and double-click to start using
- No server, no internet, no configuration needed

---

Made with ❤️ for better testing, smarter learning.
