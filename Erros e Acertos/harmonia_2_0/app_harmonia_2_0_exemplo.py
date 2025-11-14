from flask import Flask, send_from_directory
from pathlib import Path

app = Flask(__name__, static_folder="static", static_url_path="/static")


@app.get("/")
def index():
    return send_from_directory("static", "index.html")

@app.get("/harmonia")
def harmonia():
    return send_from_directory("static", "harmonia.html")

@app.get("/favicon.ico")
def favicon():
    return send_from_directory("static", "favicon.ico")

@app.get("/debug")
def debug_index():
    return send_from_directory("static", "index_debug.html")


if __name__ == "__main__":
    # Runs on http://127.0.0.1:5000
    app.run(debug=False)
