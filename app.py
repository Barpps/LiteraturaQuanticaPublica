from flask import Flask, send_from_directory
from pathlib import Path

app = Flask(__name__, static_folder="static", static_url_path="/static")


@app.get("/")
def home():
    return send_from_directory("static", "home.html")


@app.get("/home")
@app.get("/home.html")
def home_alias():
    return send_from_directory("static", "home.html")


@app.get("/app")
@app.get("/app.html")
def app_main():
    return send_from_directory("static", "index.html")


@app.get("/index.html")
def legacy_index():
    return send_from_directory("static", "index.html")

@app.get("/favicon.ico")
def favicon():
    return send_from_directory("static", "favicon.ico")

@app.get("/debug")
def debug_index():
    return send_from_directory("static", "index_debug.html")

@app.get("/UAT")
def uat_page():
    return send_from_directory("static", "UAT.html")


if __name__ == "__main__":
    # Para acessar de outros dispositivos na mesma rede:
    # - Servidor escuta em 0.0.0.0 (todas as interfaces)
    # - No PC, descubra o IPv4 local (ex.: 192.168.0.23) e use http://192.168.0.23:5000 no celular.
    app.run(host="0.0.0.0", debug=False)
