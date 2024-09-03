from app import app
from flask import Flask, render_template, request, Response, jsonify, session, redirect
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from .utils.tracking import fetch_tracking_info
# from .utils.bipagem import gen
from .utils import perguntas_ml
from werkzeug.security import check_password_hash
from .utils.login import login_required
import google.generativeai as genai

app.secret_key = '5~n>+1s{wM|vWLng8KZ$LzYq=A7S`gD"wl&M7"tNVR46pEIn?B01'
genai.configure(api_key="AIzaSyB9flXuUgr4nr5GxQ-kZGTgnZ6MYKzzDJ4")

generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 1500,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)


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
@login_required
def perguntas_mercado_livre():

    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("SELECT UPPER(identificador), resposta, id FROM respostas_ml")
    respostas = cursor.fetchall()

    cursor.close()
    conn.close()

    codigo_mlb = request.args.get('codigo_mlb', '')
    data_de = request.args.get('data_de', '')
    data_ate = request.args.get('data_ate', '')
    filtro_resposta = request.args.get('status_resposta', 'nao_respondidas')

    if 'access_token' not in session or 'refresh_token' not in session:
        refresh_token = 'TG-66c8d2fd9bc6d70001c5cf46-492958575'
        access_token, refresh_token = perguntas_ml.atualizar_token(refresh_token)
        session['access_token'] = access_token
        session['refresh_token'] = refresh_token
    else:
        access_token = session['access_token']
        try:
            perguntas, count_nao_respondidas, data_mais_recente = perguntas_ml.buscar_perguntas(access_token, filtro_resposta, data_de, data_ate, codigo_mlb)
        except Exception as e:
            if 'invalid access token' in str(e):
                access_token, refresh_token = perguntas_ml.atualizar_token(session['refresh_token'])
                session['access_token'] = access_token
                session['refresh_token'] = refresh_token
                perguntas, count_nao_respondidas = perguntas_ml.buscar_perguntas(access_token, filtro_resposta, data_de, data_ate, codigo_mlb)
            else:
                raise e
    
    # print(f"Perguntas: {perguntas}\n")
    # print(f"Respostas: {respostas}\n")
    
    return render_template('perguntas-ml.html', perguntas=perguntas, count_nao_respondidas=count_nao_respondidas, filtro_atual=filtro_resposta, respostas=respostas)

@app.route('/enviar-resposta', methods=['POST'])
@login_required
def handle_enviar_resposta():
    data = request.get_json()
    access_token = session['access_token']

    result = perguntas_ml.enviar_resposta(access_token, data['question_id'], data['text'])
    if result['status'] == 'success':
        return jsonify({'message': result['message']})
    else:
        return jsonify({'error': result['message']}), result.get('code', 500)
    
@app.route('/add_resposta', methods=['POST'])
@login_required
def add_resposta():
    data = request.json
    identificador = data.get('identificador')
    resposta = data.get('resposta')

    if not identificador or not resposta:
        return jsonify({'status': 'error', 'message': 'Identificador ou resposta ausente'}), 400

    try:
        with connect_db() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    "INSERT INTO respostas_ml (identificador, resposta) VALUES (%s, %s) RETURNING id",
                    (identificador, resposta)
                )
                new_id = cursor.fetchone()[0]
            conn.commit()

        return jsonify({'status': 'success', 'message': 'Resposta adicionada com sucesso!', 'id': new_id})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
    
@app.route('/update_resposta', methods=['POST'])
@login_required
def update_resposta():
    data = request.json
    id_resposta = data.get('id')
    nova_resposta = data.get('resposta')

    if id_resposta and nova_resposta:
        try:
            conn = connect_db()
            cursor = conn.cursor()
            cursor.execute("UPDATE respostas_ml SET resposta = %s WHERE id = %s", (nova_resposta, id_resposta))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({'status': 'success'})
        except Exception as e:
            return jsonify({'status': 'error', 'message': str(e)}), 500
    else:
        return jsonify({'status': 'error', 'message': 'Dados insuficientes fornecidos'}), 400
    
@app.route('/delete_resposta', methods=['POST'])
@login_required
def delete_resposta():
    data = request.json
    id_resposta = data.get('id')

    if not id_resposta:
        return jsonify({'status': 'error', 'message': 'ID da resposta ausente'}), 400

    try:
        excluir_resposta_no_banco(id_resposta)
        return jsonify({'status': 'success', 'message': 'Resposta excluída com sucesso!'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
    
def excluir_resposta_no_banco(id_resposta):
    with connect_db() as conn:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM respostas_ml WHERE id = %s", (id_resposta,))
        conn.commit()

def get_suggestions_from_db(query):
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("SELECT identificador, resposta FROM respostas_ml WHERE identificador ILIKE %s", (f'%{query}%',))
    resultados = cursor.fetchall()

    cursor.close()
    conn.close()

    suggestions = [{'identificador': resultado[0], 'resposta': resultado[1]} for resultado in resultados]

    return suggestions

@app.route('/get_suggestions', methods=['GET'])
@login_required
def get_suggestions():
    query = request.args.get('query', '').lstrip('#')
    suggestions = get_suggestions_from_db(query)
    return jsonify(suggestions)

@app.route('/get_quick_responses', methods=['GET'])
@login_required
def get_quick_responses():
    try:
        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute("SELECT identificador, resposta FROM respostas_ml")
        quick_responses = cursor.fetchall()
        
        quick_responses_list = [{'identificador': row[0], 'resposta': row[1]} for row in quick_responses]

        cursor.close()
        conn.close()
        
        return jsonify({'status': 'success', 'data': quick_responses_list})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
    
@app.route('/chat', methods=['POST'])
@login_required
def chat():
    data = request.get_json()
    text = data.get('text', '')

    prompt = """Você é um torneiro mecânico chamado 'Avanço' que entende tudo sobre usinagem, 
    consegue falar facilmente sobre dúvidas técnicas e explicar de modo que qualquer pessoa entenda de modo claro e assertivo, 
    além de ter uma personalidade alegre mas com seriedade e firmeza na fala. 
    Seja direto e não precisa se apresentar a cada resposta técnica. 
    Sendo assim, a pergunta é: """

    envio = f'{prompt + text}'

    chat_session = model.start_chat(history=[])
    response = chat_session.send_message(envio)

    return jsonify({'response': response.text})

@app.route("/chat-bot", methods=["GET"])
@login_required
def chatBot():
    return render_template('chat-bot.html')

@app.route("/documentacao", methods=["GET"])
@login_required
def documentacao():
    return render_template('documentacao.html')

@app.route("/ticket-user", methods=["GET"])
@login_required
def ticket_user():
    return render_template('ticket_user.html')

@app.route("/test", methods=["GET"])
def test():
    return render_template('test.html')

if __name__ == '__main__':
    app.run(debug=True)