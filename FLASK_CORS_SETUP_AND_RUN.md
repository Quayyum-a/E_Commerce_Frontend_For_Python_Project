# Flask Backend CORS Setup

To allow your React frontend to communicate with your Flask backend without CORS issues, follow these steps:

1. Install flask-cors:

   pip install flask-cors

2. In your Flask app (e.g., app.py):

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# ...existing code...
```

This will allow requests from your React app (running on port 3000) to your Flask backend (port 5000).

---

# How to Run Everything

1. **Start your Flask backend** (in your backend folder):

   python app.py

2. **Start your React frontend** (in this folder):

   npm start

---

# Extending the App

To test more endpoints, create new components in `src/` and add them to `App.js`.

---

# Troubleshooting

- If you see CORS errors in the browser, make sure flask-cors is installed and configured as above.
- Make sure your backend is running on `http://localhost:5000` and frontend on `http://localhost:3000` (default for Create React App).
