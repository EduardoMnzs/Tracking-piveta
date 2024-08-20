import requests
from dateutil import parser

def atualizar_token(refresh_token):
    id_app = '1883487986840320'
    secret_key = 'pJh5SyiBpzQ1rG8p49WvlMy7ij9UFfaE'
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

    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        perguntas_json = response.json()['questions']
        perguntas = []
        count_nao_respondidas = 0

        for pergunta in perguntas_json:
            # Filtrar por data usando strings (assumindo formato 'YYYY-MM-DD')
            data_pergunta = pergunta['date_created'][:10]  # Extrai apenas a parte da data

            if data_de and data_pergunta < data_de:
                continue
            if data_ate and data_pergunta > data_ate:
                continue

            if codigo_mlb and codigo_mlb.lower() not in pergunta['item_id'].lower():
                continue

            # Lógica de resposta
            if 'answer' in pergunta and pergunta['answer'] is not None:
                if filtro_resposta == 'nao_respondidas':
                    continue  # Pula perguntas respondidas se filtrando por não respondidas
                resposta = pergunta['answer'].get('text', None)
            else:
                if filtro_resposta == 'respondidas':
                    continue  # Pula perguntas não respondidas se filtrando por respondidas
                resposta = None
                count_nao_respondidas += 1

            detalhes_produto = buscar_detalhes_produto(access_token, pergunta['item_id'])
            nickname_usuario = buscar_nickname_usuario(access_token, pergunta['from']['id'])

            perguntas.append({
                'usuario': nickname_usuario,
                'produto': detalhes_produto,
                'texto_pergunta': pergunta['text'],
                'mlb': pergunta['item_id'],
                'data_hora': data_pergunta, 
                'status_resposta': 'Respondido' if resposta else 'Não respondido',
                'resposta': resposta,
                'id_pergunta': pergunta['id'],
            })

        return perguntas, count_nao_respondidas
    else:
        raise Exception(f"Falha ao buscar perguntas: {response.status_code} {response.text}")

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