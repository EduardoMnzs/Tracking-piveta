import requests
from dateutil import parser

def atualizar_token(refresh_token):
    id_app = '8055882507445030'
    secret_key = 'Mr0owc0YQ1Z9bawR82hJlRlEkwDvw7GW'
    url = "https://api.mercadolibre.com/oauth/token"

    payload = {
        'grant_type': 'refresh_token',
        'client_id': id_app,
        'client_secret': secret_key,
        'refresh_token': refresh_token
    }
    headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.post(url, data=payload, headers=headers)
    if response.status_code == 200:
        response_json = response.json()
        return response_json['access_token'], response_json['refresh_token']
    else:
        raise Exception(f"Falha ao atualizar o token: {response.status_code} {response.text}")

def buscar_detalhes_produto(access_token, item_id):
    url = f"https://api.mercadolibre.com/items/{item_id}"
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        produto = response.json()
        return {
            'titulo': produto['title'],
            'preco': produto['price'],
            'estoque': produto['available_quantity'],
            'vendido': produto['sold_quantity'],
            'thumbnail': produto['thumbnail'],
            'permalink': produto['permalink'],
        }
    else:
        raise Exception(f"Falha ao buscar detalhes do produto: {response.status_code} {response.text}")

def buscar_nickname_usuario(access_token, user_id):
    url = f"https://api.mercadolibre.com/users/{user_id}"
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()['nickname']
    else:
        raise Exception(f"Falha ao buscar informações do usuário: {response.status_code} {response.text}")

def buscar_perguntas(access_token, filtro_resposta, data_de, data_ate, codigo_mlb):
    url = "https://api.mercadolibre.com/my/received_questions/search"
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }

    perguntas = []
    datas_criacao = []  # Lista para armazenar todas as datas de criação
    count_nao_respondidas = 0
    limit = 50  # Limite padrão
    offset = 0
    total_perguntas = None
    max_offset = 1000  # Assumindo um limite de 1000, pode ajustar conforme necessário

    while True:
        if offset >= max_offset:
            break

        params = {
            'limit': limit,
            'offset': offset
        }

        response = requests.get(url, headers=headers, params=params)

        if response.status_code != 200:
            raise Exception(f"Falha ao buscar perguntas: {response.status_code} {response.text}")

        response_data = response.json()
        perguntas_json = response_data.get('questions', [])

        if total_perguntas is None:
            total_perguntas = response_data.get('total', len(perguntas_json))

        if offset >= total_perguntas:
            break

        if not perguntas_json:
            break

        for pergunta in perguntas_json:
            data_pergunta = pergunta['date_created']  # Mantém a data completa

            # Acumula todas as datas de criação
            datas_criacao.append(data_pergunta)

            data_pergunta_formatada = data_pergunta[:10]

            if data_de and data_pergunta_formatada < data_de:
                continue
            if data_ate and data_pergunta_formatada > data_ate:
                continue

            if codigo_mlb and codigo_mlb.lower() not in pergunta['item_id'].lower():
                continue

            # Verifica se a pergunta foi respondida
            if 'answer' in pergunta and pergunta['answer'] is not None:
                if filtro_resposta == 'nao_respondidas':
                    continue
                resposta = pergunta['answer'].get('text', None)
            else:
                if filtro_resposta == 'respondidas':
                    continue
                resposta = None

                # Verifica se a pergunta não foi moderada/removida antes de contar como não respondida
                if pergunta.get('text'):
                    count_nao_respondidas += 1

            # Verifica se o texto da pergunta está vazio ou ausente
            texto_pergunta = pergunta.get('text', '')
            if not texto_pergunta:
                texto_pergunta = "Pergunta removida ou moderada."

            detalhes_produto = buscar_detalhes_produto(access_token, pergunta['item_id'])
            nickname_usuario = buscar_nickname_usuario(access_token, pergunta['from']['id'])

            perguntas.append({
                'usuario': nickname_usuario,
                'produto': detalhes_produto,
                'texto_pergunta': texto_pergunta,
                'mlb': pergunta['item_id'],
                'data_hora': data_pergunta_formatada,
                'status_resposta': 'Respondido' if resposta else 'Não respondido',
                'resposta': resposta,
                'id_pergunta': pergunta['id'],
            })

        offset += limit

    # Encontrar a data de criação mais recente entre todas as datas acumuladas
    data_mais_recente = max(datas_criacao) if datas_criacao else None

    return perguntas, count_nao_respondidas, data_mais_recente

def enviar_resposta(access_token, question_id, text):
    url = "https://api.mercadolibre.com/answers"
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    payload = {
        'question_id': int(question_id),
        'text': text
    }

    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 200:
        return {'status': 'success', 'message': 'Resposta enviada com sucesso!'}
    else:
        return {'status': 'error', 'message': f'Falha ao enviar resposta: {response.text}', 'code': response.status_code}