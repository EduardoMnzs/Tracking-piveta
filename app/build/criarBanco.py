import psycopg2

con = psycopg2.connect(
	host='localhost', 
	database='Piveta', 
	port='5432',
	user='postgres', 
	password='postgres'
)

cur = con.cursor()

bip = '''CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    codigo_interno VARCHAR(50) NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    chave VARCHAR(70) NOT NULL,
    data_hora VARCHAR(50) NOT NULL
);'''
cur.execute(bip)
con.commit()

sql = '''CREATE TABLE IF NOT EXISTS usuario (
	id_usuario SERIAL NOT NULL UNIQUE PRIMARY KEY,
    email VARCHAR(50) NOT NULL, 
    hash TEXT NOT NULL
);'''
cur.execute(sql)
con.commit()

respostas = '''CREATE TABLE IF NOT EXISTS respostas_ml (
    id SERIAL PRIMARY KEY NOT NULL,
    identificador VARCHAR(25) NOT NULL,
    resposta VARCHAR(255) NOT NULL
);'''
cur.execute(respostas)
con.commit()

con.close()