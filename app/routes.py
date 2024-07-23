from app import app
from flask import Flask, render_template, request, Response, jsonify
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from .utils.tracking import fetch_tracking_info
from .utils.bipagem import gen

DB_HOST = "localhost"
DB_NAME = "Piveta"
DB_USER = "postgres"
DB_PASS = "piveta"
PORT = '5432'

def connect_db():
    conn = psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        port=PORT
    )
    return conn

@app.route("/")
@app.route("/index")
def index():
    return render_template('index.html')

@app.route("/rastreio")
def rastreio():
    return render_template('rastreio.html')

@app.route("/status", methods=['GET','POST'])
def status():
    registros = None
    error = None
    imagem_status = 'error.png'

    if request.method == 'POST':
        codigo_rastreio = request.form.get('codigo_rastreio')
        registros, error = fetch_tracking_info(codigo_rastreio)

        if error:
            return render_template('status.html', error=error)
        if registros:
            ultimo_registro = registros[0]
            imagem_status = selecionar_imagem(ultimo_registro['status'])

    return render_template('status.html', registros=registros, imagem_status=imagem_status, error=error)

def selecionar_imagem(status):
    if status == "Objeto postado após o horário limite da unidade":
        return "postado.png"
    elif status == "Objeto em transferência - por favor aguarde":
        return "transito.png"
    elif status == "Objeto saiu para entrega ao destinatário":
        return "transito.png"
    elif status == "Objeto recusado pelo destinatário":
        return "nao-recebido.png"
    else:
        return "entregue.png"
    

@app.route("/api/rastreio/<codigo_rastreio>")
def api_rastreio(codigo_rastreio):
    registros, error = fetch_tracking_info(codigo_rastreio)
    if error:
        return {"error": error}, 400
    return {"registros": registros}, 200

@app.route("/bipagem")
def bipagem():
    return render_template('bipagem.html')

@app.route('/video_feed')
def video_feed():
    return Response(gen(), mimetype='multipart/x-mixed-replace; boundary=frame')
    pass #Remova para testes, ass. Eu do passado

@app.route('/add_produtos', methods=['POST'])
def add_produtos():
    data = request.get_json()
    produtos = data['produtos']

    conn = connect_db()
    cursor = conn.cursor()

    for produto in produtos:
        codigo_interno = produto['codigo_interno']
        codigo = produto['codigo']
        chave = produto['chave']
        data_hora = produto['data_hora']
        cursor.execute(
            "INSERT INTO produtos (codigo_interno, codigo, chave, data_hora) VALUES (%s, %s, %s, %s)",
            (codigo_interno, codigo, chave, data_hora)
        )

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Produtos adicionados com sucesso!"}), 201

@app.route("/test")
def test():
    return render_template('test.html')

if __name__ == '__main__':
    app.run(debug=True)