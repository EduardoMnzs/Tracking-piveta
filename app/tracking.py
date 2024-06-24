from app import app

import requests
from bs4 import BeautifulSoup

def fetch_tracking_info(codigo_rastreio):
    url = f"https://www.correiorastreamento.com/?rastreio={codigo_rastreio}"
    req = requests.post(url=url, data={'objetos': codigo_rastreio})
    registros = []

    if req.status_code == 200:
        soup = BeautifulSoup(req.text, 'html.parser')
        elementos_status = soup.find_all(class_='linha_status')

        for elemento in elementos_status:
            li_elements = elemento.find_all('li')
            registro = {'status': None, 'data': None, 'hora': None, 'origem': None, 'destino': None}
            for li in li_elements:
                li_text = li.text
                if 'Data' in li_text and 'Hora:' in li_text:
                    parts = li_text.split('|')
                    data_part, hora_part = parts
                    registro['data'] = data_part.split(':')[1].strip()
                    registro['hora'] = hora_part.split('Hora:')[1].strip()
                if 'Status:' in li_text:
                    registro['status'] = li_text.split(':', 1)[1].strip()
                if 'Origem:' in li_text:
                    registro['origem'] = li_text.split('Origem:', 1)[1].strip()
                if 'Destino:' in li_text:
                    registro['destino'] = li_text.split('Destino:', 1)[1].strip()

                registros.append(registro)
        return registros, None
    else:
        return None, f"Erro ao acessar o site: {req.status_code}"