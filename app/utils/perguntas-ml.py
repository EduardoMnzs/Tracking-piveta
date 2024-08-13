import requests
import time

def atualizar_token(refresh_token):
    # Configurações da API
    id_app = '1883487986840320'
    secret_key = 'pJh5SyiBpzQ1rG8p49WvlMy7ij9UFfaE'

    # URL para solicitar novo token
    url = "https://api.mercadolibre.com/oauth/token"

    # Payload da requisição
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

    # Executar a requisição POST para atualizar o token
    response = requests.post(url, data=payload, headers=headers)

    # Verificar e retornar novo token
    if response.status_code == 200:
        response_json = response.json()
        return response_json['access_token'], response_json['refresh_token']
    else:
        raise Exception(f"Falha ao atualizar o token: {response.status_code} {response.text}")

# Inicializa o token com o valor atual
refresh_token_atual = 'TG-66bbbfa97748bf0001fb14fe-442729255'

# Loop infinito para atualizar o token a cada 4 horas
while True:
    try:
        # Atualiza o token
        access_token, refresh_token_atual = atualizar_token(refresh_token_atual)
        print(f"Token atualizado. Access Token: {access_token}")
    except Exception as e:
        print(f"Erro ao atualizar token: {e}")
    
    # Espera por 4 horas antes da próxima atualização
    time.sleep(14400)  # 4 horas em segundos