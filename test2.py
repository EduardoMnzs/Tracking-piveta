import nfelib
from nfelib.interfaces import NfeConsultaProtocolo

chave_acesso = "35240606013526000192550020000280321080392888"

consulta_protocolo = NfeConsultaProtocolo()

try:
    protocolo = consulta_protocolo.consulta(chave_acesso)
except Exception as e:
    print(f"Erro durante a consulta: {e}")
    exit(1)

print(f"Emitente: {protocolo.emitente.razao_social}")
print(f"Destinatário: {protocolo.destinatario.razao_social}")
print(f"Valor total: {protocolo.valor_total}")

for item in protocolo.itens:
    print(f"Produto: {item.produto.descricao}")
    print(f"Quantidade: {item.quantidade}")
    print(f"Valor unitário: {item.valor_unitario}")
