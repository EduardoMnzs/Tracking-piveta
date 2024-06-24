import requests
from bs4 import BeautifulSoup

# Valor dinâmico para o rastreamento
codigo_rastreio = 'QC960688065BR'

# Formatando a URL com o valor dinâmico
url = f"https://www.correiorastreamento.com/?rastreio={codigo_rastreio}"

# Fazendo a solicitação POST com a URL formatada
req = requests.post(url=url, data={'objetos': codigo_rastreio})

# Verificando o status da resposta
if req.status_code == 200:
    # Extraindo o conteúdo HTML da resposta
    soup = BeautifulSoup(req.text, 'html.parser')
    
    # Procurando todos os elementos com a classe específica
    elementos_status = soup.find_all(class_='linha_status')
    
    # Inicializando listas para armazenar os dados extraídos
    status = []
    datas = []
    horas = []
    origens = []
    destinos = []
    locais = []

    # Verificando se algum elemento foi encontrado
    if elementos_status:
        for elemento in elementos_status:
            # Encontrando todos os elementos <li> dentro de cada elemento com a classe 'linha_status'
            li_elements = elemento.find_all('li')
            
            registro_temporario = {'status': None, 'data': None, 'hora': None, 'origem': None, 'destino': None, 'local': None}
            
            for li in li_elements:
                # Acessando o texto de cada <li>
                li_text = li.text
                
                # Extrair data e hora, já que ambos estão no mesmo <li>
                if 'Data' in li_text and 'Hora:' in li_text:
                    parts = li_text.split('|')
                    if len(parts) == 2:
                        data_part, hora_part = parts
                        registro_temporario['data'] = data_part.split(':')[1].strip()  # Após 'Data:'
                        registro_temporario['hora'] = hora_part.split('Hora:')[1].strip()  # Após 'Hora:'
                
                # Processando outros campos conforme necessário
                if 'Status:' in li_text:
                    registro_temporario['status'] = li_text.split(':', 1)[1].strip()
                if 'Origem:' in li_text:
                    registro_temporario['origem'] = li_text.split('Origem:', 1)[1].strip()
                if 'Destino:' in li_text:
                    registro_temporario['destino'] = li_text.split('Destino:', 1)[1].strip()
                if 'Local:' in li_text:
                    registro_temporario['local'] = li_text.split('Local:', 1)[1].strip()

            # Adicionando os valores extraídos às listas correspondentes
            status.append(registro_temporario['status'])
            datas.append(registro_temporario['data'])
            horas.append(registro_temporario['hora'])
            origens.append(registro_temporario['origem'] if registro_temporario['origem'] else registro_temporario['local'])
            destinos.append(registro_temporario['destino'])
    
    # Formatando a saída
    for i in range(len(status)):
        local = origens[i] if origens[i] else 'None'
        print(f"Status: {status[i]}")
        print(f"Data: {datas[i]}")
        print(f"Hora: {horas[i]}")
        print(f"Origem: {local}")  # Usamos local para origem se destino estiver vazio
        print(f"Destino: {destinos[i] if destinos[i] else 'None'}")
        print("-" * 40)
else:
    print(f"Erro ao acessar o site: {req.status_code}")

#----------------------------------------------------------------------------------------------#

# import requests
# from bs4 import BeautifulSoup

# codigo_rastreio = (f'OY150279461'+'BR')

# url = f"https://www.correiorastreamento.com/?rastreio={codigo_rastreio}"

# req = requests.post(url=url, data={'objetos': codigo_rastreio})

# if req.status_code == 200:
#     soup = BeautifulSoup(req.text, 'html.parser')
    
#     elementos_status = soup.find_all(class_='linha_status')
    
#     # Verificando se algum elemento foi encontrado
#     if elementos_status:
#         for elemento in elementos_status:
#             # Encontrando todos os elementos <li> dentro de cada elemento com a classe 'linha_status'
#             li_elements = elemento.find_all('li')
#             for li in li_elements:
#                 # Acessando o texto de cada <li>
#                 li_text = li.text
#                 print(li_text)
#     else:
#         print("Nenhum elemento com a classe especificada foi encontrado.")
# else:
#     print(f"Erro ao acessar o site: {req.status_code}")