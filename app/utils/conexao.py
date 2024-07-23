import psycopg2

conexao = psycopg2.connect(
    host="localhost",
    dbname="Piveta",
    user="postgres",
    password="piveta",
    port="5432"
)

print("Informações da conexão:")
print(f"Host: {conexao.get_dsn_parameters()['host']}")
print(f"Database: {conexao.get_dsn_parameters()['dbname']}")
print(f"User: {conexao.get_dsn_parameters()['user']}")
print(f"Port: {conexao.get_dsn_parameters()['port']}")

print("\nStatus da conexão:")
status = conexao.status
if status == psycopg2.extensions.STATUS_READY:
    print("Conexão está pronta para uso.")
elif status == psycopg2.extensions.STATUS_BEGIN:
    print("Transação em andamento.")
elif status == psycopg2.extensions.STATUS_IN_TRANSACTION:
    print("Dentro de uma transação.")
elif status == psycopg2.extensions.STATUS_PREPARED:
    print("Conexão preparada.")
else:
    print("Status desconhecido.")

conexao.close()