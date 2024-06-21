from nfe import Nfe, ConsultaNfe

# Definir dados de autenticação
certificado = open('certificado.pfx', 'rb').read()
chave_privada = open('chave_privada.key', 'rb').read()
cnpj = '12345678901234'

# Definir parâmetros da consulta
estado = 'SP'  # Sigla do estado
chave_acesso = '35240606013526000192550020000280321080392888'  # Chave de acesso da NFe

# Criar objeto de consulta e realizar consulta
consulta = ConsultaNfe(certificado=certificado, chave_privada=chave_privada, cnpj=cnpj)
resposta = consulta.consultar_nota_fiscal(estado, chave_acesso)

# Tratar o retorno da consulta
if resposta['status'] == '1':  # NFe encontrada
    print(f"NFe com chave {chave_acesso} consultada com sucesso!")
    nfe = Nfe(resposta['xml'])  # Ler dados da NFe em XML
    # Acessar informações da NFe:
    print(f"Emitente: {nfe.emitente.nome}")
    print(f"Valor total: {nfe.total.ICMSTotal.vTot}")
else:
    print(f"Erro na consulta: {resposta['status']}")