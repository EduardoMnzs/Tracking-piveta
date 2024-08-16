from app import app
from flask import Flask, render_template, request, Response, jsonify, session, redirect
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from .utils.tracking import fetch_tracking_info
# from .utils.bipagem import gen
from .utils import perguntas_ml
from werkzeug.exceptions import default_exceptions
from werkzeug.security import check_password_hash
from .utils.login import errorhandler, login_required, not_login_required

app.secret_key = '5~n>+1s{wM|vWLng8KZ$LzYq=A7S`gD"wl&M7"tNVR46pEIn?B'


DB_HOST = "localhost"
DB_NAME = "Piveta"
DB_USER = "postgres"
DB_PASS = "postgres"
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

@app.route("/login", methods=["GET", "POST"])
def login():
    db_connection = connect_db()
    cursor = db_connection.cursor()

    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        cursor.execute("SELECT * FROM usuario WHERE email = %s;", (email,))
        rows = cursor.fetchone()

        if not rows or not check_password_hash(rows[2], password):
            cursor.close()
            db_connection.close()
            return render_template("login.html", msg="Credenciais inválidas!")

        session["user_id"] = rows[0]

        if request.form.get('lembrar_me'):
            app.config["PERMANENT_SESSION_LIFETIME"] = 604800  # uma semana
        else:
            app.config["PERMANENT_SESSION_LIFETIME"] = 7200  # duas horas

        cursor.close()
        db_connection.close()
        return redirect("/")
    else:
        return render_template("login.html")

@app.route("/logout", methods=["GET"])
def logout():
    session.clear()
    return redirect("/login")

@app.route("/")
@app.route("/index", methods=["GET"])
@login_required
def index():
    return render_template('index.html')

@app.route("/rastreio", methods=["GET"])
@login_required
def rastreio():
    return render_template('rastreio.html')

@app.route("/status", methods=['GET','POST'])
@login_required
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
    elif status == "Objeto aguardando retirada no endereço indicado":
        return "aguardando.png"
    else:
        return "entregue.png"
    

@app.route("/api/rastreio/<codigo_rastreio>", methods=["GET"])
@login_required
def api_rastreio(codigo_rastreio):
    registros, error = fetch_tracking_info(codigo_rastreio)
    if error:
        return {"error": error}, 400
    return {"registros": registros}, 200

@app.route("/bipagem", methods=["GET"])
@login_required
def bipagem():
    return render_template('bipagem.html')

@app.route('/video_feed', methods=["GET"])
@login_required
def video_feed():
    return Response(gen(), mimetype='multipart/x-mixed-replace; boundary=frame')
    pass #Remova para testes, ass. Eu do passado

@app.route('/add_produtos', methods=['POST'])
@login_required
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

@app.route("/relatorios", methods=["GET"])
@login_required
def relatorios():
    return render_template('relatorios.html')

@app.route("/dashboard", methods=["GET"])
@login_required
def dashboard():
    return render_template('dashboard.html')

@app.route("/perfil", methods=["GET"])
@login_required
def perfil():
    return render_template('perfil.html')

@app.route("/gerenciar-perfil", methods=["GET"])
@login_required
def gerenciarperfil():
    return render_template('gerenciar-perfil.html')

@app.route("/gerenciar-acessos", methods=["GET"])
@login_required
def gerenciaracessos():
    return render_template('gerenciar-acessos.html')

@app.route('/perguntas-mercado-livre')
def perguntas_mercado_livre():
    if 'access_token' not in session or 'refresh_token' not in session:
        refresh_token = 'TG-66bf9f1858d2960001cb1ce4-442729255'
        access_token, refresh_token = perguntas_ml.atualizar_token(refresh_token)
        session['access_token'] = access_token
        session['refresh_token'] = refresh_token
    else:
        access_token = session['access_token']

    filtro_resposta = request.args.get('status_resposta', 'nao_respondidas')
    data_de = request.args.get('data_de', '')
    data_ate = request.args.get('data_ate', '')
    codigo_mlb = request.args.get('codigo_mlb', '')
    
    perguntas, count_nao_respondidas = perguntas_ml.buscar_perguntas(access_token, filtro_resposta, data_de, data_ate, codigo_mlb)
    return render_template('perguntas-ml.html', perguntas=perguntas, count_nao_respondidas=count_nao_respondidas, filtro_atual=filtro_resposta)

@app.route('/enviar-resposta', methods=['POST'])
def handle_enviar_resposta():
    data = request.get_json()
    access_token = session['access_token']

    result = perguntas_ml.enviar_resposta(access_token, data['question_id'], data['text'])
    if result['status'] == 'success':
        return jsonify({'message': result['message']})
    else:
        return jsonify({'error': result['message']}), result.get('code', 500)

@app.route("/test", methods=["GET"])
def test():
    return render_template('test.html')

if __name__ == '__main__':
    app.run(debug=True)