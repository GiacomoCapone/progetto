from flask import Flask, request, jsonify
import logging 


#Server
log = logging.getLogger("werkzeug")
log.setLevel(logging.ERROR)

app = Flask(__name__)
@app.route("/ciccio", methods=["GET"])
def ciccio():
    return "ok"

@app.route("/conta", methods=["GET"])
def conta():
    nome=request.args.get("nome", "amico")
    return jsonify({"messeggio": f"ciao {nome}"})


if __name__ == "__main__":
    app.run(port=6969, debug=True)