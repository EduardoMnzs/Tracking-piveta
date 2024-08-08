import requests

# Substitua pelo seu Access Token
access_token = 'APP_USR-1883487986840320-080807-521ffe8b434409b55583e42f539e946d-442729255'

# Substitua pelo ID do anúncio
item_id = 'ID_DO_ANÚNCIO'

# URL para acessar as perguntas do anúncio
url = f'https://api.mercadolibre.com/questions/search?item={item_id}&access_token={access_token}'

# Fazer a requisição
response = requests.get(url)

# Verificar se a requisição foi bem-sucedida
if response.status_code == 200:
    data = response.json()
    questions = data['questions']
    for question in questions:
        print(f"Pergunta: {question['text']}")
        print(f"Status: {question['status']}")
        if 'answer' in question:
            print(f"Resposta: {question['answer']['text']}")
else:
    print("Falha na requisição:", response.status_code)