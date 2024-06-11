# import requests
# from bs4 import BeautifulSoup

# # Valor dinâmico para o rastreamento
# codigo_rastreio = 'QC960688065BR'

# # Formatando a URL com o valor dinâmico
# url = f"https://www.correiorastreamento.com/?rastreio={codigo_rastreio}"

# # Fazendo a solicitação POST com a URL formatada
# req = requests.post(url=url, data={'objetos': codigo_rastreio})

# # Verificando o status da resposta
# if req.status_code == 200:
#     # Extraindo o conteúdo HTML da resposta
#     soup = BeautifulSoup(req.text, 'html.parser')
    
#     # Procurando todos os elementos com a classe específica
#     elementos_status = soup.find_all(class_='linha_status')
    
#     # Inicializando uma lista para armazenar os dados extraídos
#     registros = []

#     # Verificando se algum elemento foi encontrado
#     if elementos_status:
#         for elemento in elementos_status:
#             # Encontrando todos os elementos <li> dentro de cada elemento com a classe 'linha_status'
#             li_elements = elemento.find_all('li')
            
#             # Inicializando um dicionário para armazenar os dados de cada entrada
#             registro = {
#                 'status': None,
#                 'data': None,
#                 'hora': None,
#                 'origem': None,
#                 'destino': None
#             }
            
#             for li in li_elements:
#                 # Acessando o texto de cada <li> e dividindo em palavras
#                 li_text = li.text.split()
                
#                 # Processando o texto dividido para identificar e extrair as informações
#                 if 'Status:' in li_text:
#                     registro['status'] = ' '.join(li_text)
#                 elif 'Data' in li_text:
#                     data_index = li_text.index('Data') + 1
#                     registro['data'] = li_text[data_index + 1]  # Data está após ':'
#                 elif 'Hora:' in li_text:
#                     hora_index = li_text.index('Hora:') + 1
#                     registro['hora'] = li_text[hora_index]
#                 elif 'Origem:' in li_text:
#                     registro['origem'] = ' '.join(li_text)
#                 elif 'Destino:' in li_text:
#                     registro['destino'] = ' '.join(li_text)
            
#             # Adicionando o registro completo à lista de registros
#             registros.append(registro)
    
#     # Formatando a saída
#     for registro in registros:
#         print(f"Status: {registro['status']}")
#         print(f"Data: {registro['data']}")
#         print(f"Hora: {registro['hora']}")
#         print(f"Origem: {registro['origem']}")
#         print(f"Destino: {registro['destino']}")
#         print("-" * 40)
# else:
#     print(f"Erro ao acessar o site: {req.status_code}")

#----------------------------------------------------------------------------------------------#

import requests
from bs4 import BeautifulSoup

codigo_rastreio = (f'OY150279461'+'BR')

url = f"https://www.correiorastreamento.com/?rastreio={codigo_rastreio}"

req = requests.post(url=url, data={'objetos': codigo_rastreio})

if req.status_code == 200:
    soup = BeautifulSoup(req.text, 'html.parser')
    
    elementos_status = soup.find_all(class_='linha_status')
    
    # Verificando se algum elemento foi encontrado
    if elementos_status:
        for elemento in elementos_status:
            # Encontrando todos os elementos <li> dentro de cada elemento com a classe 'linha_status'
            li_elements = elemento.find_all('li')
            for li in li_elements:
                # Acessando o texto de cada <li>
                li_text = li.text
                print(li_text)
    else:
        print("Nenhum elemento com a classe especificada foi encontrado.")
else:
    print(f"Erro ao acessar o site: {req.status_code}")