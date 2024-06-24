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
    if request.method == 'POST':
        codigo_rastreio = request.form['codigo_rastreio']
        registros, error = fetch_tracking_info(codigo_rastreio)
        
        if error:
            return error
            print(registros)
        return render_template('status.html', registros=registros)
    else:
        print(registros)
        return render_template('status.html')


@app.route("/test")
def test():
    return render_template('test.html')