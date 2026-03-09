'''import requests

url="https://api.example.com/users"
response=requests.get(url)
data=response.json()'''


import requests

# URL base del server
BASE_URL = "http://localhost:6969"

def test_ciccio():
    """Testa l'endpoint /ciccio"""
    try:
        response = requests.get(f"{BASE_URL}/ciccio")
        print(f"[GET /ciccio]")
        print(f"Status Code: {response.status_code}")
        print(f"Risposta: {response.text}")
        print("-" * 50)
    except requests.exceptions.RequestException as e:
        print(f"Errore nella richiesta: {e}")

def test_conta(nome=None):
    """Testa l'endpoint /conta con parametro opzionale"""
    try:
        params = {}
        if nome:
            params['nome'] = nome
        
        response = requests.get(f"{BASE_URL}/conta", params=params)
        print(f"[GET /conta]")
        if nome:
            print(f"Parametro: nome={nome}")
        print(f"Status Code: {response.status_code}")
        print(f"Risposta: {response.json()}")
        print("-" * 50)
    except requests.exceptions.RequestException as e:
        print(f"Errore nella richiesta: {e}")

def menu():
    """Menu interattivo per testare il server"""
    while True:
        print("\n=== CLIENT FLASK SERVER ===")
        print("1. Testa /ciccio")
        print("2. Testa /conta (senza nome)")
        print("3. Testa /conta (con nome)")
        print("4. Esci")
        
        scelta = input("\nScegli un'opzione: ")
        
        if scelta == "1":
            test_ciccio()
        elif scelta == "2":
            test_conta()
        elif scelta == "3":
            nome = input("Inserisci il nome: ")
            test_conta(nome)
        elif scelta == "4":
            print("Arrivederci!")
            break
        else:
            print("Opzione non valida!")

if __name__ == "__main__":
    print("=== TEST CLIENT FLASK ===\n")
    
    # Test automatici
    print("Test automatici in corso...\n")
    test_ciccio()
    test_conta()
    test_conta("Marco")
    test_conta("Giulia")
    
    # Menu interattivo
    print("\nVuoi continuare con il menu interattivo? (s/n)")
    risposta = input().lower()
    if risposta == 's':
        menu()