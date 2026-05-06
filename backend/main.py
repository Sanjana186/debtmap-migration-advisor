from flask import Flask, request, jsonify
from flask_cors import CORS
# from scanner import scan_code       ← comment this for now
# from agent import generate_migration ← comment this for now

app = Flask(__name__)
CORS(app)

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    code = data.get("code", "")

    if not code:
        return jsonify({"error": "No code provided"}), 400

    # Temporary dummy response until A and B finish
    return jsonify({"status": "backend working!", "code_received": code[:50]})

if __name__ == "__main__":
    app.run(debug=True, port=5000)