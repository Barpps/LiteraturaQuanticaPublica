from flask import Flask, send_from_directory
from pathlib import Path

app = Flask(__name__, static_folder="static", static_url_path="/static")


@app.get("/")
def index():
    return send_from_directory("static", "index.html")


if __name__ == "__main__":
    # Runs on http://127.0.0.1:5000
    app.run(debug=False)

