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
        return response.json()['access_token'], response.json()['refresh_token']
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

def buscar_perguntas(access_token):
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
            detalhes_produto = buscar_detalhes_produto(access_token, pergunta['item_id'])
            nickname_usuario = buscar_nickname_usuario(access_token, pergunta['from']['id'])
            resposta = None
            if 'answer' in pergunta and pergunta['answer'] is not None:
                resposta = pergunta['answer'].get('text', None)
            else:
                count_nao_respondidas += 1

            mlb = pergunta['item_id']
            data_iso = pergunta['date_created']

            # Usar dateutil.parser para converter a data ISO 8601
            data_obj = parser.isoparse(data_iso)
            data_formatada = data_obj.strftime("%d/%m/%Y - %H:%M")

            perguntas.append({
                'usuario': nickname_usuario,
                'produto': detalhes_produto,
                'texto_pergunta': pergunta['text'],
                'mlb': mlb,
                'data_hora': data_formatada,  # Formato de data atualizado
                'status_resposta': 'Respondido' if resposta else 'Não respondido',
                'resposta': resposta
            })
        return perguntas, count_nao_respondidas
    else:
        raise Exception(f"Falha ao buscar perguntas: {response.status_code} {response.text}")