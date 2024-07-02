from app import app
from flask import Flask, render_template, request
from .tracking import fetch_tracking_info

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
    elif status == "Objeto recusado pelo destinatário": #manutenção quando recusado
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

@app.route("/test")
def test():
    return render_template('test.html')