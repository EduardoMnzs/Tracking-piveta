import psycopg2
from werkzeug.security import generate_password_hash

con = psycopg2.connect(
	host='localhost', 
	database='Piveta', 
	port='5432',
	user='postgres', 
	password='piveta'
)

cur = con.cursor()

def createUserAdmin():
    sql = """INSERT INTO usuario(email, hash) VALUES ('admin@admin.com', %s);"""
    cur.execute(sql, (generate_password_hash('admin'),))
    con.commit()

createUserAdmin()
con.close()