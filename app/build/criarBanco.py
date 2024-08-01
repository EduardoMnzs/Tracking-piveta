import psycopg2

con = psycopg2.connect(
	host='localhost', 
	database='Piveta', 
	port='5432',
	user='postgres', 
	password='piveta'
)

cur = con.cursor()

sql = "CREATE TABLE IF NOT EXISTS usuario(id_usuario SERIAL NOT NULL UNIQUE PRIMARY KEY, email VARCHAR(50) NOT NULL, hash TEXT NOT NULL);"
cur.execute(sql)
con.commit()

con.close()