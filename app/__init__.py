from flask import Flask
app = Flask(__name__)
from app import routes
# @app.route("/")
# def hello_world():
#     return "<p>Hello, World!</p>"