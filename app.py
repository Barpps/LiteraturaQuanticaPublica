import os
from flask import Flask, jsonify, send_from_directory

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

@app.get("/catalogo")
@app.get("/catalogo.html")
def catalogo():
    return send_from_directory("static", "catalogo.html")

@app.get("/guia")
@app.get("/guia.html")
def guia():
    return send_from_directory("static", "guia.html")

@app.get("/links")
@app.get("/links.html")
def links():
    return send_from_directory("static", "links.html")

@app.get("/frequencias")
@app.get("/frequencias.html")
def frequencias():
    return send_from_directory("static", "frequencias.html")


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

@app.get("/healthz")
@app.get("/health")
def healthcheck():
    return jsonify(status="ok"), 200


if __name__ == "__main__":
    # Para acessar de outros dispositivos na mesma rede:
    # - Servidor escuta em 0.0.0.0 (todas as interfaces)
    # - No PC, descubra o IPv4 local (ex.: 192.168.0.23) e use http://192.168.0.23:5000 no celular.
    port = int(os.environ.get("PORT") or os.environ.get("RINGLIGHT_PORT") or 5000)
    app.run(host="0.0.0.0", port=port, debug=False)
