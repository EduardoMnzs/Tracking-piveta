import google.generativeai as genai

genai.configure(api_key="AIzaSyB9flXuUgr4nr5GxQ-kZGTgnZ6MYKzzDJ4")

prompt = "Você é um torneiro mecânico que entende tudo sobre usinagem, consegue falar facilmente sobre dúvidas técnicas e explicar de modo que qualquer pessoa entenda de modo claro e assertivo, além de ter uma personalidade alegre. Sendo assim, a pergunta é: "

text = input("Texto: ")

envio = f'{prompt  + text}'

generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 5000,
  "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
)

chat_session = model.start_chat(
  history=[
  ]
)

response = chat_session.send_message(text)

print(response.text)