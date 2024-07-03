from webdriver_manager.chrome import ChromeDriverManager
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from anticaptchaofficial.hcaptchaproxyless import *
from app.utils.api_key import ANTICAPTCHA_KEY
import time

navegador = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
link = 'https://www.nfe.fazenda.gov.br/portal/consultaRecaptcha.aspx?tipoConsulta=resumo&tipoConteudo=7PhJ+gAVw2g='
navegador.get(link)

WebDriverWait(navegador, 10).until(EC.visibility_of_element_located((By.ID, 'ctl00_ContentPlaceHolder1_txtChaveAcessoResumo')))
navegador.find_element(By.ID, 'ctl00_ContentPlaceHolder1_txtChaveAcessoResumo').send_keys('35240606013526000192550020000280321080392888')

chave_captcha = WebDriverWait(navegador, 10).until(EC.visibility_of_element_located((By.CLASS_NAME, 'h-captcha'))).get_attribute('data-sitekey')

solver = hCaptchaProxyless()
solver.set_verbose(1)
solver.set_key(ANTICAPTCHA_KEY)
solver.set_website_url(link)
solver.set_website_key(chave_captcha)
resposta = solver.solve_and_return_solution()

if resposta:
    print(resposta)

    script_show = "document.getElementsByName('h-captcha-response')[0].style.display = 'block';"
    navegador.execute_script(script_show)
    time.sleep(1)
    script_set = f"document.getElementsByName('h-captcha-response')[0].value = '{resposta}';"
    navegador.execute_script(script_set)

    submit_button = WebDriverWait(navegador, 10).until(EC.element_to_be_clickable((By.ID, "ctl00_ContentPlaceHolder1_btnConsultarHCaptcha")))
    submit_button.click()

else:
    print(solver.err_string)

time.sleep(1000)