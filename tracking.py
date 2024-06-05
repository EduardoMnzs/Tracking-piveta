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