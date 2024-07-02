from webdriver_manager.chrome import ChromeDriverManager
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from anticaptchaofficial.hcaptchaproxyon import *
from api_key import ANTICAPTCHA_KEY
import time

navegador = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
link = 'https://www.nfe.fazenda.gov.br/portal/consultaRecaptcha.aspx?tipoConsulta=resumo&tipoConteudo=7PhJ+gAVw2g='
navegador.get(link)

solver = hCaptchaProxyon()
solver.set_verbose(1)
solver.set_key(ANTICAPTCHA_KEY)


time.sleep(100)